import { usePlaceBetMutation } from "@/modules/mutation";
import {
  getUserNativeBalance,
  useGetAllFixtureQuery,
  useGetSingleFixtureQuery,
  useUserChainInfo,
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
    </>
  );
}
