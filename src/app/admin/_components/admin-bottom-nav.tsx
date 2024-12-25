"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package2,
  Users,
  ShoppingCart,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package2,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

// Routes that will use a different action bottom bar
const actionBarRoutes = [
  // Creation routes
  "/admin/products/new",
  "/admin/brands/new",
  "/admin/templates/new",
  "/admin/categories/new",
  "/admin/orders/new",
  "/admin/users/new",

  // Detail/Edit routes check
  "/admin/products/",
  "/admin/brands/",
  "/admin/templates/",
  "/admin/categories/",
  "/admin/orders/",
  "/admin/users/",

  "/admin/products",
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  // Hide this bottom nav if we're on a route that needs the action bar
  if (actionBarRoutes.some((route) => pathname.startsWith(route))) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href + "/") || pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-1",
                "transition-colors duration-200 ease-in-out",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 mb-1",
                  isActive
                    ? "text-primary"
                    : "text-gray-500 group-hover:text-primary"
                )}
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
