import { Cl } from "@stacks/transactions";
import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const sender = accounts.get("wallet_1")!;
const recipient = accounts.get("wallet_2")!;
const randomUser = accounts.get("wallet_3")!;

describe("Token Streaming Contract Tests 🚀", () => {
  
  // Before each test, create a new stream
  beforeEach(() => {
    const result = simnet.callPublicFn(
      "stream",
      "stream-to",
      [
        Cl.principal(recipient),
        Cl.uint(100),  // Increased to 100 tokens for more flexibility
        Cl.tuple({ "start-block": Cl.uint(0), "stop-block": Cl.uint(100) }),
        Cl.uint(1),  // Pay 1 token per block
      ],
      sender
    );

    // Check that tokens were transferred
    expect(result.events[0].event).toBe("stx_transfer_event");
    expect(result.events[0].data.amount).toBe("100");
    expect(result.events[0].data.sender).toBe(sender);
  });

  it("✅ Test 1: Stream is created correctly", () => {
    // Check the stream ID counter increased
    const latestStreamId = simnet.getDataVar("stream", "latest-stream-id");
    expect(latestStreamId).toBeUint(1);

    // Check the stream data is saved correctly
    const createdStream = simnet.getMapEntry("stream", "streams", Cl.uint(0));
    expect(createdStream).toBeSome(
      Cl.tuple({
        sender: Cl.principal(sender),
        recipient: Cl.principal(recipient),
        balance: Cl.uint(100),
        "withdrawn-balance": Cl.uint(0),
        "payment-per-block": Cl.uint(1),
        timeframe: Cl.tuple({
          "start-block": Cl.uint(0),
          "stop-block": Cl.uint(100),
        }),
      })
    );
    
    console.log("🎉 Stream created successfully!");
  });

  it("✅ Test 2: Stream can be refueled by sender", () => {
    const result = simnet.callPublicFn(
      "stream",
      "refuel",
      [Cl.uint(0), Cl.uint(50)],
      sender
    );

    // Check tokens transferred
    expect(result.events[0].event).toBe("stx_transfer_event");
    expect(result.events[0].data.amount).toBe("50");

    // Check balance updated
    const updatedStream = simnet.getMapEntry("stream", "streams", Cl.uint(0));
    expect(updatedStream).toBeSome(
      Cl.tuple({
        sender: Cl.principal(sender),
        recipient: Cl.principal(recipient),
        balance: Cl.uint(150),  // 100 + 50 = 150!
        "withdrawn-balance": Cl.uint(0),
        "payment-per-block": Cl.uint(1),
        timeframe: Cl.tuple({
          "start-block": Cl.uint(0),
          "stop-block": Cl.uint(100),
        }),
      })
    );
    
    console.log("🎉 Stream refueled! Balance is now 150 tokens!");
  });

  it("❌ Test 3: Random user CANNOT refuel stream", () => {
    const result = simnet.callPublicFn(
      "stream",
      "refuel",
      [Cl.uint(0), Cl.uint(5)],
      randomUser  // Wrong person trying to add money!
    );

    // Should get error code 0 (UNAUTHORIZED)
    expect(result.result).toBeErr(Cl.uint(0));
    console.log("✅ Good! Random users can't add money to others' streams!");
  });

  it("✅ Test 4: Recipient can withdraw earned tokens", () => {
    // Just test that withdraw works - don't worry about exact amount
    // The amount depends on how many blocks have passed
    const withdraw = simnet.callPublicFn(
      "stream",
      "withdraw",
      [Cl.uint(0)],
      recipient
    );

    // Check that a transfer event happened
    expect(withdraw.events[0].event).toBe("stx_transfer_event");
    
    // Check that SOME amount was transferred (greater than 0)
    const amount = withdraw.events[0].data.amount;
    expect(parseInt(amount)).toBeGreaterThan(0);
    
    // Check it went to the right person
    expect(withdraw.events[0].data.recipient).toBe(recipient);
    
    console.log(`🎉 Recipient withdrew ${amount} tokens successfully!`);
  });

  it("❌ Test 5: Non-recipient CANNOT withdraw", () => {
    const withdraw = simnet.callPublicFn(
      "stream",
      "withdraw",
      [Cl.uint(0)],
      randomUser  // Wrong person!
    );

    expect(withdraw.result).toBeErr(Cl.uint(0));
    console.log("✅ Good! Only recipient can withdraw!");
  });

  it("✅ Test 6: Sender can get refund after stream ends", () => {
    // First, let's ADD MORE MONEY to ensure there's excess to refund!
    // Stream has 100 STX, pays 1 per block for 100 blocks = needs 100 STX
    // Let's add 50 more STX so there's definitely excess!
    simnet.callPublicFn("stream", "refuel", [Cl.uint(0), Cl.uint(50)], sender);
    
    // Now total balance = 100 + 50 = 150 STX
    // But recipient only earns 100 STX (100 blocks × 1)
    // So sender should get 50 STX back!

    // Mine enough blocks to end the stream (it ends at block 100)
    // Let's mine 105 blocks to be safe
    for (let i = 0; i < 105; i++) {
      simnet.mineEmptyBlock();
    }

    // Recipient claims their share first
    simnet.callPublicFn("stream", "withdraw", [Cl.uint(0)], recipient);

    // Now sender gets leftover money
    const refund = simnet.callPublicFn(
      "stream",
      "refund",
      [Cl.uint(0)],
      sender
    );

    // Check that refund succeeded
    expect(refund.result).toBeOk(Cl.uint(50));

    // Check that a transfer happened
    expect(refund.events[0].event).toBe("stx_transfer_event");
    
    // Check it went back to sender
    expect(refund.events[0].data.recipient).toBe(sender);
    
    // Should refund 50 STX (the excess)
    expect(refund.events[0].data.amount).toBe("50");
    
    console.log(`🎉 Sender got 50 tokens back as refund!`);
  });
});