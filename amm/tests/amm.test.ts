import { Cl } from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;
const charlie = accounts.get("wallet_3")!;

const mockTokenOne = Cl.contractPrincipal(deployer, "mock-token");
const mockTokenTwo = Cl.contractPrincipal(deployer, "mock-token-2");

function createPool() {
  return simnet.callPublicFn(
    "amm",
    "create-pool",
    [mockTokenOne, mockTokenTwo, Cl.uint(500)],
    alice
  );
}

function addLiquidity(account: string, amount0: number, amount1: number) {
  return simnet.callPublicFn(
    "amm",
    "add-liquidity",
    [
      mockTokenOne,
      mockTokenTwo,
      Cl.uint(500),
      Cl.uint(amount0),
      Cl.uint(amount1),
      Cl.uint(0),
      Cl.uint(0),
    ],
    account
  );
}

function removeLiquidity(account: string, liquidity: number) {
  return simnet.callPublicFn(
    "amm",
    "remove-liquidity",
    [mockTokenOne, mockTokenTwo, Cl.uint(500), Cl.uint(liquidity)],
    account
  );
}

function swap(account: string, inputAmount: number, zeroForOne: boolean) {
  return simnet.callPublicFn(
    "amm",
    "swap",
    [
      mockTokenOne,
      mockTokenTwo,
      Cl.uint(500),
      Cl.uint(inputAmount),
      Cl.bool(zeroForOne),
    ],
    account
  );
}

function getPoolId() {
  return simnet.callReadOnlyFn(
    "amm",
    "get-pool-id",
    [
      Cl.tuple({
        "token-0": mockTokenOne,
        "token-1": mockTokenTwo,
        fee: Cl.uint(500),
      }),
    ],
    alice
  );
}

describe("AMM Tests", () => {
  beforeEach(() => {
    const allAccounts = [alice, bob, charlie];

    for (const account of allAccounts) {
      simnet.callPublicFn(
        "mock-token",
        "mint",
        [Cl.uint(1_000_000_000), Cl.principal(account)],
        account
      );

      simnet.callPublicFn(
        "mock-token-2",
        "mint",
        [Cl.uint(1_000_000_000), Cl.principal(account)],
        account
      );
    }
  });

  it("allows pool creation", () => {
    const { result } = createPool();
    expect(result).toBeOk(Cl.bool(true));
  });

  it("disallows creation of same pool twice", () => {
    const { result: result1 } = createPool();
    expect(result1).toBeOk(Cl.bool(true));

    const { result: result2 } = createPool();
    expect(result2).toBeErr(Cl.uint(200));
  });

  it("adds initial liquidity in whatever ratio", () => {
    createPool();
    const addLiqRes = addLiquidity(alice, 1000000, 500000);
    expect(addLiqRes.result).toBeOk(Cl.bool(true));
  });

  it("requires n+1 add liquidity calls to maintain ratio", () => {
    createPool();
    addLiquidity(alice, 1000000, 500000);
    const secondAddLiqRes = addLiquidity(alice, 5000, 10000000);
    expect(secondAddLiqRes.result).toBeOk(Cl.bool(true));
    expect(secondAddLiqRes.events[0].data.amount).toBe("5000");
    expect(secondAddLiqRes.events[1].data.amount).toBe("2500");
  });

  it("allows removing liquidity except minimum liquidity", () => {
    createPool();
    addLiquidity(alice, 1000000, 500000);

    const { result: poolId } = getPoolId();
    const aliceLiquidity = simnet.callReadOnlyFn(
      "amm",
      "get-position-liquidity",
      [poolId, Cl.principal(alice)],
      alice
    );
    expect(aliceLiquidity.result).toBeOk(Cl.uint(706106));

    const { result, events } = removeLiquidity(alice, 706106);
    expect(result).toBeOk(Cl.bool(true));

    const tokenOneAmountWithdrawn = parseInt(events[0].data.amount);
    const tokenTwoAmountWithdrawn = parseInt(events[1].data.amount);

    expect(tokenOneAmountWithdrawn).toBe(998585);
    expect(tokenTwoAmountWithdrawn).toBe(499292);
  });

  it("should allow for swaps", () => {
    createPool();
    addLiquidity(alice, 1000000, 500000);

    const { result, events } = swap(alice, 100000, true);

    expect(result).toBeOk(Cl.bool(true));
    expect(events[0].data.amount).toBe("100000");
    expect(events[1].data.amount).toBe("43183");
  });

  it("should distribute fees earned amongst LPs", () => {
    createPool();
    addLiquidity(alice, 1000000, 500000);

    swap(alice, 100000, true);

    const withdrawableTokenOnePreSwap = 998585;
    const withdrawableTokenTwoPreSwap = 499292;

    const { result, events } = removeLiquidity(alice, 706106);
    expect(result).toBeOk(Cl.bool(true));

    const tokenOneAmountWithdrawn = parseInt(events[0].data.amount);
    const tokenTwoAmountWithdrawn = parseInt(events[1].data.amount);

    expect(tokenOneAmountWithdrawn).toBeGreaterThan(
      withdrawableTokenOnePreSwap
    );
    expect(tokenTwoAmountWithdrawn).toBeLessThan(withdrawableTokenTwoPreSwap);
  });
});