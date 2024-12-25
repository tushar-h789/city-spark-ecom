"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReusablePagination } from "@/components/custom/pagination";
import { FileText, Loader2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import OrderTableRow from "./order-table-row";
import { fetchOrders } from "@/services/admin-orders";

interface FetchOrdersParams {
  page: string;
  page_size: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
}

export default function DesktopOrderList() {
  const searchParams = useSearchParams();
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentParams: FetchOrdersParams = {
    page: searchParams.get("page") || "1",
    page_size: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "createdAt",
    sort_order:
      (searchParams.get("sort_order") as FetchOrdersParams["sort_order"]) ||
      "desc",
    filter_status: searchParams.get("filter_status") || "",
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["orders", currentParams],
    queryFn: () => fetchOrders(currentParams),
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedOrders(new Set(data.orders.map((order) => order.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleStatusChange = async (status: string) => {
    setIsBulkUpdating(true);
    try {
      // Add your bulk update logic here
      await queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast({
        title: "Status Updated",
        description: `Successfully updated ${selectedOrders.size} orders to ${status}`,
        variant: "success",
      });
      setSelectedOrders(new Set());
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsBulkUpdating(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading orders. Please try again later.
      </div>
    );
  }

  if (!data || !data.orders.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <FileText className="h-12 w-12 mb-4" />
        <p>No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Floating Selection Header */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 z-20 bg-primary/5 border-b transform transition-transform bg-white",
              selectedOrders.size > 0 ? "translate-y-0" : "-translate-y-full"
            )}
          >
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={
                    data &&
                    data.orders.length > 0 &&
                    selectedOrders.size === data.orders.length
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedOrders.size} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={handleStatusChange}
                  disabled={isBulkUpdating}
                >
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrders(new Set())}
                  className="h-8"
                  disabled={isBulkUpdating}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-14 pl-6">
                    <Checkbox
                      checked={
                        data &&
                        data.orders.length > 0 &&
                        selectedOrders.size === data.orders.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[200px]">
                    Order Details
                  </TableHead>
                  <TableHead className="w-[25%] min-w-[200px]">
                    Customer
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Payment
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">Total</TableHead>
                  <TableHead className="w-14 pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.orders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    isSelected={selectedOrders.has(order.id)}
                    onSelect={(checked) => handleSelectOrder(order.id, checked)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReusablePagination
        currentPage={data.pagination.currentPage}
        totalPages={data.pagination.totalPages}
        totalCount={data.pagination.totalCount}
        itemsPerPage={data.pagination.pageSize}
      />
    </div>
  );
}
