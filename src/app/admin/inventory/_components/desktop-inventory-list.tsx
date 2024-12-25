"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package2 } from "lucide-react";
import InventoryTableRow from "./inventory-table-row";
import { ReusablePagination } from "@/components/custom/pagination";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchInventories } from "@/services/admin-inventory";
import InventoryLoading from "./inventory-loading";

interface FetchInventoriesParams {
  page: string;
  page_size: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
}

export default function DesktopInventoryList() {
  const searchParams = useSearchParams();

  const currentParams: FetchInventoriesParams = {
    page: searchParams.get("page") || "1",
    page_size: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "createdAt",
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || "desc",
    filter_status: searchParams.get("filter_status") || "",
  };

  const { data, isLoading, isError, isFetching, isFetchedAfterMount } =
    useQuery({
      queryKey: ["inventories", currentParams],
      queryFn: () => fetchInventories(currentParams),
    });

  if (isLoading || (isFetching && !isFetchedAfterMount)) {
    return <InventoryLoading />;
  }

  if (isError) {
    return (
      <Card className="p-8 shadow-none border-gray-350 text-center">
        <Package2 className="mx-auto mb-4 h-16 w-16 text-red-400" />
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          Error Loading Inventory
        </h2>
        <p className="text-gray-600 mb-6">
          There was an error loading the inventory items. Please try again
          later.
        </p>
      </Card>
    );
  }

  if (!data || !data.inventories.length) {
    return (
      <Card className="p-8 shadow-none border-gray-350 text-center">
        <Package2 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-semibold mb-4">
          No inventory items found
        </h2>
        <p className="text-gray-600 mb-6">
          There are currently no items in the inventory.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)]">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="w-24">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[40%]">Product Details</TableHead>
                  <TableHead>Stock Count</TableHead>
                  <TableHead>Sold Count</TableHead>
                  <TableHead>Held Count</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.inventories.map((inventory) => (
                  <InventoryTableRow key={inventory.id} inventory={inventory} />
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
