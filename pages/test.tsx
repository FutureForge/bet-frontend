import { chain1, chain2, client } from "@/utils/configs";
import { ConnectButton } from "thirdweb/react";

export default function Home() {
  return (
    <>
      <ConnectButton client={client} chains={[chain1, chain2]} />
      <h1>HELLO WORLD</h1>;
    </>
  );
}
