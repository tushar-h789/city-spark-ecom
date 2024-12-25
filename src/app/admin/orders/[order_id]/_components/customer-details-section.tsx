"use client";

import { MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { OrderWithRelations } from "@/services/admin-orders";

interface CustomerDetailsCardProps {
  order: OrderWithRelations;
}

export default function CustomerDetailsSection({
  order,
}: CustomerDetailsCardProps) {
  const user = order.user;
  const customerName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "N/A";

  // Find shipping and billing addresses
  const shippingAddress = user?.addresses.find(
    (addr) => addr.isDefaultShipping
  );
  const billingAddress = user?.addresses.find((addr) => addr.isDefaultBilling);

  const formatAddress = (address: typeof shippingAddress) => {
    if (!address) return null;
    return [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.county,
      address.postcode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <User className="w-7 h-7" />
          Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium">{customerName}</h4>
          {user?.email && <p className="text-sm text-gray-500">{user.email}</p>}
          {user?.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
        </div>

        <Separator />

        {shippingAddress && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Shipping Address</span>
            </div>
            <p className="text-sm text-gray-600">
              {formatAddress(shippingAddress)}
            </p>
          </div>
        )}

        {billingAddress && billingAddress.id !== shippingAddress?.id && (
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Billing Address</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatAddress(billingAddress)}
              </p>
            </div>
          </>
        )}

        {!shippingAddress && order.shippingAddress && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Shipping Address</span>
            </div>
            <p className="text-sm text-gray-600">{order.shippingAddress}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
