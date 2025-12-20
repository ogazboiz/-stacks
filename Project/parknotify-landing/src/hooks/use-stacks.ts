"use client";

import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
} from "@stacks/connect";
import { useEffect, useState } from "react";

export function useStacks() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if user is already connected
    if (isConnected()) {
      const data = getLocalStorage();
      if (data?.addresses?.stx?.[0]?.address) {
        setUserAddress(data.addresses.stx[0].address);
      }
    }
  }, [mounted]);

  async function connectWallet() {
    if (!mounted) return;
    try {
      const response = await connect();
      if (response?.addresses?.[0]?.address) {
        // Find the STX address (not BTC)
        const stxAddress = response.addresses.find((addr: { address: string }) =>
          addr.address.startsWith("SP") || addr.address.startsWith("ST")
        );
        if (stxAddress) {
          setUserAddress(stxAddress.address);
        }
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Error connecting wallet: " + (err as Error).message);
    }
  }

  function disconnectWallet() {
    disconnect();
    setUserAddress(null);
  }

  // Create a userData object that mimics the old API for compatibility
  const userData = userAddress
    ? {
        profile: {
          stxAddress: {
            testnet: userAddress,
            mainnet: userAddress,
          },
        },
      }
    : null;

  return {
    userData,
    userAddress,
    connectWallet,
    disconnectWallet,
  };
}

