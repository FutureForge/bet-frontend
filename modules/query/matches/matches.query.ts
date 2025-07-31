import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query-keys";
import axios from "axios";
import { BACKEND_URL } from "@/utils/configs";
import {
  FootballData,
  SingleFixtureAPIResponse,
  SingleFootballData,
} from "@/utils/types/matches/matches.type";

export function useGetAllFixtureQuery() {
  return useQuery({
    queryKey: [queryKeys.matches.allMatches],
    queryFn: async () => {
      const res = await axios.get<FootballData>(`${BACKEND_URL}/matches`);
      const dummyRes = await axios.get<FootballData>(
        `${BACKEND_URL}/matches/dummy`
      );

      const fixtures = res.data;
      const dummyFixtures = dummyRes.data;

      if (!fixtures.success && !dummyFixtures.success) {
        return [];
      }

      return [dummyFixtures.data, ...fixtures.data];
    },
    enabled: true,
    refetchInterval: 5000,
  });
}

export function useGetSingleFixtureQuery(fixtureId: string) {
  return useQuery({
    queryKey: [queryKeys.matches.single, { fixtureId }],
    queryFn: async () => {
      const res = await axios.get<SingleFixtureAPIResponse>(`${BACKEND_URL}/matches/${fixtureId}`);

      console.log({res})

      const fixture = res.data;

      if (!fixture.success) {
        throw new Error();
      }

      return fixture.data;
    },
    enabled: !!fixtureId,
    refetchInterval: 5000,
  });
}
