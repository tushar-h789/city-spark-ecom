"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { PaymentStatus, Status } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { OrderWithRelations } from "@/services/admin-orders";

interface PaymentDetailsCardProps {
  order: OrderWithRelations;
}

const paymentStatuses: Record<PaymentStatus, { label: string; color: string }> =
  {
    PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    PAID: { label: "Paid", color: "bg-green-100 text-green-800" },
    UNPAID: { label: "Unpaid", color: "bg-red-100 text-red-800" },
    CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
    REFUND: { label: "Refunded", color: "bg-blue-100 text-blue-800" },
  };

const orderStatuses: Record<Status, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-gray-100 text-gray-800" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-800" },
  ARCHIVED: { label: "Archived", color: "bg-red-100 text-red-800" },
};

async function updateOrderStatus(orderId: string, status: Status) {
  const response = await fetch(`/api/admin/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update order status");
  }

  return response.json();
}

async function updatePaymentStatus(orderId: string, status: PaymentStatus) {
  const response = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update payment status");
  }

  return response.json();
}

export default function PaymentDetailsCard({ order }: PaymentDetailsCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderStatus, setOrderStatus] = useState<Status>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    order.paymentStatus
  );

  const { mutate: mutateOrderStatus } = useMutation({
    mutationFn: (status: Status) => updateOrderStatus(order.id, status),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Order status updated successfully",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update order status",
        variant: "destructive",
      });
      setOrderStatus(order.status); // Reset to original value on error
    },
  });

  const { mutate: mutatePaymentStatus } = useMutation({
    mutationFn: (status: PaymentStatus) =>
      updatePaymentStatus(order.id, status),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment status updated successfully",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["order", order.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update payment status",
        variant: "destructive",
      });
      setPaymentStatus(order.paymentStatus); // Reset to original value on error
    },
  });

  const formatPaymentMethod = (method: string) => {
    return method
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleOrderStatusChange = (newStatus: Status) => {
    setOrderStatus(newStatus);
    mutateOrderStatus(newStatus);
  };

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    setPaymentStatus(newStatus);
    mutatePaymentStatus(newStatus);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CreditCard className="w-7 h-7" />
          Payment Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Payment Method</span>
          <span className="font-medium">
            {formatPaymentMethod(order.paymentMethod || "Not Specified")}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-600">Payment Status</span>
          <div className="flex items-center gap-2">
            <Select
              value={paymentStatus}
              onValueChange={handlePaymentStatusChange}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(paymentStatuses).map(([status, { label }]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-600">Order Status</span>
          <div className="flex items-center gap-2">
            <Select value={orderStatus} onValueChange={handleOrderStatusChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(orderStatuses).map(([status, { label }]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
