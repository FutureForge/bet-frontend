import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { cn, getFormatAddress } from "../../utils";
import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { useDisableScroll } from "../../hooks/useDisableScroll";
import { chain1, chain2, client } from "@/utils/configs";
import { useUserChainInfo, useUserDBQuery } from "@/modules/query";
import Logo from "@/assets/logo.svg";
import LogoText from "@/assets/logoText.svg";
import { Dropdown } from "../dropdown/dropdown.snippet";
import { Button } from "../button";
const Nav_Links = [
  {
    name: "Home",
    link: "/",
  },
];

export function Nav() {
  const { account } = useUserChainInfo();
  const [open, setOpen] = useState(false);


  const { data: userDb } = useUserDBQuery();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useDisableScroll(isMobileNavOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={cn(
        "flex sticky top-0 inset-x-0 z-50 py-3 h-20 w-full md:px-8 px-4 gap-4 justify-between items-center font-inter",
        isScrolled ? "bg-primary" : "bg-transparent"
      )}
    >
      <Link href="/" className="flex items-center gap-2">
        <Logo className="size-10" />
        <LogoText className="hidden md:inline w-[140px] ml-2" />
      </Link>
      <div className="lg:w-1/3 w-1/2 flex lg:items-center justify-end lg:gap-6 gap-2">
        {!account?.address ? (
          <ConnectButton
            client={client}
            chains={[chain1, chain2]}
            wallets={[createWallet("io.metamask")]}
            connectButton={{
              label: "Connect Wallet",
              className:
                "!font-instrument !rounded-xl lg:!w-36 !w-[75%] max-sm:!w-full !flex !items-center !justify-center hover:!scale-105 !duration-300 !ease-in-out !transition !bg-secondary !text-white !h-10",
            }}
          />
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-muted">My Profile</p>
            <p className="font-medium">Bal:5,355 XFI</p>
            <Dropdown.Root>
            <Dropdown.Trigger asChild className="!h-10 data-[state=open]:z-20">
              <Button variant="secondary">

              </Button>
            </Dropdown.Trigger>
            </Dropdown.Root>
            <Button variant="secondary" className="!bg-priamry rounded-xl border-0 font-medium">
              {getFormatAddress(account?.address)}
            </Button>
          </div>
        )}
      </div>
      <div className="min-[1170px]:hidden flex items-center gap-8">
        {isMobileNavOpen ? (
          <IoClose
            size={30}
            onClick={() => setIsMobileNavOpen(false)}
            className="text-muted-foreground"
          />
        ) : (
          <IoIosMenu
            size={30}
            className="text-muted-foreground"
            onClick={() => setIsMobileNavOpen(true)}
          />
        )}
      </div>
      {isMobileNavOpen && <MobileNav />}
    </nav>
  );
}

function MobileNav() {
  return (
    <div className="fixed top-[64px] left-0 w-full h-screen flex flex-col items-center bg-sec-bg text-primary-foreground z-50">
      <div className="flex flex-col items-center justify-center gap-5 mt-10">
        {Nav_Links.map((item) => {
          const { name, link } = item;

          return (
            <ul key={name} className="flex">
              <li className="flex">
                <Link
                  href={link}
                  className="hover:text-button-hover font-medium text-xl text-muted-foreground"
                >
                  {name}
                </Link>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}
