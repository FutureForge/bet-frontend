"use client";

import { useEffect } from "react";
import { SPORT_API_KEY } from "@/utils/configs";

interface WidgetComponentProps {
  matchId: number;
}

const WidgetComponent: React.FC<WidgetComponentProps> = ({ matchId }) => {
  console.log(`WidgetComponent rendered with matchId: ${matchId}`);

  return (
    <>
      <div
        id="wg-api-football-game"
        data-host="v3.football.api-sports.io"
        data-key={SPORT_API_KEY}
        data-id="718243"
        data-theme=""
        data-refresh="15"
        data-show-errors="false"
        data-show-logos="true"
      ></div>
      <script
        type="module"
        src="https://widgets.api-sports.io/2.0.3/widgets.js"
      ></script>
    </>
  );

  // useEffect(() => {
  //   // Check if the script already exists
  //   const existingScript = document.querySelector(
  //     'script[src="https://widgets.api-sports.io/2.0.3/widgets.js"]'
  //   );

  //   if (!existingScript) {
  //     const script = document.createElement("script");
  //     script.src = "https://widgets.api-sports.io/2.0.3/widgets.js";
  //     script.async = true;
  //     script.type = "module";
  //     document.body.appendChild(script);
  //   }

  //   // Optional: Cleanup function to remove the script
  //   // Note: Removing the script might affect other instances of the widget
  //   // return () => {
  //   //   const script = document.querySelector(
  //   //     'script[src="https://widgets.api-sports.io/2.0.3/widgets.js"]'
  //   //   );
  //   //   if (script) {
  //   //     document.body.removeChild(script);
  //   //   }
  //   // };
  // }, []);

  // return (
  //   <div className="p-6 md:px-8 px-4 max-w-[1440px] mx-auto">
  //     <div className="bg-white/10 rounded-xl p-6">
  //       <h1 className="text-xl font-semibold mb-4">Match Details</h1>
  //       <div
  //         id="wg-api-football-game"
  //         data-host="v3.football.api-sports.io"
  //         data-key={SPORT_API_KEY}
  //         data-id={matchId}
  //         data-theme=""
  //         data-refresh="15"
  //         data-show-errors="false"
  //         data-show-logos="true"
  //         className="wg_loader"
  //       ></div>
  //     </div>
  //   </div>
  // );
};

export default WidgetComponent;
