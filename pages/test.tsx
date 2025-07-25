import { SPORT_API_KEY } from "@/utils/configs";

export default function TestPage() {
  // return <WidgetComponent matchId={1411481} />;

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
}
