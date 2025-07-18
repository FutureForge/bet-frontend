"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ReactNode } from "react";
import { cn } from "../../utils";

type TabsRootProps = {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: ReactNode;
};

export const TabsRoot = ({
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsRootProps) => {
  return (
    <TabsPrimitive.Root
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      className={cn("w-full", className)}
    >
      {children}
    </TabsPrimitive.Root>
  );
};

export const TabsList = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <TabsPrimitive.List className={cn("flex gap-2", className)}>
      {children}
    </TabsPrimitive.List>
  );
};

type TabTriggerProps = {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "background" | "underline";
};

export const TabsTrigger = ({
  value,
  children,
  disabled,
  className,
  variant = "background", // ✅ default variant
}: TabTriggerProps) => {
  const baseStyles =
    "px-4 py-2 text-sm font-medium text-muted transition-colors focus:outline-none";
  const backgroundStyles = cn(
    "rounded-md",
    "data-[state=active]:bg-secondary data-[state=active]:text-white",
    "hover:bg-muted/70"
  );
  const underlineStyles = cn(
    "border-b-2 border-transparent",
    "data-[state=active]:border-secondary data-[state=active]:text-white",
    "hover:text-secondary"
  );

  return (
    <TabsPrimitive.Trigger
      value={value}
      disabled={disabled}
      className={cn(
        baseStyles,
        variant === "background" ? backgroundStyles : underlineStyles,
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
};

export const TabsContent = ({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <TabsPrimitive.Content value={value} className={cn("mt-4", className)}>
      {children}
    </TabsPrimitive.Content>
  );
};
