import * as React from 'react';
import { cn } from '../../utils';


type LooseAutocomplete<T extends string> = T | Omit<string, T>;
type TypeBadgeColors = LooseAutocomplete<
  | 'primary'
  | 'secondary'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'pink'
  | 'indigo'
  | 'emerald'
  | 'orange'
>;

type TypeBadgeVariants = 'primary' | 'solid';

type BadgeElement = React.ElementRef<'div'>;
type BadgeProps = React.ComponentPropsWithoutRef<'div'> & {
  color?: TypeBadgeColors;
  variant?: TypeBadgeVariants;
};

const Badge = React.forwardRef<BadgeElement, BadgeProps>((props, ref) => {
  const { className, variant, color = 'primary', ...badgeProps } = props;
  return (
    <div
      className={cn(
        "rounded-md w-max py-1 px-2.5 text-[12px] font-medium leading-[18px",
        {
          "bg-badge-primary text-white": color === "primary",
          "bg-badge-secondary text-badge-secondary-text border-badge-secondary-text border": color === "secondary",
          "bg-red-500/15 text-red-500 border border-red-500": color === "red",
          "bg-green-500/15 text-green-500 border border-green-500": color === "green",
          "bg-blue-500/15 text-blue-500": color === "blue",
          "bg-yellow-500/15 text-yellow-500": color === "yellow",
          "": color === "purple",
          "bg-pink-500/15 text-pink-500": color === "pink",
          "bg-indigo-500/15 text-indigo-500": color === "indigo",
          "bg-emerald-500/15 text-emerald-500": color === "emerald",
          "bg-orange-500/15 text-orange-500": color === "orange",
          "bg-brand-primary-base text-white h-6 rounded-md flex items-center justify-center":
            variant === "solid",
        },
        className
      )}
      ref={ref}
      {...badgeProps}
    />
  );
});

Badge.displayName = 'Badge';

export { Badge };
