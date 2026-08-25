import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "w-[90%] h-full border-[3px] border-solid border-[var(--darkPink-Pastel)] rounded-[10px] font-[Montserrat] p-[5px] pl-[5px] focus:outline-none bg-white focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus-visible:border-[var(--darkPink-Pastel)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
