"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Archive, Download, Ban } from "lucide-react";
import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  PaymentStatus,
  RefundStatus,
  ShippingStatus,
  Status,
} from "@prisma/client";
import { OrderListItem } from "@/services/admin-orders";

interface OrderTableRowProps {
  order: OrderListItem;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
}

const statusStyles = {
  DRAFT: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  ACTIVE: "bg-green-100 text-green-800 hover:bg-green-200",
  ARCHIVED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const paymentStatusStyles = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  UNPAID: "bg-red-100 text-red-800",
  REFUND: "bg-purple-100 text-purple-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export default function OrderTableRow({
  order,
  isSelected = false,
  onSelect,
}: OrderTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        // Add invoice download logic here
        toast({
          title: "Download Started",
          description: "Your invoice download will begin shortly.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to download invoice",
          variant: "destructive",
        });
      }
    });
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        // Add archive logic here
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast({
          title: "Order Archived",
          description: "The order has been archived successfully.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to archive order",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      try {
        // Add cancellation logic here
        await queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast({
          title: "Order Cancelled",
          description: "The order has been cancelled successfully.",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to cancel order",
          variant: "destructive",
        });
      }
    });
  };

  const customerName =
    `${order.user.firstName || ""} ${order.user.lastName || ""}`.trim() ||
    "N/A";

  return (
    <TableRow className={cn("group", isSelected && "bg-primary/5")}>
      <TableCell
        className="pl-6 relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect?.(checked as boolean)}
        />
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/orders/${order.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{order.id}</span>
          <span className="text-sm text-gray-500">
            {formatDistance(new Date(order.createdAt), new Date(), {
              addSuffix: true,
            })}
          </span>
        </div>
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/orders/${order.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{customerName}</span>
          <span className="text-sm text-gray-500">{order.user.email}</span>
        </div>
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/orders/${order.id}`}
          className="absolute inset-0 z-10"
        />
        <Badge
          variant="secondary"
          className={cn("font-medium", statusStyles[order.status])}
        >
          {order.status}
        </Badge>
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/orders/${order.id}`}
          className="absolute inset-0 z-10"
        />
        <Badge
          variant="secondary"
          className={cn(
            "font-medium",
            paymentStatusStyles[order.paymentStatus]
          )}
        >
          {order.paymentStatus}
        </Badge>
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/orders/${order.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium">
            £{(order.totalPrice || 0).toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">inc. VAT</span>
        </div>
      </TableCell>

      <TableCell
        className="pr-6 relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDownloadInvoice}
              disabled={isPending}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive} disabled={isPending}>
              <Archive className="mr-2 h-4 w-4" />
              Archive Order
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCancel}
              disabled={isPending || order.status === "DRAFT"}
              className="text-red-600"
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
