import { Chains } from "@/modules/blockchain";
import {
  useClaimBetMutation,
  usePlaceBetMutation,
  useSwitchChainMutation,
} from "@/modules/mutation";
import {
  useUserNativeBalance,
  useGetAllFixtureQuery,
  useGetSingleFixtureQuery,
  useUserChainInfo,
  useUserClaimedBetsQuery,
  useUserUnclaimedBetsQuery,
} from "@/modules/query";
import { DynamicWidget } from "@/modules/components/widget";
import { useEffect } from "react";
import { SPORT_API_KEY } from "@/utils/configs";

export default function Home() {
  const { activeChain, account } = useUserChainInfo();
  const { balanceData, isBalanceLoading } = useUserNativeBalance();

  console.log({ activeChain });
  console.log({ account });
  console.log({ balanceData, isBalanceLoading });

  // const { data: allFixtures } = useGetAllFixtureQuery();
  // console.log({ allFixtures });

  const { data: singleFixture } = useGetSingleFixtureQuery("1378969");
  console.log({ singleFixture });

  // const widget = singleFixture?.widget;

  // const { data: userUnclaimed } = useUserUnclaimedBetsQuery();
  // console.log({ userUnclaimed });

  // const { data: userClaimed } = useUserClaimedBetsQuery();
  // console.log({ userClaimed });

  const switchChainMutation = useSwitchChainMutation();

  const handleSwitchChain = (chain: Chains) => {
    switchChainMutation.mutate({ chain });
  };

  const claimReward = useClaimBetMutation();

  const handleClaimBet = () => {
    claimReward.mutate({
      betId: 1,
      chain: "crossfi",
      claimSignature:
        "0x7e4b37fbf78c6e40cc4610000b8871e2540ada7839abbaed12bab2999cbf9cd43cb8b8bb47d777a36dfdafc85a442e91ecd28f2c52ae101a05ec542ac3eb81a01c",
      id: "68753c3612e5ce46ab2e51be",
      rewardAmount: 1,
    });
  };

  const placeBet = usePlaceBetMutation();

  const handlePlaceBet = () => {
    // placeBet.mutate({
    //   betType: "single",
    //   betSlip: {
    //     totalBetAmount: 0.5,
    //     selections: [
    //       {
    //         matchId: 1208021,
    //         oddsAtPlacement: 2,
    //         selectedOutcome: "home",
    //       },
    //       {
    //         matchId: 1208022,
    //         oddsAtPlacement: 2,
    //         selectedOutcome: "away",
    //       },
    //     ],
    //   },
    // });
  };

  return (
    <>
      <h1>HELLO WORLD</h1>

      <div
        id="wg-api-football-game"
        data-host="v3.football.api-sports.io"
        data-key={SPORT_API_KEY}
        data-id={1378969}
        data-theme=""
        data-refresh="15"
        data-show-errors="false"
        data-show-logos="true"
      ></div>
      <script
        type="module"
        src="https://widgets.api-sports.io/2.0.3/widgets.js"
      ></script>

      {/* Dynamic Football Widget
      {isLoading ? (
        <div>Loading fixture data...</div>
      ) : error ? (
        <div>Error loading fixture: {error.message}</div>
      ) : widget ? (
        <DynamicWidget widget={widget} />
      ) : (
        <div>No widget data available</div>
      )} */}

      <button onClick={handlePlaceBet}>place bet</button>
      <br />
      <br />
      <button onClick={handleClaimBet}>claim reward</button>
      <br />
      <br />
      <button onClick={() => handleSwitchChain(Chains.CROSSFI)}>
        switch chain
      </button>
    </>
  );
}
