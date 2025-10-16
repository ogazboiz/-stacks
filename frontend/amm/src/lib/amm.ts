import { STACKS_TESTNET } from "@stacks/network";
import {
  boolCV,
  bufferCV,
  Cl,
  cvToHex,
  fetchCallReadOnlyFunction,
  hexToCV,
  principalCV,
  PrincipalCV,
  uintCV,
  UIntCV,
} from "@stacks/transactions";

// AMM Contract deployed on testnet
// Use the exact address from your wallet (the one that shows in the popup)
const AMM_CONTRACT_ADDRESS = "STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD";
const AMM_CONTRACT_NAME = "amm";
const AMM_CONTRACT_PRINCIPAL = `${AMM_CONTRACT_ADDRESS}.${AMM_CONTRACT_NAME}`;

type ContractEvent = {
  event_index: number;
  event_type: string;
  tx_id: string;
  contract_log: {
    contract_id: string;
    topic: string;
    value: {
      hex: string;
      repr: string;
    };
  };
};

type PoolCV = {
  "token-0": PrincipalCV;
  "token-1": PrincipalCV;
  fee: UIntCV;
  liquidity: UIntCV;
  "balance-0": UIntCV;
  "balance-1": UIntCV;
};

export type Pool = {
  id: string;
  "token-0": string;
  "token-1": string;
  fee: number;
  liquidity: number;
  "balance-0": number;
  "balance-1": number;
};

// Cache for pools data
let poolsCache: Pool[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

// Rate limiting helper
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to clear the pools cache (useful after creating new pools)
export function clearPoolsCache() {
  poolsCache = null;
  cacheTimestamp = 0;
}

// Test function to directly check if we can call the contract
export async function testContractDirectly() {
  try {
    console.log("Testing direct contract call...");
    
    // First, let's try to get the pool ID for our known pool
    const poolIdResult = await fetchCallReadOnlyFunction({
      contractAddress: AMM_CONTRACT_ADDRESS,
      contractName: AMM_CONTRACT_NAME,
      functionName: "get-pool-id",
      functionArgs: [
        Cl.tuple({
          "token-0": Cl.principal("STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token"),
          "token-1": Cl.principal("STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token-2"),
          fee: Cl.uint(500),
        }),
      ],
      senderAddress: AMM_CONTRACT_ADDRESS,
      network: STACKS_TESTNET,
    });
    
    console.log("Pool ID result:", poolIdResult);
    
    if (poolIdResult.type === "buffer") {
      // Now try to get the pool data with the correct pool ID
      const poolDataResult = await fetchCallReadOnlyFunction({
        contractAddress: AMM_CONTRACT_ADDRESS,
        contractName: AMM_CONTRACT_NAME,
        functionName: "get-pool-data",
        functionArgs: [poolIdResult],
        senderAddress: AMM_CONTRACT_ADDRESS,
        network: STACKS_TESTNET,
      });
      
      console.log("Pool data with correct ID:", poolDataResult);
      
      if (poolDataResult.type === "ok" && poolDataResult.value.type === "some") {
        console.log("Pool data details:", poolDataResult.value.value);
      }
      
      return poolDataResult;
    }
    
    return poolIdResult;
  } catch (error) {
    console.error("Direct contract call failed:", error);
    return null;
  }
}

// Test function to check if contract is accessible
export async function testContractAccess() {
  try {
    console.log("Testing contract access...");
    const result = await fetchCallReadOnlyFunction({
      contractAddress: AMM_CONTRACT_ADDRESS,
      contractName: AMM_CONTRACT_NAME,
      functionName: "get-pool-id",
      functionArgs: [
        Cl.tuple({
          "token-0": Cl.principal("STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token"),
          "token-1": Cl.principal("STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token-2"),
          fee: Cl.uint(500),
        }),
      ],
      senderAddress: AMM_CONTRACT_ADDRESS,
      network: STACKS_TESTNET,
    });
    console.log("Contract access test result:", result);
    return result;
  } catch (error) {
    console.error("Contract access test failed:", error);
    return null;
  }
}

// Get all pools that exist on the DEX with caching and rate limiting
export async function getAllPools(): Promise<Pool[]> {
  console.log("getAllPools called");
  
  // Check cache first
  const now = Date.now();
  if (poolsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log("Returning cached pools:", poolsCache);
    return poolsCache;
  }

  let offset = 0;
  let done = false;
  const pools: Pool[] = [];

  try {
    while (!done) {
      const url = `https://api.testnet.hiro.so/extended/v1/contract/${AMM_CONTRACT_PRINCIPAL}/events?limit=50&offset=${offset}`;
      console.log("Fetching events from:", url);
      const response = await fetch(url);
      const data = await response.json();
      const events = data.results as ContractEvent[];
      console.log(`Fetched ${events.length} events at offset ${offset}`);

      if (events.length < 50) {
        done = true;
      }

      const filteredEvents = events.filter((event: ContractEvent) => {
        return event.event_type === "smart_contract_log";
      });
      console.log(`Found ${filteredEvents.length} smart contract log events`);

      for (const event of filteredEvents) {
        const contractLog = event.contract_log;
        if (contractLog.contract_id !== AMM_CONTRACT_PRINCIPAL) continue;
        if (contractLog.topic !== "print") continue;

        const data = hexToCV(contractLog.value.hex);
        if (data.type !== "tuple") continue;
        if (data.value["action"] === undefined) continue;
        if (data.value["action"].type !== "ascii") continue;
        if (data.value["action"]["value"] !== "create-pool") continue;
        if (data.value["data"].type !== "tuple") continue;

        const poolInitialData = data.value["data"].value as PoolCV;

        try {
          // Add delay between API calls to avoid rate limiting
          await delay(100);

          const poolIdResult = await fetchCallReadOnlyFunction({
            contractAddress: AMM_CONTRACT_ADDRESS,
            contractName: AMM_CONTRACT_NAME,
            functionName: "get-pool-id",
            functionArgs: [
              Cl.tuple({
                "token-0": poolInitialData["token-0"],
                "token-1": poolInitialData["token-1"],
                fee: poolInitialData.fee,
              }),
            ],
            senderAddress: AMM_CONTRACT_ADDRESS,
            network: STACKS_TESTNET,
          });
          if (poolIdResult.type !== "buffer") continue;
          const poolId = poolIdResult.value;

          // Add delay between API calls
          await delay(100);

          console.log("Pool ID from get-pool-id:", poolIdResult);
          
          const poolDataResult = await fetchCallReadOnlyFunction({
            contractAddress: AMM_CONTRACT_ADDRESS,
            contractName: AMM_CONTRACT_NAME,
            functionName: "get-pool-data",
            functionArgs: [poolIdResult],
            senderAddress: AMM_CONTRACT_ADDRESS,
            network: STACKS_TESTNET,
          });

          console.log("Pool data result:", poolDataResult);

          if (poolDataResult.type !== "ok") {
            console.log("Pool data result not ok:", poolDataResult);
            continue;
          }
          if (poolDataResult.value.type !== "some") {
            console.log("Pool data result is none:", poolDataResult.value);
            continue;
          }
          if (poolDataResult.value.value.type !== "tuple") {
            console.log("Pool data result not tuple:", poolDataResult.value.value);
            continue;
          }
          
          console.log("Pool data details:", poolDataResult.value.value);

          const poolData = poolDataResult.value.value.value as PoolCV;

          const pool: Pool = {
            id: poolId,
            "token-0": poolInitialData["token-0"].value,
            "token-1": poolInitialData["token-1"].value,
            fee: parseInt(poolInitialData["fee"].value.toString()),
            liquidity: parseInt(poolData["liquidity"].value.toString()),
            "balance-0": parseInt(poolData["balance-0"].value.toString()),
            "balance-1": parseInt(poolData["balance-1"].value.toString()),
          };

          pools.push(pool);
          offset = event.event_index;
        } catch (error) {
          console.error("Error fetching pool data:", error);
          // Continue with next pool instead of failing completely
          continue;
        }
      }
    }

    // Update cache
    poolsCache = pools;
    cacheTimestamp = now;
    
    console.log("Final pools found:", pools);
    return pools;
  } catch (error) {
    console.error("Error fetching pools:", error);
    // Return cached data if available, otherwise empty array
    if (poolsCache) {
      console.log("Returning cached pools data due to API error");
      return poolsCache;
    }
    
    // If no cache and API is failing, return empty array
    console.log("No cached data available, returning empty pools array");
    return [];
  }
}

export async function createPool(token0: string, token1: string, fee: number) {
  console.log("Creating pool with:", { token0, token1, fee });
  
  const token0Hex = cvToHex(principalCV(token0));
  const token1Hex = cvToHex(principalCV(token1));

  console.log("Token hex values:", { token0Hex, token1Hex });

  // Sort the tokens properly here
  if (token0Hex > token1Hex) {
    console.log("Swapping tokens due to hex ordering");
    [token0, token1] = [token1, token0];
  }

  // The contract expects <ft-trait> parameters, which are contract principals
  // that implement the SIP-010 trait. We need to pass them as principalCV
  const txOptions = {
    contractAddress: AMM_CONTRACT_ADDRESS,
    contractName: AMM_CONTRACT_NAME,
    functionName: "create-pool",
    functionArgs: [Cl.principal(token0), Cl.principal(token1), Cl.uint(fee)],
  };

  console.log("Transaction options:", txOptions);
  return txOptions;
}

export async function addLiquidity(
  pool: Pool,
  amount0: number,
  amount1: number
) {
  if (amount0 === 0 || amount1 === 0) {
    throw new Error("Cannot add liquidity with 0 amount");
  }

  if (pool.liquidity > 0) {
    const poolRatio = pool["balance-0"] / pool["balance-1"];
    const idealAmount1 = Math.floor(amount0 / poolRatio);
    if (amount1 < idealAmount1) {
      throw new Error(
        `Cannot add liquidity in these amounts. You need to supply at least ${idealAmount1} ${
          pool["token-1"].split(".")[1]
        } along with ${amount0} ${pool["token-0"].split(".")[1]}`
      );
    }
  }

  const txOptions = {
    contractAddress: AMM_CONTRACT_ADDRESS,
    contractName: AMM_CONTRACT_NAME,
    functionName: "add-liquidity",
    functionArgs: [
      principalCV(pool["token-0"]),
      principalCV(pool["token-1"]),
      uintCV(pool.fee),
      uintCV(amount0),
      uintCV(amount1),
      uintCV(0),
      uintCV(0),
    ],
  };

  return txOptions;
}

export async function removeLiquidity(pool: Pool, liquidity: number) {
  const txOptions = {
    contractAddress: AMM_CONTRACT_ADDRESS,
    contractName: AMM_CONTRACT_NAME,
    functionName: "remove-liquidity",
    functionArgs: [
      principalCV(pool["token-0"]),
      principalCV(pool["token-1"]),
      uintCV(pool.fee),
      uintCV(liquidity),
    ],
  };

  return txOptions;
}

export async function swap(pool: Pool, amount: number, zeroForOne: boolean) {
  const txOptions = {
    contractAddress: AMM_CONTRACT_ADDRESS,
    contractName: AMM_CONTRACT_NAME,
    functionName: "swap",
    functionArgs: [
      principalCV(pool["token-0"]),
      principalCV(pool["token-1"]),
      uintCV(pool.fee),
      uintCV(amount),
      boolCV(zeroForOne),
    ],
  };

  return txOptions;
}

export async function getUserLiquidity(pool: Pool, user: string) {
  try {
    // Add small delay to avoid rate limiting
    await delay(50);
    
    const userLiquidityResult = await fetchCallReadOnlyFunction({
      contractAddress: AMM_CONTRACT_ADDRESS,
      contractName: AMM_CONTRACT_NAME,
      functionName: "get-position-liquidity",
      functionArgs: [bufferCV(Buffer.from(pool.id, "hex")), principalCV(user)],
      senderAddress: AMM_CONTRACT_ADDRESS,
      network: STACKS_TESTNET,
    });

    if (userLiquidityResult.type !== "ok") return 0;
    if (userLiquidityResult.value.type !== "uint") return 0;
    return parseInt(userLiquidityResult.value.value.toString());
  } catch (error) {
    console.error("Error fetching user liquidity:", error);
    return 0;
  }
}

// Function to create mint transaction options
export async function mintMockTokens(amount: number) {
  return {
    contractAddress: AMM_CONTRACT_ADDRESS,
    contractName: "mock-token",
    functionName: "mint",
    functionArgs: [Cl.uint(amount)],
  };
}