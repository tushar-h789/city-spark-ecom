"use client";

import { useState } from "react";
import Link from "next/link";
import { PanelsTopLeft, LogOut, AlertCircle, Check, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "./menu";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { SidebarToggle } from "./sidebar-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function UserInfoSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);
  const { data: session, status } = useSession();

  if (!sidebar) return null;

  const handleSignOut = () => {
    // Implement your sign-out logic here
    console.log("User signed out");
    setShowSignOutAlert(false);
  };

  const isLoading = status === "loading";

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="flex flex-col h-full shadow-md dark:shadow-zinc-800">
        <div className="px-3 py-4">
          <Button
            className={cn(
              "transition-transform ease-in-out duration-300 mb-1",
              sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
            )}
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <h1
                className={cn(
                  "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                  sidebar?.isOpen === false
                    ? "-translate-x-96 opacity-0 hidden"
                    : "translate-x-0 opacity-100"
                )}
              >
                Brand
              </h1>
            </Link>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu isOpen={sidebar?.isOpen} />
        </div>

        <div className="mt-auto relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between py-3 px-3">
            {sidebar?.isOpen && (
              <div
                className={cn(
                  !sidebar.isOpen ? "hidden" : "block",
                  "flex-1 mr-2"
                )}
              >
                {isLoading ? (
                  <UserInfoSkeleton />
                ) : (
                  <>
                    <p className="font-medium truncate">{`${session?.user?.firstName} ${session?.user?.lastName}`}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </>
                )}
              </div>
            )}
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setShowSignOutAlert(true)}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 flex-shrink-0"
                  >
                    <LogOut size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign Out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <AlertDialog open={showSignOutAlert} onOpenChange={setShowSignOutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
              Confirm Sign Out
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You&apos;ll need to sign in
              again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex items-center">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="flex items-center bg-red-500 hover:bg-red-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
