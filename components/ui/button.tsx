import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg text-base font-semibold tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-[rgba(30,86,49,0.7)] focus-visible:ring-[rgba(30,86,49,0.4)] focus-visible:ring-[4px] aria-invalid:ring-[rgba(199,54,47,0.25)] dark:aria-invalid:ring-[rgba(241,106,106,0.4)] aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-[#1C6F2E]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-[#B02B26] focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[rgba(64,169,68,0.6)] bg-background text-foreground shadow-xs hover:bg-[rgba(212,239,223,0.85)] hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-[#E39A00]",
        ghost:
          "hover:bg-[rgba(212,239,223,0.85)] hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline hover:text-[#1C6F2E]",
      },
      size: {
        default: "h-12 px-6 py-3 has-[>svg]:px-5",
        sm: "h-10 rounded-md gap-2 px-4 has-[>svg]:px-3.5 text-base",
        lg: "h-14 rounded-xl px-8 has-[>svg]:px-6 text-lg",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
