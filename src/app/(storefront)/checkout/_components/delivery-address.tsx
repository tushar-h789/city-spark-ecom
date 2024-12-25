"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, PencilIcon, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
}

// Mock API response - replace with real API integration
const mockAddressLookup = async (postcode: string): Promise<Address[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return [
    {
      line1: "123 High Street",
      line2: "Flat A",
      city: "London",
      county: "Greater London",
      postcode: postcode.toUpperCase(),
    },
    {
      line1: "456 High Street",
      city: "London",
      county: "Greater London",
      postcode: postcode.toUpperCase(),
    },
  ];
};

export default function DeliveryAddress() {
  // Mock existing address - replace with actual data from props or context
  const defaultAddress: Address = {
    line1: "123 High Street",
    line2: "Flat A",
    city: "London",
    county: "Greater London",
    postcode: "SW1A 1AA",
  };

  const [postcode, setPostcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePostcodeLookup = async () => {
    if (!postcode.trim()) return;

    setIsLoading(true);
    try {
      const addresses = await mockAddressLookup(postcode);
      setAddresses(addresses);
      setSelectedAddress(null);
    } catch (error) {
      console.error("Failed to look up postcode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (index: string) => {
    const selected = addresses[parseInt(index)];
    setSelectedAddress(selected);
  };

  const formatAddress = (address: Address) => {
    return [
      address.line1,
      address.line2,
      address.city,
      address.county,
      address.postcode,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="space-y-4">
      {/* Simple distinction with a light gray background */}
      <div className="flex justify-between items-start bg-gray-50 rounded-lg border p-4">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">Delivery Address</h3>
          <p className="text-gray-600 text-sm">
            {formatAddress(defaultAddress)}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Delivery Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {!manualEntry && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter Postcode"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={handlePostcodeLookup}
                      disabled={isLoading || !postcode.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                      <span className="ml-2">Find</span>
                    </Button>
                  </div>

                  {addresses.length > 0 && (
                    <Select onValueChange={handleAddressSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your address" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((address, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {formatAddress(address)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <Button
                    variant="link"
                    className="px-0"
                    onClick={() => setManualEntry(true)}
                  >
                    Enter address manually
                  </Button>
                </div>
              )}

              {(manualEntry || selectedAddress) && (
                <div className="space-y-4">
                  <Input
                    placeholder="Address Line 1"
                    defaultValue={selectedAddress?.line1}
                  />
                  <Input
                    placeholder="Address Line 2 (Optional)"
                    defaultValue={selectedAddress?.line2}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="City"
                      defaultValue={selectedAddress?.city}
                    />
                    <Input
                      placeholder="County (Optional)"
                      defaultValue={selectedAddress?.county}
                    />
                  </div>
                  <Input
                    placeholder="Postcode"
                    defaultValue={selectedAddress?.postcode || postcode}
                  />
                  {manualEntry && (
                    <Button
                      variant="link"
                      className="px-0"
                      onClick={() => setManualEntry(false)}
                    >
                      Use postcode lookup instead
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
