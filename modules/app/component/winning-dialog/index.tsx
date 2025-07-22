"use client";
import React from "react";
import { Dialog } from "../dialog/dialog";
import Image from "next/image";
import XFI from "@/assets/xfi.svg";
import { Button } from "../button";
import Xmark from "@/assets/xmark.svg";

export function WinningDialog() {
  return (
    <Dialog.Root defaultOpen={true} modal>
      <Dialog.Content
        className="max-w-[493px] w-full bg-[#23394D] p-0 overflow-hidden rounded-xl relative border-0"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="relative w-[493px] flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#23394D] z-10" />
          {/* Background shine */}
          <Image
            src="/shine.png"
            alt="Shine"
            fill
            className="absolute inset-0 object-cover z-0"
          />
          {/* Trophy with Crown */}{" "}
          <div className="z-40 pt-6">
            <h3 className="text-4xl font-bold text-white relative">YOU WON</h3>
            <div className="flex items-center justify-center gap-2 mt-4">
              <XFI className="size-6" />
              <p className="text-2xl font-medium">2,305 XFI</p>
            </div>
          </div>
          <div className="relative z-30 mb-4 w-full flex items-center justify-center">
            {/* Trophy */}
            <Image
              src="/trophy.png"
              alt="Trophy"
              width={182}
              height={329}
              className="relative z-30"
            />
            {/* Crown positioned on top of trophy */}
            <Image
              src="/golden.png"
              alt="Golden Crown"
              width={800}
              height={100}
              className="absolute -top-40 left-1/2 -translate-x-1/2 z-20"
            />
          </div>
          {/* Winning Text */}
          <div className="z-40 text-center pb-6">
            <p className="text-white">From Sport/Ticket ID: 241007</p>
            <Button className="bg-[#FFFFFF1A] mt-4 rounded-xl w-full">
              View Details
            </Button>
          </div>
        </div>
        <Dialog.Close asChild>
          <button
            className="absolute top-4 right-4 z-40 p-1 hover:opacity-80 transition-opacity"
            aria-label="Close dialog"
          >
            <Xmark className="size-8 text-white" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
}
