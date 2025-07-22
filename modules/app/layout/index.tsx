
import { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Nav } from "../component/nav";
import { WinningDialog } from "@/modules/app/component/winning-dialog";

type RootLayoutProps = {
  children: ReactNode;
  scrollToTop?: boolean;
};

const Toast = dynamic(() => import("@/modules/components/toast/toast"), {
  ssr: false,
});
export const RootLayout = ({ children, scrollToTop }: RootLayoutProps) => {
  return (
    <div className="flex isolate flex-col h-screen relative">
      <Nav />
      <div
        className="w-full z-10 py-6 font-instrument max-w-[1440px] mx-auto"
        ref={(node) => {
          if (node && scrollToTop) {
            node.scroll(0, 0);
          }
        }}
      >
        {children}
        <Toast />
        {/* <WinningDialog/> */}
      </div>
    </div>
  );
};
