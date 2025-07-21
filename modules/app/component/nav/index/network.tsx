import React, { useState, useMemo } from "react";
import { Dropdown } from "../../dropdown/dropdown.snippet";
import { Button } from "../../button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/modules/app/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Badge } from "../../badge";

// SVGs as React Components via SVGR
import BSCIcon from "@/assets/bsc.svg";
import XFIIcon from "@/assets/xfi.svg";
import { useUserChainInfo } from "@/modules/query";
import { Chains, getChain } from "@/modules/blockchain";
import { useSwitchChainMutation } from "@/modules/mutation";

const networks = [
  {
    networkKey: "bnb",
    name: "Binance Smart Chain",
    Icon: BSCIcon,
    chainID: 97,
  },
  {
    networkKey: "crossfi",
    name: "CrossFi",
    Icon: XFIIcon,
    chainID: 4157,
  },
];

export default function Network() {
  const { activeChain } = useUserChainInfo();
  const [open, setOpen] = useState(false);
  const chain = getChain(activeChain?.id || 4157);

  const activeNetwork = chain?.chain || Chains.CROSSFI;
  const isMobile = useMediaQuery("(max-width: 425px)");

  const active = useMemo(
    () => networks.find((n) => n.networkKey === activeNetwork) ?? networks[0],
    [activeNetwork]
  );

  // Sort networks so active network is always on top
  const sortedNetworks = useMemo(() => {
    return [
      ...networks.filter((n) => n.networkKey === activeNetwork),
      ...networks.filter((n) => n.networkKey !== activeNetwork),
    ];
  }, [activeNetwork]);

  const { mutate: switchChainMutation, isPending } = useSwitchChainMutation();

  const handleSwitchChain = (chain: Chains) => {
    switchChainMutation({ chain });
  };

  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <Dropdown.Trigger asChild className="!h-10 data-[state=open]:z-20">
        <Button
          variant="secondary"
          className="rounded-xl flex items-center gap-2 px-3"
        >
          <active.Icon className="w-5 h-5" />
          <ChevronDown className="size-4 data-[state=open]:rotate-180 transition-transform duration-200 ease-in-out" />
        </Button>
      </Dropdown.Trigger>

      {/* Dropdown Menu */}
      <Dropdown.Content
        sideOffset={10}
        align="end"
        alignOffset={isMobile ? -48 : 0}
        className={cn(
          "flex-col rounded-xl min-w-[--radix-dropdown-menu-trigger-width] justify-start items-start gap-4",
          "dropdown-items-wrapper rounded-xl",
          "border border-stroke bg-primary text-text-primary py-0 z-[99999999]"
        )}
      >
        {sortedNetworks.map((item) => {
          const isActive = item.networkKey === activeNetwork;
          const Icon = item.Icon;

          return (
            <Dropdown.Item
              key={item.networkKey}
              onClick={() => {
                handleSwitchChain(item.networkKey as Chains);
              }}
              disabled={isPending}
              className="w-full group p-1.5 outline-none"
            >
              <div
                className={cn(
                  "cursor-pointer hover:border-stroke hover:bg-primary/75 transition-colors duration-500 ease-in-out py-1 px-1.5 border border-transparent rounded-lg flex items-center gap-2"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm flex items-center gap-2 text-text-primary">
                  {item.name}
                </span>
                {isActive && (
                  <Badge color="green" className="text-xs py-0.5 px-2">
                    Active
                  </Badge>
                )}
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
