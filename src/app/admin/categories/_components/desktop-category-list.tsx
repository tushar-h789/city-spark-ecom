"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReusablePagination } from "@/components/custom/pagination";
import { Package2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { CategoryType } from "@prisma/client";
import CategoriesTableRow from "./category-table-row";
import {
  fetchCategories,
  FetchCategoriesParams,
} from "@/services/admin-categories";
import CategoriesLoading from "./categories-loading";

export default function DesktopCategoryList() {
  const searchParams = useSearchParams();

  const currentParams: FetchCategoriesParams = {
    page: searchParams.get("page") || "1",
    page_size: "10",
    search: searchParams.get("search") || "",
    sort_by:
      (searchParams.get("sort_by") as "name" | "createdAt") || "createdAt",
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || "desc",
    filter_type: (searchParams.get("filter_type") as CategoryType) || undefined,
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["categories", currentParams],
    queryFn: () => fetchCategories(currentParams),
  });

  if (isLoading || isFetching) {
    return <CategoriesLoading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        Error loading categories. Please try again later.
      </div>
    );
  }

  if (!data?.data?.categories?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No categories found</p>
      </div>
    );
  }

  const { categories, pagination } = data.data;

  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto h-[calc(100vh-325px)] relative">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-14 pl-6">
                    <Checkbox />
                  </TableHead>
                  <TableHead className="w-24 py-5">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead className="w-[30%] min-w-[200px]">Name</TableHead>
                  <TableHead className="w-[35%] min-w-[250px]">
                    Category Path
                  </TableHead>
                  <TableHead className="w-[20%] min-w-[150px]">
                    Last Updated
                  </TableHead>
                  <TableHead className="w-14 pr-6 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <CategoriesTableRow key={category.id} category={category} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReusablePagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
        itemsPerPage={pagination.pageSize}
      />
    </div>
  );
}
