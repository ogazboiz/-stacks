import {
  addLiquidity,
  createPool,
  Pool,
  removeLiquidity,
  swap,
  mintMockTokens,
} from "@/lib/amm";
import {
  connect,
  disconnect,
  isConnected,
  getLocalStorage,
  request,
} from "@stacks/connect";
import { cvToHex } from "@stacks/transactions";
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
  }

  async function handleCreatePool(token0: string, token1: string, fee: number) {
    if (!mounted || !userAddress) return;

    // Validate inputs
    if (!token0 || !token1) {
      alert("Please provide both token addresses");
      return;
    }
    
    if (token0 === token1) {
      alert("Token 0 and Token 1 must be different");
      return;
    }
    
    if (fee < 0 || fee > 10000) {
      alert("Fee must be between 0 and 10000 basis points (0-100%)");
      return;
    }

    // Validate token address format
    if (!token0.includes('.') || !token1.includes('.')) {
      alert("Token addresses must include the contract name (e.g., STA43VC8660WWNRHHWSXGK2VR4BVHGWN0Z63FXGD.mock-token)");
      return;
    }

      try {
        const options = await createPool(token0, token1, fee);
 
        console.log("Creating pool with options:", options);
        console.log("Function args:", options.functionArgs);

        // Convert Clarity values to hex for consistency
        const functionArgsHex = options.functionArgs.map((arg: any) => cvToHex(arg));
        console.log("Function args hex:", functionArgsHex);

        const response = await request("stx_callContract", {
          contract: `${options.contractAddress}.${options.contractName}`,
          functionName: options.functionName,
          functionArgs: functionArgsHex,
          network: "testnet",
        });

      console.log("Transaction sent:", response);
      alert("Pool created successfully! Transaction ID: " + response.txid);
    } catch (err: any) {
      console.error("Full error creating pool:", err);
      console.error("Error stack:", err.stack);
      console.error("Error details:", JSON.stringify(err, null, 2));
      alert("Error creating pool: " + (err.message || JSON.stringify(err)));
    }
  }

  async function handleSwap(pool: Pool, amount: number, zeroForOne: boolean) {
    if (!mounted || !userAddress) return;

    try {
      const options = await swap(pool, amount, zeroForOne);

      const functionArgsHex = options.functionArgs.map((arg: any) => cvToHex(arg));

      const response = await request("stx_callContract", {
        contract: `${options.contractAddress}.${options.contractName}`,
        functionName: options.functionName,
        functionArgs: functionArgsHex,
        network: "testnet",
      });

      console.log("Swap transaction sent:", response);
      alert("Swap successful! Transaction ID: " + response.txid);
    } catch (err: any) {
      console.error("Error swapping:", err);
      alert("Error swapping: " + err.message);
    }
  }

  async function handleAddLiquidity(
    pool: Pool,
    amount0: number,
    amount1: number
  ) {
    if (!mounted || !userAddress) return;

    try {
      const options = await addLiquidity(pool, amount0, amount1);

      const functionArgsHex = options.functionArgs.map((arg: any) => cvToHex(arg));

      const response = await request("stx_callContract", {
        contract: `${options.contractAddress}.${options.contractName}`,
        functionName: options.functionName,
        functionArgs: functionArgsHex,
        network: "testnet",
      });

      console.log("Add liquidity transaction sent:", response);
      alert("Liquidity added successfully! Transaction ID: " + response.txid);
    } catch (err: any) {
      console.error("Error adding liquidity:", err);
      alert("Error adding liquidity: " + err.message);
    }
  }

  async function handleRemoveLiquidity(pool: Pool, liquidity: number) {
    if (!mounted || !userAddress) return;

    try {
      const options = await removeLiquidity(pool, liquidity);

      const functionArgsHex = options.functionArgs.map((arg: any) => cvToHex(arg));

      const response = await request("stx_callContract", {
        contract: `${options.contractAddress}.${options.contractName}`,
        functionName: options.functionName,
        functionArgs: functionArgsHex,
        network: "testnet",
      });

      console.log("Remove liquidity transaction sent:", response);
      alert("Liquidity removed successfully! Transaction ID: " + response.txid);
    } catch (err: any) {
      console.error("Error removing liquidity:", err);
      alert("Error removing liquidity: " + err.message);
    }
  }

  async function handleMintTokens(amount: number) {
    if (!mounted || !userAddress) return;

    try {
      const options = await mintMockTokens(amount);

      const functionArgsHex = options.functionArgs.map((arg: any) => cvToHex(arg));

      const response = await request("stx_callContract", {
        contract: `${options.contractAddress}.${options.contractName}`,
        functionName: options.functionName,
        functionArgs: functionArgsHex,
        network: "testnet",
      });

      console.log("Mint transaction sent:", response);
      alert("Tokens minted successfully! Transaction ID: " + response.txid);
    } catch (err: any) {
      console.error("Error minting tokens:", err);
      alert("Error minting tokens: " + err.message);
    }
  }

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
    handleCreatePool,
    handleSwap,
    handleAddLiquidity,
    handleRemoveLiquidity,
    handleMintTokens,
    connectWallet,
    disconnectWallet,
  };
}