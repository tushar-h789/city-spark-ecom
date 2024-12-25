"use client";

import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import AccountDropdown from "./account-dropdown";
import SearchInput from "./search-input";
import { cn } from "@/lib/utils";
import CitySparkLogo from "./city-spark-logo";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import MobileMenu from "./mobile-menu";
import FilterDrawer from "./filter-drawer";
import BasketPopup from "./basket-popup";

const BasketDrawer = () => {
  return (
    <div className="h-full flex flex-col">
      <DrawerHeader className="border-b pb-4">
        <DrawerTitle className="font-bold text-lg">Your Basket</DrawerTitle>
      </DrawerHeader>
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Add basket items here */}
          <div className="text-center text-muted-foreground py-8">
            Your basket is empty
          </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Button className="w-full">Checkout</Button>
      </div>
    </div>
  );
};

const MobileHeader = () => {
  const cartItemCount = 0;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full lg:hidden">
      <div
        className={cn(
          "fixed top-0 left-0 right-0 bg-white z-50 transition-shadow duration-200",
          isScrolled && "shadow-md"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <MobileMenu />

            <Link href="/" className="flex items-center">
              <CitySparkLogo />
              <span className="sr-only">City Spark</span>
            </Link>

            <Drawer>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground hover:text-primary relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center",
                        cartItemCount > 9 ? "w-5 h-5 text-[10px]" : "w-4 h-4"
                      )}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <BasketDrawer />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      <div className="pt-16 bg-white mt-1">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              placeholder="Search for products"
              className="w-full pl-12 pr-12 h-12 rounded-full border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <FilterDrawer />
          </div>
        </div>
      </div>
    </header>
  );
};

function DesktopHeader() {
  return (
    <header className="w-full bg-primary py-2 hidden lg:block">
      <div className="container h-16 flex items-center justify-between mx-auto max-w-screen-xl">
        <Link
          href="/"
          className="flex items-center transition-colors duration-200 group"
        >
          <CitySparkLogo />
          <span className="sr-only">City Spark</span>
        </Link>

        <SearchInput />

        <div className="flex items-center space-x-5 text-white">
          <AccountDropdown />
          <Separator orientation="vertical" className="h-6 w-px bg-white" />
          <BasketPopup />
        </div>
      </div>
    </header>
  );
}

export default function Header() {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
}
