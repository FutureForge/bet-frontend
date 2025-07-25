import { useQuery } from "@tanstack/react-query";
import { useUserChainInfo } from "../user/user.query";
import { queryKeys } from "../query-keys";
import { SingleBetSlip } from "@/utils/types/bet/bets.type";
import { BACKEND_URL } from "@/utils/configs";
import axios from "axios";

export function useSingleBetQuery(id: string) {
  const { account } = useUserChainInfo();
  const userAddress = account?.address;

  console.log("inside single bet query");
  console.log(id);

  return useQuery({
    queryKey: [queryKeys.bets.singleBet, { userAddress, id }],
    queryFn: async () => {
      const res = await axios.get<{
        data: SingleBetSlip;
      }>(`${BACKEND_URL}/bets/${id}`);

      console.log("inside single bet query after res");
      console.log({ res });

      const bet = res.data.data;

      return bet;
    },
    enabled: !!id,
    // refetchInterval: 5000,
  });
}
