"use client";

import { useStacks } from "@/hooks/use-stacks";

export function WalletButton() {
  const { userAddress, connectWallet, disconnectWallet } = useStacks();

  if (userAddress) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 text-sm">
          {userAddress.substring(0, 6)}...{userAddress.substring(userAddress.length - 4)}
        </span>
        <button
          onClick={disconnectWallet}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 text-[16px] font-semibold"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-[#1877F2] text-white px-6 py-2 rounded-lg hover:bg-[#1A73E1] transition-all duration-300 text-[16px] font-semibold shadow-lg"
    >
      Connect Wallet
    </button>
  );
}

export function MobileWalletButton() {
  const { userAddress, connectWallet, disconnectWallet } = useStacks();

  if (userAddress) {
    return (
      <button
        onClick={disconnectWallet}
        className="text-gray-700 text-xs px-3 py-1.5 bg-gray-200 rounded"
      >
        {userAddress.substring(0, 4)}...{userAddress.substring(userAddress.length - 4)}
      </button>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-[#1877F2] text-white px-4 py-2 rounded text-sm font-semibold"
    >
      Connect
    </button>
  );
}

