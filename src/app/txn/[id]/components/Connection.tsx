"use client";

import { Button } from "@/components/ui/button";

export default function Connection() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 py-4">
      <Button className="bg-primary shadow-connectWalletButtonBackdrop text-black font-bold selection:bg-primary/80 selection:text-primary">
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
