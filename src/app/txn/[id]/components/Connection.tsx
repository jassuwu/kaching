"use client";

import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function Connection() {
  const { open } = useWeb3Modal();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 py-4">
      <Button
        onClick={() => open()}
        className="bg-primary shadow-connectWalletButtonBackdrop text-black font-bold hover:bg-primary/80"
      >
        Connect Wallet
      </Button>
      <p
        onClick={() => console.log("Cancelling txn.")}
        className="text-stone-400 underline text-sm cursor-pointer"
      >
        Cancel Transaction
      </p>
    </div>
  );
}
