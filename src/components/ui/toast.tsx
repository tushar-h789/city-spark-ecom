"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-lg p-4 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border border-gray-300 bg-white text-gray-900",
        info: "border-blue-100 bg-blue-50 text-blue-900",
        success: "border-green-100 bg-green-50 text-green-900",
        warning: "border-yellow-100 bg-yellow-50 text-yellow-900",
        destructive: "border-red-100 bg-red-50 text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BaseToastProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Root
>;
interface ToastProps
  extends Omit<BaseToastProps, "variant">,
    VariantProps<typeof toastVariants> {
  duration?: number;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, duration = 4000, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (!isVisible) {
      setIsVisible(true);
    }
  }, [props.open, isVisible]);

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      duration={duration}
      onOpenChange={(open) => {
        if (!open) setIsVisible(false);
        props.onOpenChange?.(open);
      }}
      onPause={() => {}}
      onResume={() => {}}
      onFocus={(e) => e.currentTarget.blur()}
      {...props}
    >
      {isVisible && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gray-100">
          <div
            className={cn(
              "h-full",
              variant === "info" && "bg-blue-500",
              variant === "success" && "bg-green-500",
              variant === "warning" && "bg-yellow-500",
              variant === "destructive" && "bg-red-500",
              variant === "default" && "bg-gray-500"
            )}
            style={{
              animation: `progress ${duration - 100}ms linear forwards`,
              transform: "scaleX(1)",
              transformOrigin: "left",
            }}
          />
        </div>
      )}
      {props.children}
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100",
      "text-gray-500 hover:bg-gray-100",
      "group-[.info]:text-blue-500 group-[.info]:hover:bg-blue-100",
      "group-[.success]:text-green-500 group-[.success]:hover:bg-green-100",
      "group-[.warning]:text-yellow-500 group-[.warning]:hover:bg-yellow-100",
      "group-[.destructive]:text-red-500 group-[.destructive]:hover:bg-red-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90 leading-normal", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50",
      "border border-gray-300 hover:bg-gray-100 text-gray-900",
      "group-[.info]:border-blue-100 group-[.info]:hover:bg-blue-100",
      "group-[.success]:border-green-100 group-[.success]:hover:bg-green-100",
      "group-[.warning]:border-yellow-100 group-[.warning]:hover:bg-yellow-100",
      "group-[.destructive]:border-red-100 group-[.destructive]:hover:bg-red-100",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const SuccessIcon = () => (
  <div className="relative h-6 w-6">
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <circle
        className="fill-none stroke-green-500"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transformOrigin: "center",
          transform: "rotate(-90deg)",
          animation: "circle-draw 0.6s ease-in-out forwards",
        }}
      />
      <path
        className="fill-none stroke-green-500"
        d="M7 13l3 3 7-7"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{
          animation: "check-draw 0.3s ease-in-out 0.6s forwards",
        }}
      />
    </svg>
  </div>
);

const ToastIcon = ({ variant }: { variant: ToastProps["variant"] }) => {
  const iconProps = { className: "h-5 w-5" };

  switch (variant) {
    case "info":
      return <Info {...iconProps} className="text-blue-500" />;
    case "success":
      return <SuccessIcon />;
    case "warning":
    case "destructive":
      return (
        <AlertCircle
          {...iconProps}
          className={variant === "warning" ? "text-yellow-500" : "text-red-500"}
        />
      );
    default:
      return null;
  }
};

const EnhancedToast = React.forwardRef<
  React.ElementRef<typeof Toast>,
  ToastProps
>(({ variant, children, className, ...props }, ref) => (
  <Toast
    variant={variant}
    className={cn(
      "grid grid-cols-[auto_1fr_auto] items-start gap-4",
      className
    )}
    ref={ref}
    {...props}
  >
    <ToastIcon variant={variant} />
    {children}
  </Toast>
));
EnhancedToast.displayName = "EnhancedToast";

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  EnhancedToast as Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
