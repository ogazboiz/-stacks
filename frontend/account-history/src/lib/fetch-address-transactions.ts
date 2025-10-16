// This is like ordering food from a restaurant
// You give them an address and they bring you the transactions!

interface FetchAddressTransactionsArgs {
    address: string;  // The person's blockchain address
    offset?: number;  // Where to start counting (like page numbers!)
  }
  
  export interface FetchAddressTransactionsResponse {
    limit: number;    // How many transactions per page
    offset: number;   // Which page we're on
    total: number;    // Total number of transactions
    results: Array<{
      tx: Transaction;
      stx_sent: string;
      stx_received: string;
      events: {
        stx: TransactionEvent;
        ft: TransactionEvent;
        nft: TransactionEvent;
      };
    }>;
  }
  
  // Base transaction info (info ALL transactions have)
  interface BaseTransaction {
    tx_id: string;              // Unique ID for the transaction
    nonce: number;              // Transaction number
    sender_address: string;     // Who sent it
    block_hash: string;         // Which block it's in
    parent_block_hash: string;
    block_height: number;       // Block number
    block_time: number;         // When it happened
    tx_status: string;          // Success or failed
    tx_type:
      | "coinbase"
      | "token_transfer"
      | "smart_contract"
      | "contract_call"
      | "poison_microblock";
  }
  
  // Each type of transaction has extra info
  interface CoinbaseTransaction extends BaseTransaction {
    tx_type: "coinbase";
  }
  
  interface TokenTransferTransaction extends BaseTransaction {
    tx_type: "token_transfer";
    token_transfer: {
      recipient_address: string;  // Who received the money
      amount: string;             // How much was sent
    };
  }
  
  interface SmartContractTransaction extends BaseTransaction {
    tx_type: "smart_contract";
    smart_contract: {
      clarity_version: number;
      contract_id: string;
    };
  }
  
  interface ContractCallTransaction extends BaseTransaction {
    tx_type: "contract_call";
    contract_call: {
      contract_id: string;    // Which contract was called
      function_name: string;  // Which function in that contract
    };
  }
  
  interface PoisonMicroblockTransaction extends BaseTransaction {
    tx_type: "poison_microblock";
  }
  
  // Union type = can be ANY of these 5 types!
  export type Transaction =
    | CoinbaseTransaction
    | TokenTransferTransaction
    | SmartContractTransaction
    | ContractCallTransaction
    | PoisonMicroblockTransaction;
  
  interface TransactionEvent {
    transfer: number;
    mint: number;
    burn: number;
  }
  
  // THE MAIN FUNCTION! This gets the transactions!
  export async function fetchAddressTransactions({
    address,
    offset = 0,
  }: FetchAddressTransactionsArgs): Promise<FetchAddressTransactionsResponse> {
    // Build the URL to ask Hiro's API
    const url = `https://api.hiro.so/extended/v2/addresses/${address}/transactions?limit=20&offset=${offset}`;
  
    // Ask the API for data
    const response = await fetch(url);
  
    // If something went wrong, throw an error
    if (!response.ok) {
      throw new Error("Failed to fetch address transactions");
    }
  
    // Convert the response to JSON and return it
    const data = await response.json();
    return data as FetchAddressTransactionsResponse;
  }