import type {
    FetchAddressTransactionsResponse,
    Transaction,
  } from "@/lib/fetch-address-transactions";
  import { abbreviateTxnId, abbreviateAddress } from "@/lib/stx-utils";
  import {
    ActivityIcon,
    ArrowLeftRightIcon,
    BlocksIcon,
    CodeSquareIcon,
    FunctionSquareIcon,
    type LucideIcon,
  } from "lucide-react";
  import Link from "next/link";
  
  interface TransactionDetailProps {
    result: FetchAddressTransactionsResponse["results"][number];
  }
  
  // What info to show for each transaction
  type TransactionInformationByType = {
    primaryTitle: string;     // Main text
    secondaryTitle: string;   // Extra text
    tags: string[];           // Category labels
  };
  
  // Icons for each type of transaction (like emojis!)
  const TxTypeIcon: Record<Transaction["tx_type"], LucideIcon> = {
    coinbase: BlocksIcon,                  // 🧱 Block icon
    token_transfer: ArrowLeftRightIcon,    // 💸 Transfer arrows
    smart_contract: CodeSquareIcon,        // 📝 Code icon
    contract_call: FunctionSquareIcon,     // 📞 Function icon
    poison_microblock: ActivityIcon,       // ⚡ Activity icon
  };
  
  // This function decides what to show based on transaction type
  function getTransactionInformationByType(
    result: TransactionDetailProps["result"]
  ): TransactionInformationByType {
    
    // COINBASE - A new block was mined!
    if (result.tx.tx_type === "coinbase") {
      return {
        primaryTitle: `Block #${result.tx.block_height}`,
        secondaryTitle: "",
        tags: ["Coinbase"],
      };
    }
  
    // TOKEN TRANSFER - Someone sent coins!
    if (result.tx.tx_type === "token_transfer") {
      // Convert from micro-STX to STX (divide by 1 million)
      const amount = (
        Number.parseFloat(result.tx.token_transfer.amount) / 1_000_000
      ).toFixed(2);
      
      return {
        primaryTitle: `Transfer ${amount} STX`,
        secondaryTitle: "",
        tags: ["Token Transfer"],
      };
    }
  
    // SMART CONTRACT - New contract deployed!
    if (result.tx.tx_type === "smart_contract") {
      return {
        primaryTitle: result.tx.smart_contract.contract_id,
        secondaryTitle: "",
        tags: ["Contract Deployment"],
      };
    }
  
    // CONTRACT CALL - Someone used a contract!
    if (result.tx.tx_type === "contract_call") {
      return {
        primaryTitle: result.tx.contract_call.function_name,
        secondaryTitle: result.tx.contract_call.contract_id.split(".")[1],
        tags: ["Contract Call"],
      };
    }
  
    // POISON MICROBLOCK - Mini block!
    if (result.tx.tx_type === "poison_microblock") {
      return {
        primaryTitle: "Microblock",
        secondaryTitle: "",
        tags: ["Microblock"],
      };
    }
  
    // Default (should never happen)
    return {
      primaryTitle: "",
      secondaryTitle: "",
      tags: [],
    };
  }
  
  // THE MAIN COMPONENT!
  export function TransactionDetail({ result }: TransactionDetailProps) {
    // Get the right icon for this transaction type
    const Icon = TxTypeIcon[result.tx.tx_type];
    
    // Get the info to display
    const { primaryTitle, secondaryTitle, tags } =
      getTransactionInformationByType(result);
  
    return (
      <div className="flex items-center p-4 border-l-2 border-transparent hover:border-blue-500 transition-all justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* The Icon */}
          <Icon className="h-10 w-10 rounded-full p-2 border border-gray-700" />
  
          <div className="flex flex-col gap-2">
            {/* Main Title + Secondary Title */}
            <div className="flex items-center gap-2">
              <span className="font-medium">{primaryTitle}</span>
              {secondaryTitle && (
                <span className="text-gray-500">({secondaryTitle})</span>
              )}
            </div>
            
            {/* Tags + Who sent it */}
            <div className="flex items-center gap-1 font-bold text-xs text-gray-500">
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              <span>•</span>
              <span className="font-normal">
                By{" "}
                <Link
                  href={`/${result.tx.sender_address}`}
                  className="hover:underline transition-all"
                >
                  {abbreviateAddress(result.tx.sender_address)}
                </Link>
              </span>
            </div>
          </div>
        </div>
  
        {/* RIGHT SIDE */}
        <div className="flex flex-col items-end gap-2">
          {/* Transaction ID + Time */}
          <div className="flex items-center gap-2">
            <span>{abbreviateTxnId(result.tx.tx_id)}</span>
            <span>•</span>
            <span suppressHydrationWarning>
              {new Date(result.tx.block_time * 1000).toLocaleTimeString()}
            </span>
          </div>
  
          {/* Block Height + Nonce */}
          <div className="flex items-center gap-1 font-bold text-xs text-gray-500">
            <span>Block #{result.tx.block_height}</span>
            <span>•</span>
            <span>Nonce {result.tx.nonce}</span>
          </div>
        </div>
      </div>
    );
  }