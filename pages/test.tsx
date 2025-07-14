import { getUserNativeBalance, useUserChainInfo } from "@/modules/query";

export default function Home() {
  const { activeChain, account } = useUserChainInfo();
  const { balanceData, isBalanceLoading } = getUserNativeBalance();

  console.log({ activeChain });
  console.log({ account });
  console.log({ balanceData, isBalanceLoading });

  return (
    <>
      <h1>HELLO WORLD</h1>;
    </>
  );
}
