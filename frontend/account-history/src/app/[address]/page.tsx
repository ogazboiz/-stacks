import { TransactionsList } from "@/components/txns-list";
import { fetchAddressTransactions } from "@/lib/fetch-address-transactions";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

// This is a DYNAMIC page!
// If you visit /SP123ABC, the address will be "SP123ABC"
export default async function Activity({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  // Get the address from the URL
  const { address } = await params;

  // Fetch the first 20 transactions for this address
  const initialTransactions = await fetchAddressTransactions({ address });

  return (
    <main className="flex h-[100vh-4rem] flex-col p-8 gap-8">
      {/* Header with the address */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">{address}</h1>
        
        {/* Link to view on Hiro's official explorer */}
        <Link
          href={`https://explorer.hiro.so/address/${address}`}
          target="_blank"
          className="rounded-lg flex gap-1 bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ExternalLinkIcon className="h-4 w-4" />
          View on Hiro
        </Link>
      </div>

      {/* The transaction list with Load More button */}
      <TransactionsList address={address} transactions={initialTransactions} />
    </main>
  );
}