"use client";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { publicClient } from "@/config";
import { ContractAddresses } from "@/constants";
import { cn, formatAmountToPrecision, maskAddress } from "@/lib/utils";
import { Transaction } from "@prisma/client";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useMemo, useState } from "react";
import {
  TransactionReceipt,
  encodeFunctionData,
  erc20Abi,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
} from "viem";
import { polygonMumbai } from "viem/chains";
import {
  useAccount,
  useBalance,
  useDisconnect,
  useEstimateGas,
  useReadContract,
  useWriteContract,
} from "wagmi";

import { InfoIcon, LinkIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { completeTransaction } from "../actions";

interface ConnectionProps {
  transaction: Transaction;
  timeIsUp: boolean;
}

export default function Connection({ transaction, timeIsUp }: ConnectionProps) {
  const [isPaying, setIsPaying] = useState(false);
  const [hash, setHash] = useState("");
  const [receipt, setReceipt] = useState<TransactionReceipt>();
  const [paid, setPaid] = useState(transaction.status === "SUCCESS");
  const [failed, setFailed] = useState(transaction.status === "FAILURE");

  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();

  const { address, isConnecting, isConnected } = useAccount();

  useEffect(() => {
    console.log(transaction.txnHash, receipt?.transactionHash);
    if (transaction.txnHash) {
      setHash(transaction.txnHash);
    } else if (receipt?.transactionHash) {
      setHash(receipt.transactionHash);
    }

    if (timeIsUp && !isPaying && !paid) {
      void completeTransaction(transaction.id, {
        fromAddress: address as string,
        status: "FAILURE",
        txnHash: "",
      });
      setFailed(true);
    }
  }, [timeIsUp, isPaying, paid, transaction.id, address]);

  const {
    data: balance,
    isLoading: balanceLoading,
    isFetched: balanceFetched,
  } = useBalance({ address });

  const {
    data: usdcBalance,
    isLoading: usdcBalanceLoading,
    isFetched: usdcBalanceFetched,
  } = useReadContract({
    address: ContractAddresses.USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address ?? ContractAddresses.USDC],
  });

  const {
    data: gasEstimate,
    isLoading: gasEstimateLoading,
    isFetched: gasEstimateFetched,
  } = useEstimateGas({
    chainId: polygonMumbai.id,
    account: address,
    to: address,
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [address ?? ContractAddresses.USDC, parseUnits("1", 6)],
    }),
    value: parseEther("0.1"),
  });

  const handleConnectionToggle = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  const isPayEnabled = useMemo(() => {
    return (
      usdcBalance &&
      balance &&
      gasEstimate &&
      Number(formatAmountToPrecision(formatUnits(usdcBalance, 6), 6)) >=
        Number(transaction.amount) &&
      Number(formatAmountToPrecision(formatEther(balance.value), 6)) >=
        Number(formatAmountToPrecision(formatEther(gasEstimate)))
    );
  }, [balance, usdcBalance, gasEstimate, transaction.amount]);

  const handlePay = async () => {
    setIsPaying(true);
    try {
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: ContractAddresses.USDC,
        functionName: "transfer",
        args: [
          transaction.toAddress as `0x${string}`,
          parseUnits(String(transaction.amount), 6),
        ],
      });
      console.log("handlePay -- hash -- ", hash);
      const txReceipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log("handlePay -- txReceipt --", txReceipt);
      setReceipt(txReceipt);
      if (txReceipt.status === "success") {
        await completeTransaction(transaction.id, {
          fromAddress: address as string,
          status: "SUCCESS",
          txnHash: txReceipt.transactionHash,
        });
        setPaid(true);
      } else {
        await completeTransaction(transaction.id, {
          fromAddress: address as string,
          status: "FAILURE",
          txnHash: txReceipt.transactionHash,
        });
        setFailed(true);
      }
    } catch (error) {
      console.error("handlePay -- catch -- error", error);
    }
    setIsPaying(false);
  };

  return (
    <section className="w-full flex flex-col justify-center items-center gap-2">
      {transaction.status === "CREATED" ? (
        <div className="w-full flex flex-col justify-center items-center gap-2">
          {!isConnecting ? (
            <Button
              onClick={handleConnectionToggle}
              variant={isConnected ? "destructive" : "default"}
              className={cn(
                "shadow-connectWalletButtonBackdrop text-black font-bold"
              )}
            >
              {isConnected ? "Disconnect" : "Connect"} Wallet
            </Button>
          ) : (
            <Skeleton className="h-10 w-32" />
          )}
        </div>
      ) : null}
      {!(paid || failed) ? (
        isConnected ? (
          <div className="w-full px-8 py-6 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Sender (You)</p>
              {isConnecting || !address ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <p className="text-white">{maskAddress(address, 10)}</p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-stone-400">Native Token Balance</p>
              {balanceLoading || !balanceFetched || !balance ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <p className="text-white">
                  {formatAmountToPrecision(formatEther(balance.value), 6)}{" "}
                  {balance.symbol}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-stone-400">USDC Balance</p>
              {usdcBalanceLoading || !usdcBalanceFetched || !usdcBalance ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <p className="text-white">
                  {formatAmountToPrecision(formatUnits(usdcBalance, 6), 6)} USDC
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="text-stone-400">Estimated gas</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-3 w-3 text-stone-400" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-black border border-borderGray">
                      <p className="text-white text-center">
                        This is an elementary check for gas. It may be
                        incorrect.
                        <br /> Your external wallet will do another, probably
                        better gas estimation.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {gasEstimateLoading || !gasEstimateFetched || !gasEstimate ? (
                <Skeleton className="h-6 w-1/2" />
              ) : (
                <p className="text-primary font-bold tracking-wide">
                  {formatAmountToPrecision(formatEther(gasEstimate))}{" "}
                  {balance?.symbol}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center my-4">
              <p className="text-primary/70">Estimated total</p>
              <div className="w-full flex flex-col justify-center items-end">
                <p className="text-primary font-bold tracking-wide">
                  {transaction.amount} {transaction.tokenSymbol} +
                </p>
                {gasEstimateLoading || !gasEstimateFetched || !gasEstimate ? (
                  <Skeleton className="h-6 w-1/2" />
                ) : (
                  <p className="text-primary font-bold tracking-wide">
                    {formatAmountToPrecision(formatEther(gasEstimate))}{" "}
                    {balance?.symbol}
                  </p>
                )}
              </div>
            </div>
            <Button
              disabled={!isPayEnabled || isPaying}
              className={"w-full font-bold"}
              onClick={handlePay}
            >
              {isPaying ? <LoadingSpinner /> : "Pay"}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-primary animate-bounce">
              Connect your wallet to proceed bro.
            </p>
          </div>
        )
      ) : (
        <section className="w-[90%]">
          {paid ? (
            <div className="w-full rounded-md bg-green-500 p-10 pt-6 my-10 shadow-successBackdrop">
              <p className="font-black text-3xl mb-4">
                Transaction Succeeded :)
              </p>
              <div className="flex justify-between items-center">
                <p className="text-black">Txn Hash</p>
                {!hash ? (
                  <Skeleton className="h-6 w-1/2 bg-green-950" />
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          target="_blank"
                          href={`https://mumbai.polygonscan.com/tx/${hash}`}
                          className="underline flex justify-end items-center gap-2"
                        >
                          <p className="text-black font-bold">
                            {maskAddress(hash, 10)}
                          </p>
                          <LinkIcon className="text-black h-4 w-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent className="bg-black border border-borderGray">
                        <p className="text-white text-center">
                          View in explorer
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full rounded-md bg-red-500 p-6 my-10 shadow-failureBackdrop">
              <p className="font-black text-3xl mb-4">Transaction Failed :(</p>
              {!timeIsUp ? (
                <div className="flex justify-between items-center">
                  {hash ? (
                    <>
                      <p className="text-black">Txn Hash</p>
                      <Link
                        href={`https://mumbai.polygonscan.com/tx/${hash}`}
                        className="underline flex justify-end items-center gap-2"
                      >
                        <p className="text-black font-bold">
                          {maskAddress(hash, 10)}
                        </p>
                        <LinkIcon className="text-black h-4 w-4" />
                      </Link>
                    </>
                  ) : null}
                </div>
              ) : (
                <p className="text-black">
                  Order expired. Return to merchant and try again.
                </p>
              )}
            </div>
          )}
          <Link href={"/end"}>
            <Button className="w-full font-bold">
              Go back to the Merchant
            </Button>
          </Link>
        </section>
      )}
    </section>
  );
}
