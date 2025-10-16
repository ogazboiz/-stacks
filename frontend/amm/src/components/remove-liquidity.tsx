"use client";

import { useStacks } from "@/hooks/use-stacks";
import { getUserLiquidity, Pool, clearPoolsCache, testContractDirectly } from "@/lib/amm";
import { useEffect, useState } from "react";

export interface RemoveLiquidityProps {
  pools: Pool[];
}

export function RemoveLiquidity({ pools }: RemoveLiquidityProps) {
  const { userData, handleRemoveLiquidity, handleMintTokens } = useStacks();
  const [selectedPool, setSelectedPool] = useState<Pool>(pools[0]);
  const [liquidity, setLiquidity] = useState(0);
  const [userTotalLiquidity, setUserTotalLiquidity] = useState(0);

  async function fetchUserLiquidity() {
    const stxAddress = userData?.profile.stxAddress.testnet;
    if (!stxAddress) return;

    getUserLiquidity(selectedPool, stxAddress).then((liquidity) => {
      setUserTotalLiquidity(liquidity);
    });
  }

  useEffect(() => {
    fetchUserLiquidity();
  }, [selectedPool, userData]);

  return (
    <div className="flex flex-col max-w-md w-full gap-4 p-6 border border-gray-500 rounded-md">
      <h1 className="text-xl font-bold">Remove Liquidity</h1>
      <div className="text-xs text-gray-400">
        Debug: Pool liquidity: {selectedPool?.liquidity || 'undefined'}, 
        User liquidity: {userTotalLiquidity}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-bold">Pool ID</span>
        <select
          className="border-2 border-gray-500 rounded-lg px-4 py-2 bg-white text-black"
          onChange={(e) => {
            const poolId = e.target.value;
            setSelectedPool(pools.find((pool) => pool.id === poolId)!);
          }}
        >
          {pools.map((pool) => (
            <option key={pool.id} value={pool.id}>
              {pool["token-0"].split(".")[1]} / {pool["token-1"].split(".")[1]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-bold">Liquidity</span>
          <span>Max: {userTotalLiquidity}</span>
        </div>
        <input
          type="number"
          className="border-2 border-gray-500 rounded-lg px-4 py-2 bg-white text-black"
          value={liquidity}
          onChange={(e) => setLiquidity(parseInt(e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span>
          Withdraw {selectedPool["token-0"].split(".")[1]}:{" "}
          {selectedPool.liquidity > 0 
            ? Math.floor((liquidity / selectedPool.liquidity) * selectedPool["balance-0"])
            : 0
          }
        </span>
        <span>
          Withdraw {selectedPool["token-1"].split(".")[1]}:{" "}
          {selectedPool.liquidity > 0 
            ? Math.floor((liquidity / selectedPool.liquidity) * selectedPool["balance-1"])
            : 0
          }
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1"
          onClick={() => {
            clearPoolsCache();
            // Force a hard refresh
            window.location.href = window.location.href;
          }}
        >
          Force Refresh
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex-1"
          onClick={() => testContractDirectly()}
        >
          Test Contract
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-1"
          onClick={() => handleMintTokens(1000)}
        >
          Mint 1000 Tokens
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1 disabled:bg-gray-700 disabled:cursor-not-allowed"
          disabled={liquidity > userTotalLiquidity || userTotalLiquidity === 0}
          onClick={() => handleRemoveLiquidity(selectedPool, liquidity)}
        >
          Remove Liquidity
        </button>
      </div>
    </div>
  );
}