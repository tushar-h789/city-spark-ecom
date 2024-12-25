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
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Package2, Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BrandsTableRow from "./brand-table-row";
import { fetchBrands, type FetchBrandsParams } from "@/services/admin-brands";
import { Status } from "@prisma/client";
import BrandsLoading from "./brands-loading";

export default function DesktopBrandList() {
  const searchParams = useSearchParams();
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const currentParams: FetchBrandsParams = {
    page: searchParams.get("page") || "1",
    page_size: "10",
    search: searchParams.get("search") || undefined,
    sort_by: searchParams.get("sort_by") || "createdAt",
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || "desc",
    filter_status: (searchParams.get("filter_status") as Status) || undefined,
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["brands", currentParams],
    queryFn: () => fetchBrands(currentParams),
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedBrands(new Set(data.data.map((brand) => brand.id)));
    } else {
      setSelectedBrands(new Set());
    }
  };

  const handleSelectBrand = (brandId: string, checked: boolean) => {
    const newSelected = new Set(selectedBrands);
    if (checked) {
      newSelected.add(brandId);
    } else {
      newSelected.delete(brandId);
    }
    setSelectedBrands(newSelected);
  };

  const handleStatusChange = (status: string) => {
    // Implement bulk status change functionality
    console.log(
      "Changing status to:",
      status,
      "for brands:",
      Array.from(selectedBrands)
    );
  };

  if (isLoading || isFetching) {
    return <BrandsLoading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading brands. Please try again later.
      </div>
    );
  }

  if (!data || !data.data.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No brands found</p>
      </div>
    );
  }

  return (
    <>
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Floating Selection Header */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 z-20 bg-primary/5 border-b transform transition-transform bg-white",
              selectedBrands.size > 0 ? "translate-y-0" : "-translate-y-full"
            )}
          >
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={
                    data &&
                    data.data.length > 0 &&
                    selectedBrands.size === data.data.length
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {selectedBrands.size} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-8 w-[140px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-8"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBrands(new Set())}
                  className="h-8"
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
                        data.data.length > 0 &&
                        selectedBrands.size === data.data.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-24 py-5">
                    <span className="sr-only">Logo</span>
                  </TableHead>
                  <TableHead className="w-[40%] min-w-[300px]">
                    Brand Details
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[100px]">
                    Products
                  </TableHead>
                  <TableHead className="w-[15%] min-w-[140px]">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-14 pr-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((brand) => (
                  <BrandsTableRow
                    key={brand.id}
                    brand={brand}
                    isSelected={selectedBrands.has(brand.id)}
                    onSelect={(checked) => handleSelectBrand(brand.id, checked)}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100/80 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Delete Selected Brands
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2 pb-4">
              You are about to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedBrands.size}
              </span>{" "}
              selected brands. This action cannot be undone and all associated
              data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center gap-3 sm:justify-center">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-lg mt-0 sm:mt-0 w-32"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 rounded-lg w-32"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 mr-2 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
