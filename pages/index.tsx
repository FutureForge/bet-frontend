import Image from "next/image";
import localFont from "next/font/local";
import HomePage from "@/modules/home";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div className="w-full md:px-8 px-4">
      <Head>
        <title>Crossbet - Bet smarter, win faster.</title>
        <meta name="description" content={`one bet can change everything`} />
      </Head>
      <HomePage />
    </div>
  );
}
