"use client";

import { useStacks } from "@/hooks/use-stacks";
import { useState } from "react";

export function CreatePool() {
  const { handleCreatePool } = useStacks();
  const [token0, setToken0] = useState("STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token");
  const [token1, setToken1] = useState("STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token-2");
  const [fee, setFee] = useState(500);

  return (
    <div className="flex flex-col max-w-md w-full gap-4 p-6 border border-gray-500 rounded-md">
      <h1 className="text-xl font-bold">Create New Pool</h1>
      <div className="flex flex-col gap-1">
        <span className="font-bold">Token 0 (Full Contract Address)</span>
        <input
          type="text"
          className="border-2 border-gray-500 rounded-lg px-4 py-2 bg-white text-black"
          placeholder="STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token"
          value={token0}
          onChange={(e) => setToken0(e.target.value)}
        />
        <span className="text-xs text-gray-400">Example: STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-bold">Token 1 (Full Contract Address)</span>
        <input
          type="text"
          className="border-2 border-gray-500 rounded-lg px-4 py-2 bg-white text-black"
          placeholder="STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token-2"
          value={token1}
          onChange={(e) => setToken1(e.target.value)}
        />
        <span className="text-xs text-gray-400">Example: STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token-2</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-bold">Fee (in basis points, 500 = 5%)</span>
        <input
          type="number"
          className="border-2 border-gray-500 rounded-lg px-4 py-2 bg-white text-black"
          placeholder="Fee"
          max={10_000}
          min={0}
          value={fee}
          onChange={(e) => setFee(parseInt(e.target.value))}
        />
      </div>

      <button
        onClick={() => handleCreatePool(token0, token1, fee)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Pool
      </button>
    </div>
  );
}