"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TimerProps {
  totalTimeInSeconds: number;
  onTimeUp: () => void;
}

export default function Timer({ totalTimeInSeconds, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);

  useEffect(() => {
    if (!timeLeft) return;

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    console.log(timeLeft);
    if (timeLeft <= 0) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <p
      className={cn("text-primary", { "text-red-500": timeLeft < 10 })}
    >{`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</p>
  );
}
