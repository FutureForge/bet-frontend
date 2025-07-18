import * as CheckboxRadix from '@radix-ui/react-checkbox'
import { forwardRef, useId } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../utils'

type CheckboxRef = React.ElementRef<typeof CheckboxRadix.Root>
type CheckboxProps = CheckboxRadix.CheckboxProps & {
  label: string
  labelClassName?: string
}

const ROOT_NAME = 'Checkbox'

const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(
  ({ className, id: idProps, label, labelClassName, ...props }, ref) => {
    const id = useId()

    return (
      <div className="flex items-center gap-2">
        <CheckboxRadix.Root
          ref={ref}
          id={id ?? idProps}
          className={cn(
            `peer ring-offset-background focus-visible:ring-none data-[state=checked]:bg-secondary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary h-4 w-4 shrink-0 rounded border-2 border-[#D6DBDC] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          {...props}
        >
          <CheckboxRadix.Indicator className="flex items-center justify-center text-current">
            <Check className="h-3 w-3 text-white" />
          </CheckboxRadix.Indicator>
        </CheckboxRadix.Root>
        <label
          htmlFor={id ?? idProps}
          className={cn(
            'text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize',
            labelClassName,
          )}
        >
          {label}
        </label>
      </div>
    )
  },
)

Checkbox.displayName = ROOT_NAME

export { Checkbox }
