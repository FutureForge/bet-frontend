import { useRouter } from "next/router";
import Head from "next/head";
import { useGetSingleFixtureQuery } from "@/modules/query";
import { Button } from "@/modules/app/component/button";
import { SingleFixtureData } from "@/utils/types/matches/matches.type";
import { MatchTimeline } from "@/modules/matches/components/match-timeline";

export default function MatchWidgetPage() {
  const router = useRouter();
  const { matchId } = router.query;


  const {
    data: matchData,
    isLoading,
    error,
  } = useGetSingleFixtureQuery(matchId as string);

  console.log({ matchData });

  // Show loading state while router is not ready
  if (!router.isReady || !matchId || isLoading) {
    return (
      <>
        <Head>
          <title>Crossbet - Match Details - Bet smarter, win faster.</title>
          <meta name="description" content={`one bet can change everything`} />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-[#131F2A]">
          <div className="text-white text-lg">Loading match details...</div>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Head>
          <title>Crossbet - Match Details - Bet smarter, win faster.</title>
          <meta name="description" content={`one bet can change everything`} />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-[#131F2A]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">
              Error loading match details
            </div>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </>
    );
  }

  // Show no data state
  if (!matchData) {
    return (
      <>
        <Head>
          <title>Crossbet - Match Details - Bet smarter, win faster.</title>
          <meta name="description" content={`one bet can change everything`} />
        </Head>
        <div className="flex items-center justify-center min-h-screen bg-[#131F2A]">
          <div className="text-center">
            <div className="text-white text-lg mb-4">No match data found</div>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const getMatchStatus = () => {
    if (!matchData?.status) return "Unknown";
    const { status } = matchData;
    if (status.short === "1H") return "1st Half";
    if (status.short === "2H") return "2nd Half";
    if (status.short === "HT") return "Half Time";
    if (status.short === "FT") return "Full Time";
    if (status.short === "NS") return "Not Started";
    if (status.short === "TBD") return "To Be Defined";
    if (status.short === "PST") return "Postponed";
    if (status.short === "CANC") return "Cancelled";
    if (status.short === "SUSP") return "Suspended";
    if (status.short === "INT") return "Interrupted";
    if (status.short === "ABD") return "Abandoned";
    return status.long;
  };

  const getStatusColor = (statusShort: string) => {
    switch (statusShort) {
      case "1H":
      case "2H":
        return "bg-[#3475DA] text-white"; // Blue for live
      case "FT":
        return "bg-green-600 text-white"; // Green for finished
      case "NS":
        return "bg-gray-600 text-white"; // Gray for not started
      case "HT":
        return "bg-[#E8B931] text-black"; // Yellow for half time
      case "PST":
      case "CANC":
        return "bg-red-600 text-white"; // Red for postponed/cancelled
      case "SUSP":
      case "INT":
      case "ABD":
        return "bg-orange-600 text-white"; // Orange for suspended/interrupted
      default:
        return "bg-gray-500 text-white";
    }
  };

  const isLive = matchData?.status?.short === "1H" || matchData?.status?.short === "2H";
  const isFinished = matchData?.status?.short === "FT";
  const isNotStarted = matchData?.status?.short === "NS";
  const isHalfTime = matchData?.status?.short === "HT";

  return (
    <>
      <Head>
        <title>Crossbet - Match Details - Bet smarter, win faster.</title>
        <meta name="description" content={`one bet can change everything`} />
      </Head>

      <div className="min-h-screen bg-[#131F2A] text-white">
        {/* Header Section */}
        <div className="bg-[#1E2C37] border-b border-[#FFFFFF1A] p-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-[#898F94] hover:text-white border-none bg-transparent"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Back</span>
              </Button>
            </div>

            {/* Match Info Pills */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {matchData?.status?.short && (
                  <div className={`${getStatusColor(matchData.status.short)} px-4 py-2 rounded-full text-sm font-medium`}>
                    {getMatchStatus()}
                  </div>
                )}
                {isLive && matchData?.status?.elapsed && (
                  <div className="bg-[#E8B931] text-black px-4 py-2 rounded-full text-sm font-medium">
                    {matchData.status.elapsed}'
                  </div>
                )}
                {isHalfTime && (
                  <div className="bg-[#E8B931] text-black px-4 py-2 rounded-full text-sm font-medium">
                    Half Time
                  </div>
                )}
                {isNotStarted && (
                  <div className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {matchData?.time || "TBD"}
                  </div>
                )}
              </div>
              <div className="text-sm text-[#898F94]">
                {matchData?.date ? formatDate(matchData.date) : "Date TBD"}
              </div>
            </div>
          </div>
        </div>

        {/* Match Details Section */}
        <div className="max-w-4xl mx-auto p-4">
          {/* Match Status Display */}
          {matchData?.status?.short && (
            <div className="text-center mb-6">
              {isLive && matchData?.status?.elapsed ? (
                <div className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Live {matchData.status.elapsed}'</span>
                </div>
              ) : isNotStarted ? (
                <div className="inline-flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  <span>Kickoff at {matchData?.time || "TBD"}</span>
                </div>
              ) : (
                <div className={`inline-flex items-center space-x-2 ${getStatusColor(matchData.status.short)} px-4 py-2 rounded-full text-sm font-medium`}>
                  <span>{getMatchStatus()}</span>
                </div>
              )}
              <div className="text-sm text-[#898F94] mt-2">
                {matchData?.status?.long || getMatchStatus()}
              </div>
            </div>
          )}

          {/* Score Display */}
          <div className="bg-[#1E2C37] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex flex-col items-center space-y-3 flex-1">
                <img
                  src={matchData?.homeTeamLogo || ""}
                  alt={matchData?.homeTeam || "Home Team"}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <h3 className="text-lg font-semibold text-center">
                  {matchData?.homeTeam || "Home Team"}
                </h3>
              </div>

              {/* Score */}
              <div className="flex flex-col items-center space-y-2">
                <div className="text-4xl font-bold">
                  {matchData?.goals?.home || 0} - {matchData?.goals?.away || 0}
                </div>
                <div className="text-sm text-[#898F94]">Current Score</div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center space-y-3 flex-1">
                <img
                  src={matchData?.awayTeamLogo || ""}
                  alt={matchData?.awayTeam || "Away Team"}
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "";
                  }}
                />
                <h3 className="text-lg font-semibold text-center">
                  {matchData?.awayTeam || "Away Team"}
                </h3>
              </div>
            </div>
          </div>

          {/* Match Information */}
          <div className="bg-[#1E2C37] rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-[#898F94] mb-1">League</div>
                <div className="font-medium">
                  {matchData?.leagueName || "TBD"}
                </div>
              </div>
              <div>
                <div className="text-[#898F94] mb-1">Venue</div>
                <div className="font-medium">
                  {matchData?.venueDetails?.name || matchData?.venue || "TBD"}
                </div>
              </div>
              <div>
                <div className="text-[#898F94] mb-1">Round</div>
                <div className="font-medium">
                  {matchData?.matchDay || "TBD"}
                </div>
              </div>
            </div>
          </div>

                      {/* Match Summary */}
            <div className="bg-[#1E2C37] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Match Summary</h3>
              <div className="space-y-6">
                <MatchTimeline
                  period="1st Half"
                  periodScore={`${matchData?.score?.halftime?.home || 0} - ${matchData?.score?.halftime?.away || 0}`}
                  events={[]}
                />

                <MatchTimeline
                  period="2nd Half"
                  periodScore={`${matchData?.score?.fulltime?.home || 0} - ${matchData?.score?.fulltime?.away || 0}`}
                  events={[]}
                />
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
