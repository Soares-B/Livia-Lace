import * as React from "react"

import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"
import localFont from "next/font/local";

const Montserrat = localFont({
  src: "../../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: "",

        main:
          "w-[90%] h-full border-[3px] border-solid border-[var(--darkPink-Pastel)] rounded-[10px] font-[Montserrat] pl-[5px] focus:outline-none bg-white focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus-visible:border-[var(--darkPink-Pastel)]",
      },

      size: {
        default: "h-8",
        sm: "h-7 text-sm",
        lg: "h-10 text-base",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        inputVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

export { Input, inputVariants }