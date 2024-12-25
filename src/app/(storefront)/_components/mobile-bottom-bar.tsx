"use client";

import React from "react";
import Link from "next/link";
import { Home, Store, ShoppingCart, UserCircle2, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type MobileBottomBarProps = {
  isShowInProductPage?: boolean;
};

const MobileBottomBar = ({
  isShowInProductPage = false,
}: MobileBottomBarProps) => {
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Store },
    { name: "Basket", href: "/basket", icon: ShoppingCart },
    { name: "Account", href: "/account", icon: UserCircle2 },
    { name: "Search", href: "/products?search=''", icon: Search },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") {
      return false;
    }
    return pathname.startsWith(path);
  };

  const shouldHideBottomBar = () => {
    const excludedPaths = ["/login", "/register"];
    const productPaths = ["/products", "/products/c/", "/products/p/"];

    if (excludedPaths.some((path) => pathname === path)) {
      return true;
    }

    if (isShowInProductPage) {
      return excludedPaths.some((path) => pathname === path);
    }

    if (productPaths.some((path) => pathname.startsWith(path))) {
      return true;
    }

    return false;
  };

  if (shouldHideBottomBar()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="h-16 bg-white border-t border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <nav className="h-full">
          <ul className="h-full flex items-center justify-around px-4">
            {navigation.map((item) => (
              <li key={item.name} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1",
                    "transition-colors duration-200",
                    isActive(item.href)
                      ? "text-secondary"
                      : "text-gray-500 hover:text-secondary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
};

export default MobileBottomBar;
