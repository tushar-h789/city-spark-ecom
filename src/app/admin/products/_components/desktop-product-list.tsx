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
import { Package2, Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchProducts, FetchProductsParams } from "@/services/admin-products";
import ProductsLoading from "./products-loading";
import ProductTableRow from "./product-table-row";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { deleteProducts } from "../actions";
import { useQueryClient } from "@tanstack/react-query";

interface DesktopProductListProps {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
}

export default function DesktopProductList({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
}: DesktopProductListProps) {
  const searchParams = useSearchParams();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentParams: FetchProductsParams = {
    page: searchParams.get("page") || "1",
    page_size: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "updatedAt",
    sort_order:
      (searchParams.get("sort_order") as FetchProductsParams["sort_order"]) ||
      "desc",
    filter_status: searchParams.get("filter_status") || "",
    ...(primaryCategoryId && { primary_category_id: primaryCategoryId }),
    ...(secondaryCategoryId && { secondary_category_id: secondaryCategoryId }),
    ...(tertiaryCategoryId && { tertiary_category_id: tertiaryCategoryId }),
    ...(quaternaryCategoryId && {
      quaternary_category_id: quaternaryCategoryId,
    }),
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products", currentParams],
    queryFn: () => fetchProducts(currentParams),
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedProducts(new Set(data.products.map((product) => product.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleBulkDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProducts(Array.from(selectedProducts));

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Products deleted successfully",
          variant: "success",
        });
        setSelectedProducts(new Set());

        await queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        throw new Error(result.message || "Failed to delete products");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleStatusChange = (status: string) => {
    // Implement bulk status change functionality
    console.log(
      "Changing status to:",
      status,
      "for products:",
      Array.from(selectedProducts)
    );
  };

  if (isLoading || isFetching) {
    return <ProductsLoading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  if (!data || !data.products.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 hidden lg:block">
        <Card className="shadow-sm border-gray-200 overflow-hidden">
          <CardContent className="p-0 relative">
            {/* Floating Selection Header */}
            <div
              className={cn(
                "absolute inset-x-0 top-0 z-20 bg-primary/5 border-b transform transition-transform bg-white",
                selectedProducts.size > 0
                  ? "translate-y-0"
                  : "-translate-y-full"
              )}
            >
              <div className="flex items-center justify-between px-6 py-2">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={
                      data &&
                      data.products.length > 0 &&
                      selectedProducts.size === data.products.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    {selectedProducts.size} selected
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
                    onClick={handleBulkDelete}
                    className="h-8"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProducts(new Set())}
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
                          data.products.length > 0 &&
                          selectedProducts.size === data.products.length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-24 py-5">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead className="w-[40%] min-w-[300px]">
                      Product Details
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[120px]">
                      Status
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[140px]">
                      Price
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[140px]">
                      Last Updated
                    </TableHead>
                    <TableHead className="w-14 pr-6"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.products.map((product) => (
                    <ProductTableRow
                      key={product.id}
                      product={product}
                      isSelected={selectedProducts.has(product.id)}
                      onSelect={(checked) =>
                        handleSelectProduct(product.id, checked)
                      }
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100/80 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Delete Selected Products
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-2 pb-4">
              You are about to delete{" "}
              <span className="font-semibold text-red-600">
                {selectedProducts.size}
              </span>{" "}
              selected products. This action cannot be undone and all associated
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
              onClick={handleConfirmDelete}
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
