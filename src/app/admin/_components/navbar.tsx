"use client";
import { SheetMenu } from "./sheet-menu";
import Link from "next/link";
import { Globe } from "lucide-react";

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center space-x-4 justify-end">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors duration-200 flex items-center gap-2 group"
          >
            <Globe size={16} className="group-hover:animate-spin-slow" />
            View Site
          </Link>
        </div>
      </div>
    </header>
  );
}
