"use client";
import { useStacks } from "@/hooks/use-stacks";
import { abbreviateAddress } from "@/lib/stx-utils";
import { createAddress } from "@stacks/transactions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();  // Tool to change pages
  
  // Store what the user types in the search bar
  const [searchAddress, setSearchAddress] = useState("");

  // Get wallet connection functions
  const { userData, connectWallet, disconnectWallet } = useStacks();

  // When user searches for an address
  function handleSearch() {
    // Make sure it starts with "SP" (mainnet addresses)
    if (!searchAddress.startsWith("SP")) {
      return alert("Please enter a mainnet Stacks address");
    }

    try {
      // Check if it's a VALID address
      createAddress(searchAddress);
    } catch (error) {
      return alert(`Invalid Stacks address entered ${error}`);
    }

    // If valid, go to that address's page!
    router.push(`/${searchAddress}`);
  }

  return (
    <nav className="flex w-full items-center justify-between gap-4 p-4 h-16 border-b border-gray-500">
      {/* App Title - clicking goes home */}
      <Link href="/" className="text-2xl font-bold">
        Stacks Account History
      </Link>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="SP..."
        className="w-96 rounded-lg bg-gray-700 px-4 py-2 text-sm"
        onChange={(e) => setSearchAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();  // Press Enter to search!
          }
        }}
      />

      {/* Connect/Disconnect Buttons */}
      <div className="flex items-center gap-2">
        {userData ? (
          // If wallet IS connected, show these buttons
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                router.push(`/${userData.profile.stxAddress.mainnet}`)
              }
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View {abbreviateAddress(userData.profile.stxAddress.mainnet)}
            </button>
            <button
              type="button"
              onClick={disconnectWallet}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Disconnect
            </button>
          </div>
        ) : (
          // If wallet is NOT connected, show connect button
          <button
            type="button"
            onClick={connectWallet}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}