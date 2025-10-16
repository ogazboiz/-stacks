"use client";

import { createNewGame, joinGame, Move, play } from "@/lib/contract";
import { getStxBalance } from "@/lib/stx-utils";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
  request,
} from "@stacks/connect";
import { useEffect, useState } from "react";

export function useStacks() {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [stxBalance, setStxBalance] = useState(0);
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
    try {
      const response = await connect();
      if (response?.addresses?.[0]?.address) {
        // Find the STX address (not BTC)
        const stxAddress = response.addresses.find((addr: any) =>
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
    setStxBalance(0);
  }

  async function handleCreateGame(
    betAmount: number,
    moveIndex: number,
    move: Move
  ) {
    if (!mounted || !userAddress) return;
    if (moveIndex < 0 || moveIndex > 8) {
      alert("Invalid move");
      return;
    }
    if (betAmount === 0) {
      alert("Please make a bet");
      return;
    }

    try {
      const txOptions = await createNewGame(betAmount, moveIndex, move);

      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        network: "testnet",
      });

      console.log("Transaction sent:", response);
      alert("Transaction sent! Check your wallet for confirmation.");
    } catch (err: any) {
      console.error("Error creating game:", err);
      alert("Error: " + err.message);
    }
  }

  async function handleJoinGame(gameId: number, moveIndex: number, move: Move) {
    if (!mounted || !userAddress) return;
    if (moveIndex < 0 || moveIndex > 8) {
      alert("Invalid move");
      return;
    }

    try {
      const txOptions = await joinGame(gameId, moveIndex, move);

      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        network: "testnet",
      });

      console.log("Transaction sent:", response);
      alert("Transaction sent! Check your wallet for confirmation.");
    } catch (err: any) {
      console.error("Error joining game:", err);
      alert("Error: " + err.message);
    }
  }

  async function handlePlayGame(gameId: number, moveIndex: number, move: Move) {
    if (!mounted || !userAddress) return;
    if (moveIndex < 0 || moveIndex > 8) {
      alert("Invalid move");
      return;
    }

    try {
      const txOptions = await play(gameId, moveIndex, move);

      const response = await request("stx_callContract", {
        contract: `${txOptions.contractAddress}.${txOptions.contractName}`,
        functionName: txOptions.functionName,
        functionArgs: txOptions.functionArgs,
        network: "testnet",
      });

      console.log("Transaction sent:", response);
      alert("Transaction sent! Check your wallet for confirmation.");
    } catch (err: any) {
      console.error("Error playing game:", err);
      alert("Error: " + err.message);
    }
  }

  useEffect(() => {
    if (userAddress && mounted) {
      getStxBalance(userAddress).then(setStxBalance);
    }
  }, [userAddress, mounted]);

  // Create a userData object that mimics the old API for compatibility with existing components
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
    stxBalance,
    connectWallet,
    disconnectWallet,
    handleCreateGame,
    handleJoinGame,
    handlePlayGame,
  };
}
