import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        className={cn(
          "flex h-12 w-full rounded-lg border border-input bg-white px-4 py-3 pr-12 text-base font-semibold ring-offset-background shadow-xs file:border-0 file:bg-transparent file:text-base file:font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-[rgba(30,86,49,0.7)] focus-visible:ring-[rgba(30,86,49,0.4)] focus-visible:ring-[4px] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        type={type}
        {...props}
      />
    </div>
  );
});
Input.displayName = "Input";

export { Input };
