"use client";

import {
  fetchAddressTransactions,
  type FetchAddressTransactionsResponse,
} from "@/lib/fetch-address-transactions";
import { TransactionDetail } from "./txn-details";
import { useState } from "react";

interface TransactionsListProps {
  address: string;
  transactions: FetchAddressTransactionsResponse;
}

export function TransactionsList({
  address,
  transactions,
}: TransactionsListProps) {
  // Store ALL the transactions we've loaded
  const [allTxns, setAllTxns] = useState(transactions);

  // When user clicks "Load More", get the next 20 transactions!
  async function loadMoreTxns() {
    // Calculate the new starting point
    // If we loaded 0-20, next is 20-40
    // If we loaded 0-40, next is 40-60
    const newOffset = allTxns.offset + allTxns.limit;
    
    // Fetch the next batch of transactions
    const newTxns = await fetchAddressTransactions({
      address,
      offset: newOffset,
    });

    // Add the NEW transactions to our existing list
    setAllTxns({
      ...newTxns,
      // Combine old results + new results
      results: [...allTxns.results, ...newTxns.results],
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* The list of transaction cards */}
      <div className="flex flex-col border rounded-md divide-y border-gray-800 divide-gray-800">
        {allTxns.results.map((tx) => (
          <div key={tx.tx.tx_id}>
            <TransactionDetail result={tx} />
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      <button
        type="button"
        className="px-4 py-2 rounded-lg w-fit border border-gray-800 mx-auto text-center hover:bg-gray-900 transition-all"
        onClick={loadMoreTxns}
      >
        Load More
      </button>
    </div>
  );
}