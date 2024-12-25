"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  Download,
  Filter,
  Loader2,
  Package2,
  Plus,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { exportProductsToExcel, exportProductsToJSON } from "../actions";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

type BackupFormat = "JSON" | "EXCEL";

interface ExportResultJSON {
  success: boolean;
  data?: string;
  error?: string;
}

interface ExportResultExcel {
  success: boolean;
  message?: string;
  data?: string;
  error?: string;
}

type ExportResult = ExportResultJSON | ExportResultExcel;

export default function ProductTableHeader() {
  const router = useRouter();
  const { createQueryString } = useQueryString();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const initialSearchValue = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sort_by") ?? "";
  const sortOrder = searchParams.get("sort_order") ?? "";
  const filterStatus = searchParams.get("filter_status") ?? "";
  const { toast } = useToast();

  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const debouncedSearchValue = useDebounce(searchValue, 300);

  useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        search: debouncedSearchValue,
      })}`
    );
  }, [debouncedSearchValue, pathname, router, createQueryString]);

  const handleDownload = async (backupFormat: BackupFormat) => {
    startTransition(async () => {
      let result: ExportResult | undefined;

      try {
        if (backupFormat === "JSON") {
          result = await exportProductsToJSON();
        } else if (backupFormat === "EXCEL") {
          result = await exportProductsToExcel();
        } else {
          throw new Error("Invalid format selected");
        }

        if (!result) {
          throw new Error("Export function did not return a result");
        }

        if (result.success && result.data) {
          let blob: Blob;
          let filename: string;
          const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");

          if (backupFormat === "JSON") {
            blob = new Blob([result.data], { type: "application/json" });
            filename = `Products_Backup_${timestamp}.json`;
          } else {
            const byteArray = new Uint8Array(
              atob(result.data)
                .split("")
                .map((char) => char.charCodeAt(0))
            );
            blob = new Blob([byteArray], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            filename = `Products_Backup_${timestamp}.xlsx`;
          }

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);

          toast({
            title: `Products ${backupFormat} Downloaded`,
            description:
              (result as ExportResultExcel).message || "Download successful",
            variant: "success",
          });
        } else {
          throw new Error(result.error || "Download failed");
        }
      } catch (error) {
        console.error("Download failed:", error);
        toast({
          title: `Products ${backupFormat} download failed`,
          description:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-5 mt-7">
        <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 flex items-center">
          <Package2 className="mr-3 text-primary" />
          Product List
        </h1>

        <div className="hidden items-center gap-2 md:ml-auto md:flex">
          <Select
            disabled={isPending}
            onValueChange={(value: BackupFormat) => {
              if (value) {
                handleDownload(value);
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              <SelectValue placeholder="Download Backup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="JSON">Download JSON</SelectItem>
              <SelectItem value="EXCEL">Download Excel</SelectItem>
            </SelectContent>
          </Select>

          <Link href="/admin/products/new">
            <Button className="h-9 w-full flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2 w-full lg:w-auto mb-5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10 w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="hidden lg:flex items-center space-x-2">
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              if (value) {
                router.push(
                  `${pathname}?${createQueryString({
                    filter_status: value !== "ALL" ? value : "",
                  })}`
                );
              }
            }}
          >
            <SelectTrigger className="w-[160px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">ALL</SelectItem>
              {["ACTIVE", "ARCHIVED", "DRAFT"].map((option) => (
                <SelectItem value={option} key={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value) {
                router.push(
                  `${pathname}?${createQueryString({
                    sort_by: value,
                  })}`
                );
              }
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="tradePrice">Trade Price</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="primaryCategory">Primary Category</SelectItem>
              <SelectItem value="createdAt">Creation Time</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(value) => {
              if (value) {
                router.push(
                  `${pathname}?${createQueryString({
                    sort_order: value,
                  })}`
                );
              }
            }}
          >
            <SelectTrigger className="w-[160px]">
              {sortOrder === "asc" ? (
                <SortAsc className="mr-2 h-4 w-4" />
              ) : (
                <SortDesc className="mr-2 h-4 w-4" />
              )}
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
