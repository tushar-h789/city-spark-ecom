"use client";
import { HelpCircle, MapPin, Phone, Truck } from "lucide-react";
import React from "react";

function DesktopTopbar() {
  return (
    <div className="bg-black text-white/90 py-1.5 px-4 text-sm hidden lg:block">
      <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
        <div className="flex items-center space-x-6">
          <div className="flex items-center hover:text-secondary transition-colors">
            <Phone size={16} className="mr-1.5" />
            <span>Sales & Support</span>
          </div>
          <div className="flex items-center hover:text-secondary transition-colors">
            <HelpCircle size={16} className="mr-1.5" />
            <span>FAQs</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center hover:text-secondary transition-colors">
            <Truck size={16} className="mr-1.5" />
            <span>Track Your Order</span>
          </div>
          <div className="flex items-center hover:text-secondary transition-colors">
            <MapPin size={16} className="mr-1.5" />
            <span>Store Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopBar() {
  return <DesktopTopbar />;
}
