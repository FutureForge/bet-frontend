import { QueryProvider } from "@/modules/provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "thirdweb/react";
import { Inter, Instrument_Sans } from "next/font/google";
import { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { RootLayout } from "@/modules/app/layout";

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};
const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: [ "400", "500", "600", "700"],
  variable: "--instrument",
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <RootLayout>{page}</RootLayout>);

  return (
    <ThirdwebProvider>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --font-instrument: ${instrument.style.fontFamily};
            --font-instrument: ${instrument.style.fontFamily};
            }`,
        }}
      />
      <QueryProvider>{getLayout(<Component {...pageProps} />)}</QueryProvider>
    </ThirdwebProvider>
  );
}
