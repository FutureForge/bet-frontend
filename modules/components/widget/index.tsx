import { WidgetConfig } from "@/utils/types/matches/matches.type";
import { SPORT_API_KEY } from "@/utils/configs";

interface DynamicWidgetProps {
  widget: WidgetConfig;
}

export function DynamicWidget({ widget }: DynamicWidgetProps) {
  console.log("DynamicWidget rendered with:", widget);

  const renderWidget = () => {
    console.log(
      "Rendering widget type:",
      widget.type,
      "with config:",
      widget.config
    );
    switch (widget.type) {
      case "game":
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

      case "standings":
        return (
          <>
            <div
              id="wg-api-football-standings"
              data-host={widget.config.host}
              data-key={SPORT_API_KEY}
              data-league={widget.config.league}
              data-team={widget.config.team}
              data-season={widget.config.season}
              data-theme={widget.config.theme}
              data-show-errors={widget.config.showErrors.toString()}
              data-show-logos={widget.config.showLogos.toString()}
            ></div>
            <script
              type="module"
              src="https://widgets.api-sports.io/2.0.3/widgets.js"
            ></script>
          </>
        );

      default:
        return <div>Unsupported widget type</div>;
    }
  };

  return (
    <div className="widget-container">
      <div>Widget Type: {widget.type}</div>
      {renderWidget()}

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
    </div>
  );
}
