
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-crypto-green/10 text-crypto-green",
        danger: "bg-crypto-red/10 text-crypto-red",
        warning: "bg-crypto-yellow/10 text-crypto-yellow",
        info: "bg-crypto-blue/10 text-crypto-blue",
        outline: "border border-input bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant }), className)} {...props} />
  );
}

export { Chip, chipVariants };
