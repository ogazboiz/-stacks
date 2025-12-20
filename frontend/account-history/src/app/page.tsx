"use client";

import { useStacks } from "@/hooks/use-stacks";
import { redirect } from "next/navigation";
import { ChainhooksManager } from "@/components/chainhooks-manager";

export default function Home() {
  const { userData } = useStacks();

  // If wallet is NOT connected, show chainhooks manager and message
  if (!userData) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-8 p-24">
        <div className="w-full max-w-4xl">
          <ChainhooksManager />
        </div>
        <span className="mt-8">Connect your wallet or search for an address</span>
      </main>
    );
  }

  // If wallet IS connected, automatically go to their transaction page!
  redirect(`/${userData.profile.stxAddress.mainnet}`);
}