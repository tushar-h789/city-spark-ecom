"use client";

import React from "react";
import { format } from "date-fns";
import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderWithRelations } from "@/services/admin-orders";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  status: string;
}

interface OrderTimelineProps {
  order: OrderWithRelations;
}

function generateTimelineEvents(order: OrderWithRelations): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Order Created
  events.push({
    id: "created",
    title: "Order Created",
    description: `Order #${order.id} was created`,
    timestamp: order.createdAt,
    status: "Order Placed",
  });

  // Payment Event
  if (order.paymentStatus === "PAID" && order.paymentDate) {
    events.push({
      id: "payment",
      title: "Payment Confirmed",
      description: `Payment of £${order.cart.totalPriceWithVat?.toFixed(
        2
      )} was received`,
      timestamp: order.paymentDate,
      status: "Payment Received",
    });
  }

  // Shipping Event
  if (order.shippingDate) {
    events.push({
      id: "shipping",
      title: "Order Shipped",
      description: order.trackingNumber
        ? `Order shipped with tracking number: ${order.trackingNumber}`
        : "Order has been shipped",
      timestamp: order.shippingDate,
      status: "Shipped",
    });
  }

  // Delivery Event
  if (order.deliveryDate) {
    events.push({
      id: "delivery",
      title: "Order Delivered",
      description: "Order has been delivered successfully",
      timestamp: order.deliveryDate,
      status: "Delivered",
    });
  }

  // Refund Event
  if (order.refundDate && order.refundStatus === "APPROVED") {
    events.push({
      id: "refund",
      title: "Refund Processed",
      description: order.refundReason
        ? `Refund processed: ${order.refundReason}`
        : "Refund has been processed",
      timestamp: order.refundDate,
      status: "Refunded",
    });
  }

  // Sort events by timestamp
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export default function OrderTimeline({ order }: OrderTimelineProps) {
  const timelineEvents = generateTimelineEvents(order);

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Package className="h-7 w-7" />
          Order Timeline
        </CardTitle>
        <CardDescription>Track the order&apos;s journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Continuous vertical line */}
          <div
            className="absolute left-[5.5px] top-1 bottom-1 w-px bg-gray-200"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative">
                {/* Dot with outline */}
                <div
                  className="absolute -left-6 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-primary ring-[3px] ring-primary/20"
                  aria-hidden="true"
                />

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {event.title}
                    </h4>
                    <div
                      className="h-px flex-1 bg-gray-100"
                      aria-hidden="true"
                    />
                    <time className="flex-shrink-0 text-sm text-gray-500">
                      {format(event.timestamp, "MMM d, yyyy")}
                    </time>
                  </div>
                  <div className="mt-1.5">
                    <time className="text-sm text-gray-500">
                      {format(event.timestamp, "h:mm a")}
                    </time>
                    <p className="mt-1 text-sm text-gray-600 leading-normal">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
