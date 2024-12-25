"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const LoadingSpinner = ({
  show,
  hasContent,
}: {
  show: boolean;
  hasContent: boolean;
}) => {
  if (!show) return null;
  return (
    <Loader2 className={cn("h-4 w-4 animate-spin", hasContent && "mr-2")} />
  );
};

const LoadingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading, children, ...props },
    ref
  ) => {
    const buttonClassNames = cn(buttonVariants({ variant, size }), className);
    const hasContent = Boolean(children);

    const content = (
      <>
        <LoadingSpinner show={loading ?? false} hasContent={hasContent} />
        {children}
      </>
    );

    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className={buttonClassNames}
        disabled={loading}
        {...props}
      >
        {content}
      </Component>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton, buttonVariants };
