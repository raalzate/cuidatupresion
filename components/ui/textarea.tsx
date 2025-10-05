import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
  "border-input placeholder:text-muted-foreground focus-visible:border-[rgba(30,86,49,0.7)] focus-visible:ring-[rgba(30,86,49,0.4)] aria-invalid:ring-[rgba(199,54,47,0.25)] dark:aria-invalid:ring-[rgba(241,106,106,0.4)] aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-lg border bg-white px-4 py-3 text-base font-semibold shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[4px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
