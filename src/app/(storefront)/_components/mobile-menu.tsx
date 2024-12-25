"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  User,
  LogOut,
  Home,
  Package,
  Tag,
  Heart,
  Bell,
  MapPin,
  Store,
  BadgeHelp,
  Settings,
  ChevronRight,
  ShoppingBag,
  Menu,
} from "lucide-react";
import { Role } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Types based on your Prisma schema
type Address = {
  id: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  county?: string | null;
  postcode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

type User = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  email: string;
  phone: string | null;
  role: Role;
  addresses: Address[];
};

// Dummy user data
const dummyUser: User = {
  id: "user_1",
  firstName: "John",
  lastName: "Smith",
  avatar: null,
  email: "john.smith@example.com",
  phone: "+44 7700 900123",
  role: Role.USER,
  addresses: [
    {
      id: "addr_1",
      addressLine1: "123 High Street",
      addressLine2: "Flat 4B",
      city: "Manchester",
      county: "Greater Manchester",
      postcode: "M1 1AA",
      country: "United Kingdom",
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  ],
};

const MobileMenu = ({ user = dummyUser }: { user?: User | null }) => {
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const NavigationLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      onClick={handleLinkClick}
      className="flex items-center space-x-4 px-4 py-3 rounded-lg hover:bg-primary/5 text-sm font-medium"
    >
      {children}
    </Link>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:text-primary"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col min-h-[100dvh] py-6 px-2">
            {/* User Profile Section */}
            <div className="pb-6 px-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback className="bg-primary/10 text-lg">
                      {user.firstName?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold truncate">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email.split("@")[0]}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                      <AvatarFallback className="bg-primary/10">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-base font-semibold">Welcome</p>
                      <p className="text-sm text-muted-foreground">
                        Sign in to your account
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" asChild>
                    <Link
                      href="/login"
                      onClick={handleLinkClick}
                      className="font-medium"
                    >
                      Sign In
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <Separator className="bg-gray-100" />

            {/* Main Navigation */}
            <nav className="flex-1">
              {/* Primary Navigation */}
              <div className="py-4 space-y-1">
                <NavigationLink href="/">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </NavigationLink>
                <NavigationLink href="/products">
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </NavigationLink>
                <NavigationLink href="/brands">
                  <Tag className="h-5 w-5" />
                  <span>Brands</span>
                </NavigationLink>
                <NavigationLink href="/store-locator">
                  <Store className="h-5 w-5" />
                  <span>Store Locator</span>
                </NavigationLink>
              </div>

              {user && (
                <>
                  <Separator className="bg-gray-100" />

                  {/* Personal Section */}
                  <div className="py-4 space-y-1">
                    <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Personal
                    </h3>
                    <Link
                      href="/account"
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5"
                    >
                      <div className="flex items-center space-x-4">
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">Account</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/orders"
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5"
                    >
                      <div className="flex items-center space-x-4">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="text-sm font-medium">Orders</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5"
                    >
                      <div className="flex items-center space-x-4">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm font-medium">Wishlist</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    <Link
                      href="/notifications"
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5"
                    >
                      <div className="flex items-center space-x-4">
                        <Bell className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Notifications
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-medium">
                          2
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                    <Link
                      href="/addresses"
                      onClick={handleLinkClick}
                      className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-primary/5"
                    >
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm font-medium">Addresses</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-muted-foreground font-medium">
                          {user.addresses.length} saved
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  </div>
                </>
              )}

              <Separator className="bg-gray-100" />

              {/* Support Section */}
              <div className="py-4 space-y-1">
                <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Support
                </h3>
                <NavigationLink href="/help">
                  <BadgeHelp className="h-5 w-5" />
                  <span>Help Center</span>
                </NavigationLink>
                <NavigationLink href="/settings">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </NavigationLink>
              </div>
            </nav>

            {/* Sign Out Section */}
            {user && (
              <>
                <Separator className="bg-gray-100" />
                <div className="p-4">
                  <Button
                    variant="destructive"
                    className="w-full justify-start font-medium"
                    onClick={() => {
                      // Handle sign out logic here
                      setOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5 mr-4" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
