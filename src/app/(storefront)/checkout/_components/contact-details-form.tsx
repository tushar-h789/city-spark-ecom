"use client";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface ContactDetailsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContactDetailsForm({
  onNext,
  onBack,
}: ContactDetailsFormProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: session?.user?.firstName || "",
    lastName: session?.user?.lastName || "",
    email: session?.user?.email || "",
    phone: session?.user.lastName || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add validation if needed
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-1">
          <CardTitle className="text-2xl">Contact Details</CardTitle>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Please enter your contact information below
        </p>
      </CardHeader>

      <Separator className="mb-6" />

      <CardContent>
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                className="border-gray-300"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                className="border-gray-300"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              className="border-gray-300"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              className="border-gray-300"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </CardContent>

      <div className="px-6 py-4 bg-gray-50/50 border-t flex justify-end items-center">
        <Button type="submit" className="min-w-[100px]">
          Continue
        </Button>
      </div>
    </form>
  );
}
