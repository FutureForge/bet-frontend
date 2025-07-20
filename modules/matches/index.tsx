// pages/matches/[matchId]/index.tsx
import { useRouter } from "next/router";
import React from "react";
import { APIFootballGameWidget } from "./components/widget";

export function MatchPage() {
  const router = useRouter();
  const { matchId } = router.query;

  
  const numericMatchId =
    typeof matchId === "string"
      ? parseInt(matchId, 10)
      : Array.isArray(matchId)
      ? parseInt(matchId[0]!, 10)
      : NaN;

  const valid = Number.isFinite(numericMatchId) && numericMatchId > 0;

  console.log(numericMatchId);
  

  return (
    <div className="p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Match Details</h1>

      {!valid && (
        <p className="text-error">
          Invalid match ID. Please go back and select a match.
        </p>
      )}

      {valid && (
        <APIFootballGameWidget key={numericMatchId} matchId={numericMatchId} />
      )}
    </div>
  );
}
