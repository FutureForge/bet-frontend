import React from "react";
import BetSlip from "@/assets/bet-slip.svg";

export function EmptyMessage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3.5">
        <BetSlip className="w-16 h-16" />
        <div className="text-center">
          <p className="font-medium">Start Betting Now!</p>
          <p className="text-muted">Bet Slip is Empty.</p>
        </div>
      </div>
    </div>
  );
}
