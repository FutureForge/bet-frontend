/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode, forwardRef, useEffect, useRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../utils";

type TooltipContentProps = React.ComponentProps<
  typeof TooltipPrimitive.Content
>;

type TooltipProps<T = any> = {
  children: ReactNode;
  content: T;
  delayDuration?: number;
  asChild?: boolean;
  open?: boolean;
} & Omit<TooltipContentProps, "children">;

const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>((props, ref) => {
  const {
    children,
    content,
    delayDuration = 300,
    asChild = true,
    className,
    open,
    ...contentProps
  } = props;
  const prevActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const { target } = event;
      prevActiveElement.current = target as HTMLElement;
    };
    window.addEventListener("focusin", handleFocus);
    return () => window.removeEventListener("focusin", handleFocus);
  }, []);

  return (
    <TooltipPrimitive.Root open={open} delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger
        ref={ref}
        asChild={asChild}
        onFocus={(event) => {
          if (prevActiveElement.current === event.target) {
            event.preventDefault();
          }
        }}
      >
        {children}
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={cn(
            "bg-background-surface border border-stroke-primary rounded-[.5rem] text-text-primary p-2.5 text-sm z-[100]",
            "data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade",
            className
          )}
          {...contentProps}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-stroke-primary" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
});

Tooltip.displayName = "Tooltip";

export default Tooltip;
