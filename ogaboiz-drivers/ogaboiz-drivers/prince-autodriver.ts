/**
 * Automated Mainnet Driver for Dev-Uche's Contracts
 * 
 * Interactive with:
 *  - faucet-stx
 *  - kv-store
 *  - message-board
 * 
 * Usage:
 *   node --import tsx x-temp/prince-autodriver.ts
 *   node --import tsx x-temp/prince-autodriver.ts --fast
 */

import fs from "fs";
import path from "path";
import toml from "toml";

import {
  AnchorMode,
  PostConditionMode,
  makeContractCall,
  broadcastTransaction,
  principalCV,
  uintCV,
  boolCV,
  stringAsciiCV, // Changed to Ascii as per contracts
  cvToJSON,
  cvToString,
  cvToHex,
  ClarityValue,
} from "@stacks/transactions";
import { createNetwork, TransactionVersion } from "@stacks/network";
import { generateWallet, getStxAddress } from "@stacks/wallet-sdk";

/**
 * Dev-uche's deployed contracts (mainnet).
 * Address: SPA43VC8660WWNRHHWSXGK2VR4BVHGWN0YQ5YXQH
 */
const DEPLOYED = {
  ogaboiz: {
    label: "ogaboiz",
    address: "SPA43VC8660WWNRHHWSXGK2VR4BVHGWN0YQ5YXQH",
    contracts: {
      faucet: "faucet-stx",
      kvStore: "kv-store",
      messageBoard: "message-board",
    },
    settingsAccountKey: "ogaboiz",
  },
} as const;

type DeployerKey = keyof typeof DEPLOYED;

const network = createNetwork("mainnet");

/**
 * Read mnemonic from settings/Mainnet.toml
 */
function readMnemonic(accountKey: string): string {
  const settingsPath = path.join(process.cwd(), "Mainnet.toml");
  if (!fs.existsSync(settingsPath)) {
    throw new Error(`Settings file not found: ${settingsPath}`);
  }
  const content = fs.readFileSync(settingsPath, "utf-8");
  const config = toml.parse(content);
  const mnemonic = config.accounts?.[accountKey]?.mnemonic;
  if (!mnemonic) {
    throw new Error(`Mnemonic not found for account: ${accountKey}`);
  }
  return mnemonic;
}

/**
 * Get signer info for a deployer.
 */
async function signerForDeployer(deployer: DeployerKey) {
  const { settingsAccountKey, address } = DEPLOYED[deployer];
  const mnemonic = readMnemonic(settingsAccountKey);
  const wallet = await generateWallet({
    secretKey: mnemonic,
    password: "",
  });
  const account = wallet.accounts[0];
  const senderKey = account.stxPrivateKey;
  const senderAddress = getStxAddress({
    account,
    transactionVersion: TransactionVersion.Mainnet,
  });
  
  // Warn if mismatch, but don't hard crash to allow flexibility if user is testing with different keys
  if (senderAddress !== address) {
    console.warn(`\n⚠️  Address mismatch for ${deployer}!`);
    console.warn(`   Expected: ${address}`);
    console.warn(`   Derived:  ${senderAddress}`);
    console.warn(`   Proceeding with derived address...\n`);
  }
  return { senderKey, senderAddress };
}

/**
 * Call a contract function.
 */
async function callContract(opts: {
  deployer: DeployerKey;
  contractName: string;
  functionName: string;
  functionArgs: ClarityValue[];
  fee?: number;
}): Promise<any> {
  const { senderKey, senderAddress } = await signerForDeployer(opts.deployer);
  const contractAddress = DEPLOYED[opts.deployer].address;

  const tx = await makeContractCall({
    contractAddress,
    contractName: opts.contractName,
    functionName: opts.functionName,
    functionArgs: opts.functionArgs,
    senderKey,
    network,
    postConditionMode: PostConditionMode.Allow,
    fee: opts.fee ?? 10000,
  });

  try {
    const result = await broadcastTransaction({ transaction: tx, network });
    return result;
  } catch (err: any) {
    console.error(`  ❌ Error broadcasting:`, err.message);
    throw err;
  }
}

/**
 * Action definition.
 */
type Action = {
  name: string;
  deployer: DeployerKey;
  contractName: string;
  functionName: string;
  getArgs: () => Promise<ClarityValue[]> | ClarityValue[];
};

const ACTIONS: Action[] = [


  // KV-Store: put
  {
    name: "kv-store:put",
    deployer: "ogaboiz",
    contractName: DEPLOYED.ogaboiz.contracts.kvStore,
    functionName: "put",
    getArgs: () => {
      const keys = ["user_1", "config", "status", "version", "demo"];
      const vals = ["active", "v1.0.0", "enabled", "testing", "hello world"];
      const key = keys[Math.floor(Math.random() * keys.length)];
      const val = vals[Math.floor(Math.random() * vals.length)];
      return [stringAsciiCV(key), stringAsciiCV(val)];
    },
  },

  // Message-Board: set-message
  {
    name: "msg-board:set",
    deployer: "ogaboiz",
    contractName: DEPLOYED.ogaboiz.contracts.messageBoard,
    functionName: "set-message",
    getArgs: () => {
      const messages = [
        "Hello Stacks!",
        "Automated Defi Yield",
        "Testing ogaboiz contracts",
        "Blockchain is forever",
        "Keep building",
        "Stacks Nakamoto is live",
        "Bitcoin L2 is here",
        "Can't stop the signal",
        "To the moon 🚀",
        "Web3 is the future",
        "Decentralization matters",
        "Code is law",
        "Building in public",
        "Just a random ping",
        "Crypto never sleeps",
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      return [stringAsciiCV(msg)];
    },
  },
];

/**
 * Pick a random action.
 */
function pickRandomAction(): Action {
  return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
}

/**
 * Pick a random delay in milliseconds.
 */
function pickRandomDelayMs(fastMode: boolean): number {
  if (fastMode) {
    return Math.floor(Math.random() * 4000) + 1000; // 1-5s
  }
  return Math.floor(Math.random() * 60000) + 15000; // 15s - 1min
}

/**
 * Delay helper.
 */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    function onAbort() {
      clearTimeout(timer);
      return reject(new Error("aborted"));
    }
    signal?.addEventListener("abort", onAbort);
  });
}

async function executeAction(action: Action): Promise<string> {
  console.log(`\n[${action.name}] Preparing transaction...`);
  console.log(`  Caller: ${DEPLOYED[action.deployer].label}`);
  console.log(`  Contract: ${action.contractName}`);
  console.log(`  Function: ${action.functionName}`);

  try {
    const args = await action.getArgs();
    
    const result = await callContract({
      deployer: action.deployer,
      contractName: action.contractName,
      functionName: action.functionName,
      functionArgs: args,
    });

    // Handle both string and object responses
    const txid = typeof result === "string" ? result : result?.txid;
    const isError = typeof result === "object" && result && "error" in result;

    if (txid && !isError) {
      console.log(`✅ Broadcasted: ${txid}`);
      return txid;
    } else {
      console.log(`❌ Failed to broadcast`);
      if (typeof result === "object" && result && "reason" in result) {
          console.log(`   Reason: ${result.reason}`);
      }
      if (typeof result === "object" && result && "error" in result) {
          console.log(`   Error: ${result.error}`);
      }
      return "";
    }
  } catch (err: any) {
    if (err.message.includes("ConflictingNonce")) {
       console.log(`⚠️  Skipping: Nonce conflict via error catch`);
       return "";
    }
    console.error(`❌ Execution error:`, err.message);
    return "";
  }
}

async function main() {
  const fastMode = process.argv.includes("--fast");

  console.log("🤖 Prince (Ogaboiz) Automated Mainnet Driver Starting...");
  console.log(`   Target Address: ${DEPLOYED.ogaboiz.address}`);
  
  if (fastMode) {
    console.log("⚡ FAST mode enabled: shortened delays (1-5s)");
  } else {
    console.log("⏱️  Normal mode: delays (15s - 60s)");
  }

  console.log("\n📋 Available actions:");
  ACTIONS.forEach((action, i) => {
    console.log(`  ${i + 1}. ${action.name} (${DEPLOYED[action.deployer].label})`);
  });

  console.log("\n🔑 Verifying mnemonics...");
  try {
    const ogaboizSigner = await signerForDeployer("ogaboiz");
    console.log(`  ✓ Signer ready: ${ogaboizSigner.senderAddress}`);
  } catch (e) {
    console.error("❌ Failed to verify mnemonics:", (e as Error).message);
    process.exit(1);
  }

  console.log("\n🚀 Starting automated interactions...");
  console.log("   Press Ctrl+C to stop\n");

  const abortController = new AbortController();
  process.on("SIGINT", () => {
    console.log("\n\n⏹️  Received SIGINT. Stopping gracefully...");
    abortController.abort();
  });

  let iteration = 0;
  try {
    while (!abortController.signal.aborted) {
      iteration++;
      const delayMs = pickRandomDelayMs(fastMode);
      const delaySec = Math.floor(delayMs / 1000);
      console.log(`\n⏳ [Iteration ${iteration}] Waiting ${delaySec}s before next action...`);
      await delay(delayMs, abortController.signal);

      const action = pickRandomAction();
      await executeAction(action);
    }
  } catch (err: any) {
    if (err.message === "aborted") {
      // Expected
    } else {
      console.error("Unexpected error:", err);
    }
  }

  console.log(`\n✋ Automated driver stopped.`);
  console.log(`   Total iterations: ${iteration}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
