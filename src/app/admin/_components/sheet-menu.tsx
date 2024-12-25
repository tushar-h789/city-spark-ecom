"use client";

import Link from "next/link";
import { MenuIcon, PanelsTopLeft, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "./menu";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="w-6 h-6 mr-1" />
              <h1 className="font-bold text-lg">Brand</h1>
            </Link>
          </Button>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <Menu isOpen />
        </div>
        <div className="py-4 mt-auto">
          <Button
            onClick={() => {
              // Add sign-out logic here
              console.log("Sign out clicked");
            }}
            variant="outline"
            className="w-full justify-start h-10"
          >
            <LogOut size={18} className="mr-4" />
            <span>Sign out</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
