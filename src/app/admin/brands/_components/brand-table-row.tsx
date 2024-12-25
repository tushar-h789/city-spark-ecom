"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { BrandWithProducts } from "@/services/admin-brands";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Archive,
  Copy,
} from "lucide-react";
import Link from "next/link";
import React, { useTransition } from "react";
import Image from "next/image";
import { deleteBrand } from "../actions";
import PlaceholderImage from "@/images/placeholder-image.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BLUR_DATA_URL } from "@/lib/constants";
import { statusMap } from "@/app/data";
import { formatDistance } from "date-fns";

interface BrandsTableRowProps {
  brand: BrandWithProducts;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  showActions?: boolean;
}

export default function BrandsTableRow({
  brand,
  isSelected = false,
  onSelect,
  showActions = true,
}: BrandsTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteBrand(brand.id);

      if (result?.success) {
        await queryClient.invalidateQueries({
          queryKey: ["brands"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["brand", brand.id],
        });

        toast({
          title: "Brand Deleted",
          description: "The brand has been successfully deleted.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to delete brand",
          variant: "destructive",
        });
      }
    });
  };

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

      <TableCell className="w-[0%] relative">
        <Link
          href={`/admin/brands/${brand.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={brand.image || PlaceholderImage}
            alt={brand.name}
            fill
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
        </div>
      </TableCell>

      <TableCell className="min-w-[300px] relative">
        <Link
          href={`/admin/brands/${brand.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{brand.name}</span>
          <span className="text-sm text-gray-500 mt-1">
            {brand.description || "No description"}
          </span>
        </div>
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/brands/${brand.id}`}
          className="absolute inset-0 z-10"
        />
        <div
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full",
            statusMap[brand.status || "DRAFT"].background
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full mr-2",
              statusMap[brand.status || "DRAFT"].indicator
            )}
          />
          <span className="text-sm font-medium">
            {statusMap[brand.status || "DRAFT"].label}
          </span>
        </div>
      </TableCell>

      <TableCell className="relative">
        <Link
          href={`/admin/brands/${brand.id}`}
          className="absolute inset-0 z-10"
        />
        <span className="text-base font-medium">{brand._count.products}</span>
      </TableCell>

      <TableCell className="text-sm text-gray-500 relative">
        <Link
          href={`/admin/brands/${brand.id}`}
          className="absolute inset-0 z-10"
        />
        {brand.updatedAt
          ? formatDistance(new Date(brand.updatedAt), new Date(), {
              addSuffix: true,
            })
          : "Never"}
      </TableCell>

      <TableCell
        className="pr-6 relative z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {showActions && (
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
                <Link href={`/admin/brands/${brand.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/brands/${brand.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Brand
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Brand
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Brand
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
