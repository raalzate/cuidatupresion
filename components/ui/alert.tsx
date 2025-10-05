import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid w-full items-start gap-y-1.5 rounded-2xl border-2 border-[rgba(64,169,68,0.6)] bg-card px-6 py-5 text-base font-semibold has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-4 [&>svg]:size-6 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "text-card-foreground",
        destructive:
          "border-[rgba(199,54,47,0.7)] text-destructive [&>svg]:text-destructive *:data-[slot=alert-description]:text-[rgba(199,54,47,0.85)]",
  info: "border-[rgba(64,169,68,0.6)] text-accent-foreground [&>svg]:text-accent-foreground *:data-[slot=alert-description]:text-[rgba(30,86,49,0.9)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 text-xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-2 text-base font-medium text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
