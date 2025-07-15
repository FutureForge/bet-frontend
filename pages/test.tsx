import { Chains } from "@/modules/blockchain";
import { useClaimBetMutation, usePlaceBetMutation } from "@/modules/mutation";
import {
  getUserNativeBalance,
  useGetAllFixtureQuery,
  useGetSingleFixtureQuery,
  useUserChainInfo,
  useUserUnclaimedBetsQuery,
} from "@/modules/query";

export default function Home() {
  const { activeChain, account } = useUserChainInfo();
  const { balanceData, isBalanceLoading } = getUserNativeBalance();

  // console.log({ activeChain });
  // console.log({ account });
  // console.log({ balanceData, isBalanceLoading });

  // const { data: allFixtures } = useGetAllFixtureQuery();
  // console.log({ allFixtures });

  // const { data: singleFixture } = useGetSingleFixtureQuery("1378969");
  // console.log({ singleFixture });

  // const { data: userUnclaimed } = useUserUnclaimedBetsQuery();
  // console.log({ userUnclaimed });

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
    placeBet.mutate({
      totalBetAmount: 0.5,
      selections: [
        {
          matchId: 1208021,
          oddsAtPlacement: 2,
          selectedOutcome: "home",
        },
        {
          matchId: 1208022,
          oddsAtPlacement: 2,
          selectedOutcome: "away",
        },
      ],
    });
  };

  return (
    <>
      <h1>HELLO WORLD</h1>
      <button onClick={handlePlaceBet}>place bet</button>
      <br />
      <br />
      <button onClick={handleClaimBet}>claim reward</button>
    </>
  );
}
