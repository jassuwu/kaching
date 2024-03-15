"use client";

import { ReactNode, useState } from "react";
import { Connection, Timer } from ".";
import { Transaction } from "@prisma/client";

interface WrapperProps {
  children: ReactNode;
  transaction: Transaction;
}
export default function ClientWrapper({ children, transaction }: WrapperProps) {
  const [timeIsUp, setTimeIsUp] = useState(false);
  const handleTimeUp = () => {
    setTimeIsUp(true);
  };

  return (
    <>
      <section className="h-[90%] w-full flex flex-col justify-between items-center">
        <div className="p-20 pb-14">
          <p className="text-white font-black text-7xl tracking-wide font-georama">
            ka<span className="text-primary">ching</span>
          </p>
        </div>
        <div className="bg-black h-full flex flex-col border-t border-x border-borderGray rounded-t-3xl z-20 w-[500px]">
          {children}
          <Connection transaction={transaction} timeIsUp={timeIsUp} />
        </div>
      </section>
      <footer className="z-10 h-[8%] bg-black w-full shadow-defaultBackdrop flex justify-center items-center absolute bottom-0">
        <div className="h-full w-[500px] flex justify-between items-center px-4 py-2">
          <div className="flex flex-col justify-center items-start">
            <p className="text-stone-400 text-sm">Order #{transaction.id}</p>
            <p className="text-white font-bold">{transaction.amount} USD</p>
          </div>
          {transaction.status === "CREATED" ? (
            <Timer totalTimeInSeconds={60} onTimeUp={handleTimeUp} />
          ) : null}
        </div>
      </footer>
    </>
  );
}
