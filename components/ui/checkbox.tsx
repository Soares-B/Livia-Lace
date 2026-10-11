import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckIcon } from "lucide-react"
import localFont from "next/font/local";

const Montserrat = localFont({
  src: "../../app/Fonts/Unbounded/Unbounded-VariableFont_wght.ttf",
});

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-rose-v focus-visible:ring-3 focus-visible:ring-rose-200/50 disabled:cursor-not-allowed disabled:opacity-50 data-checked:text-primary-foreground [&>svg]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "border-input data-checked:border-primary data-checked:bg-primary",

        pink:
          "border-pink-300 data-checked:border-pink-500 data-checked:bg-pink-500",

        success:
          "border-green-300 data-checked:border-green-600 data-checked:bg-green-600",

        danger:
          "border-red-300 data-checked:border-red-600 data-checked:bg-red-600",
        main:
          "appearence-none w-[30px] h-[30px] bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] rounded-[5px] relative cursor-pointer data-checked:font-[Montserrat] data-checked:text-black data-checked:text-[6px] data-checked:bg-[var(--darkPink-Pastel)]",
        orange:
          "appearence-none w-[20px] h-[20px] bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] rounded-[5px] relative cursor-pointer data-checked:font-[Montserrat] data-checked:text-black data-checked:text-[6px] data-checked:bg-[var(--orange-Pastel)]",
        yellow:
          "appearence-none w-[20px] h-[20px] bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] rounded-[5px] relative cursor-pointer data-checked:font-[Montserrat] data-checked:text-black data-checked:text-[6px] data-checked:bg-[var(--yellow-Pastel)]",
        green:
          "appearence-none w-[20px] h-[20px] bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] rounded-[5px] relative cursor-pointer data-checked:font-[Montserrat] data-checked:text-black data-checked:text-[6px] data-checked:bg-[var(--green-Pastel)]",
        blue:
          "appearence-none w-[20px] h-[20px] bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] rounded-[5px] relative cursor-pointer data-checked:font-[Montserrat] data-checked:text-black data-checked:text-[6px] data-checked:bg-[var(--blue-Pastel)]",
        lilac:
          "appearence-none w-[20px] h-[20px] bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] rounded-[5px] relative cursor-pointer data-checked:font-[Montserrat] data-checked:text-black data-checked:text-[6px] data-checked:bg-[var(--lilac-Pastel)]",
        },

      size: {
        default: "size-4",
        sm: "size-3.5 [&>svg]:size-3",
        lg: "size-7 [&>svg]:size-3",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Checkbox({
  className,
  variant = "default",
  size = "default",
  ...props
}: CheckboxPrimitive.Root.Props &
  VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        checkboxVariants({
          variant,
          size,
          className,
        })
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, checkboxVariants }