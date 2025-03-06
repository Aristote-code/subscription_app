"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Drawer as VaulDrawer } from "vaul";
import { cn } from "@/lib/utils";

// Import only what we need from vaul-drawer
import { DrawerPortal } from "@/components/ui/vaul-drawer";

// Create our own drawer using Vaul's components
const Drawer = VaulDrawer.Root;

const DrawerTrigger = VaulDrawer.Trigger;
const DrawerClose = VaulDrawer.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Overlay>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-background/80", className)}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

const drawerVariants = cva(
  "fixed z-50 flex flex-col border bg-background text-foreground",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b rounded-b-[10px]",
        bottom: "inset-x-0 bottom-0 border-t rounded-t-[10px]",
        left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof VaulDrawer.Content>,
    VariantProps<typeof drawerVariants> {}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Content>,
  DrawerContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <VaulDrawer.Content
      ref={ref}
      className={cn(drawerVariants({ side }), className)}
      {...props}
    >
      {children}
    </VaulDrawer.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

// Simple heading component for Drawer
const DrawerTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
);
DrawerTitle.displayName = "DrawerTitle";

// Simple paragraph component for Drawer
const DrawerDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
