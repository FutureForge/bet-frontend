import { cn } from "@/modules/app/utils";
import React from "react";

type BannerProps = {
  src?: string;
  alt?: string;
  className?: string;
};

export function Banner({ src, alt, className }: BannerProps) {
  return (
    <div className={cn("relative w-full h-64", className)}>
      <img src={src || "/banner.png"} alt={alt} />
    </div>
  );
}
