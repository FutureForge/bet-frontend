import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormatAddress(address: string, width?: number): string {
  const xxl = 1800;
  if (address && address.length !== 42) {
    return "Invalid Ethereum Address";
  }
  if (width && width >= xxl) {
    return address;
  }
  const start = address?.slice(0, 4);
  const end = address?.slice(-4);
  return `${start}...${end}`;
}
