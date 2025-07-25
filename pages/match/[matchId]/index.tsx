import { useRouter } from "next/router";
import Head from "next/head";
import WidgetComponent from "@/modules/components/widget";

export default function MatchWidgetPage() {
  const router = useRouter();
  const { matchId } = router.query;

  // Show loading state while router is not ready
  if (!router.isReady || !matchId) {
    return (
      <>
        <Head>
          <title>Crossbet - Match Details - Bet smarter, win faster.</title>
          <meta name="description" content={`one bet can change everything`} />
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Crossbet - Match Details - Bet smarter, win faster.</title>
        <meta name="description" content={`one bet can change everything`} />
      </Head>
      <WidgetComponent matchId={Number(matchId)} />
    </>
  );
}
