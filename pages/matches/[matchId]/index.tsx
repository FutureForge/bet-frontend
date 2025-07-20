import { APIFootballGameWidget } from "@/modules/matches/components/widget";
import { useRouter } from "next/router";
import React from "react";

export default function MatchPage() {
  // <-- default export
  const router = useRouter();
  const { matchId } = router.query;

  const numericMatchId =
    typeof matchId === "string"
      ? parseInt(matchId, 10)
      : Array.isArray(matchId)
      ? parseInt(matchId[0]!, 10)
      : NaN;

  const valid = Number.isFinite(numericMatchId) && numericMatchId > 0;

  console.log("matchId:", matchId, "numericMatchId:", numericMatchId);

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
