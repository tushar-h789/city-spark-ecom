import React from "react";
import { Spinner } from "@/components/ui/spinner";
import CitySparkLogo from "../(storefront)/_components/city-spark-logo";

export default function Loading() {
  return (
    <div
      key="loading-splash"
      className="min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <div className="relative animate-in fade-in duration-700">
        <div className="absolute -inset-4 bg-secondary/5 rounded-full blur-xl animate-pulse" />
        <CitySparkLogo />
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 animate-in slide-in-from-bottom fade-in duration-700">
        <Spinner className="text-secondary w-6 h-6" />
        <span className="text-sm text-secondary/60 tracking-wide">
          Loading your experience...
        </span>
      </div>
    </div>
  );
}
