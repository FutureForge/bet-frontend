import React from "react";
import InfoIcon from "@/assets/Info.svg";

export function Header({
  totalWagered = 0,
  totalWon = 0,
  chainSymbol,
}: {
  totalWon: number;
  totalWagered: number;
  chainSymbol: string
}) {
  const isLoading = false; // Replace with actual loading state from query
  const headerStats = [
    {
      label: "Total Wagered",
      value: totalWagered,
    },
    {
      label: "Total Won",
      value: totalWon,
    },
    // {
    //   label: "Total Losses",
    //   value: 5435,
    // },
  ];
  return (
    <div className="mb-4 border-b border-b-stroke pb-4">
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex items-center gap-20">
          {headerStats.map((stat, index) => (
            <div key={`header-stat-${index}`} className="flex gap-2 flex-col">
              <div className="text-lg text-muted-foreground flex items-center gap-0.5">
                {stat.label} <InfoIcon />
              </div>
              <div className="text-2xl font-semibold text-white">
                {stat.value.toLocaleString()} {chainSymbol}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-20">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="bg-gray-700 w-[115px] h-4 rounded-md" />
          <div className="bg-gray-700 w-[115px] h-6 rounded-md" />
        </div>
      ))}
    </div>
  );
}
