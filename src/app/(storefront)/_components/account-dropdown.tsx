"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef, useTransition } from "react";
import {
  LogIn,
  UserCircle,
  Heart,
  Package,
  MapPin,
  LogOut,
  LucideIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

type MenuItemProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
};

const MenuItem = ({
  icon: Icon,
  label,
  href,
  onClick,
  loading,
}: MenuItemProps) => {
  const content = (
    <>
      {loading ? (
        <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icon className="inline-block mr-2 h-4 w-4" />
      )}
      {label}
    </>
  );

  const className = cn(
    "block w-full text-left px-4 py-2 text-sm",
    "text-foreground hover:bg-accent/60 transition-colors rounded-md",
    "hover:text-accent-foreground focus:outline-none focus:bg-accent/60",
    loading && "opacity-70 cursor-not-allowed hover:bg-transparent"
  );

  const handleClick = async () => {
    if (onClick && !loading) {
      await onClick();
    }
  };

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <button onClick={handleClick} className={className} disabled={loading}>
      {content}
    </button>
  );
};

export default function AccountDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpen = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleClose = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Loading state
  if (status === "loading") {
    return (
      <div className="h-[48px] flex items-center gap-2 px-3 min-w-[125px]">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-14" />
      </div>
    );
  }

  // Not signed in state
  if (!session) {
    return (
      <Link
        href="/login"
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-white rounded-md transition-colors duration-200",
          "hover:bg-white/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 min-w-[125px]"
        )}
      >
        <LogIn className="h-5 w-5" />
        Sign In
      </Link>
    );
  }

  const menuItems = [
    { icon: UserCircle, label: "Profile", href: "/profile" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Package, label: "Orders", href: "/orders" },
    { icon: MapPin, label: "Notifications", href: "/notifications" },
  ];

  const initials = `${session.user?.firstName?.[0] || ""}${
    session.user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-white rounded-md transition-colors duration-200",
          "hover:bg-white/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 min-w-[125px]"
        )}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar className="h-8 w-8 border border-white/20 shrink-0">
          <AvatarImage
            src={session.user?.image || undefined}
            alt={session.user?.firstName || ""}
            className="object-cover"
          />
          <AvatarFallback className="bg-white/10 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span>Account</span>
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-1/2 transform translate-x-1/2 mt-2 w-64",
            "bg-card text-card-foreground rounded-md shadow-lg",
            "border border-border py-1 z-50 animate-fadeIn"
          )}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          <div className="px-4 py-3">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 border border-border mr-3 shrink-0">
                <AvatarImage
                  src={session.user?.image || undefined}
                  alt={session.user?.firstName || ""}
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-base font-medium truncate">
                  {`${session.user.firstName} ${session.user.lastName}`}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="py-1 px-2">
            {menuItems.map((item) => (
              <MenuItem key={item.label} {...item} />
            ))}
          </div>

          <Separator />

          <div className="px-2 py-1">
            <MenuItem
              icon={LogOut}
              label="Log out"
              onClick={handleSignOut}
              loading={isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
