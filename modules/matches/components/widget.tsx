import React from "react";
import Script from "next/script";

import { SPORT_API_KEY } from "@/utils/configs";

export function APIFootballGameWidget({ matchId }: { matchId: number }) {
  const [scriptLoaded, setScriptLoaded] = React.useState(false);

  return (
    <>
      {!scriptLoaded && (
        <div className="w-full flex items-center justify-center py-10 h-[60vh]">
          <span className="animate-pulse text-muted-foreground">
            Loading match details…
          </span>
        </div>
      )}
      <div
        id="wg-api-football-game"
        data-host="v3.football.api-sports.io"
        data-key={SPORT_API_KEY}
        data-id={matchId}
        data-theme=""
        data-refresh="15"
        data-show-errors="false"
        data-show-logos="true"
        style={{ display: scriptLoaded ? "block" : "none" }}
      />
      <Script
        src="https://widgets.api-sports.io/2.0.3/widgets.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setScriptLoaded(true)}
      />
    </>
  );
}
