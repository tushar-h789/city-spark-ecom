"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { cn } from "@/lib/utils";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "@/components/ui/checkbox";
import { statusMap } from "@/app/data";
import PlaceholderImage from "@/images/placeholder-image.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Archive,
  Copy,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { deleteProducts, duplicateProduct } from "../actions";
import { useQueryClient } from "@tanstack/react-query";
import { BLUR_DATA_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    primaryCategory: true;
    secondaryCategory: true;
    tertiaryCategory: true;
    quaternaryCategory: true;
    images: true;
    tradePrice: true;
    promotionalPrice: true;
    status: true;
    updatedAt: true;
  };
}>;

interface ProductTableRowProps {
  product: ProductWithRelations;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  showActions?: boolean;
}

export default function ProductTableRow({
  product,
  isSelected = false,
  onSelect,
  showActions = true,
}: ProductTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const result = await deleteProducts([product.id]);

      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: ["products"],
        });
        await queryClient.invalidateQueries({
          queryKey: ["product", product.id],
        });

        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
          variant: "success",
        });
      } else {
        toast({
          title: "Error Deleting Product",
          description:
            result.message ||
            "There was an error deleting the product. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDuplicate = async () => {
    startTransition(async () => {
      try {
        const result = await duplicateProduct(product.id);

        if (result?.success) {
          toast({
            title: "Success",
            description: "Product duplicated successfully",
            variant: "success",
          });

          await queryClient.invalidateQueries({
            queryKey: ["products"],
          });

          router.push(`/admin/products/${result.data?.id}`);
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to duplicate product",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
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
          href={`/admin/products/${product.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={product.images[0] || PlaceholderImage}
            alt={product.name}
            fill
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="min-w-[300px] relative">
        <Link
          href={`/admin/products/${product.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 line-clamp-1">
            {product.name}
          </span>
          <span className="text-sm text-gray-500 mt-1 line-clamp-1">
            {[
              product.primaryCategory?.name,
              product.secondaryCategory?.name,
              product.tertiaryCategory?.name,
              product.quaternaryCategory?.name,
            ]
              .filter(Boolean)
              .join(" > ")}
          </span>
        </div>
      </TableCell>
      <TableCell className="relative">
        <Link
          href={`/admin/products/${product.id}`}
          className="absolute inset-0 z-10"
        />
        <div
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full",
            statusMap[product.status || "DRAFT"].background
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full mr-2",
              statusMap[product.status || "DRAFT"].indicator
            )}
          />
          <span className="text-sm font-medium">
            {statusMap[product.status || "DRAFT"].label}
          </span>
        </div>
      </TableCell>
      <TableCell className="relative">
        <Link
          href={`/admin/products/${product.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-base">
            <NumericFormat
              value={product.tradePrice}
              displayType="text"
              prefix="£"
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator
            />
          </span>
          {product.promotionalPrice && (
            <span className="text-sm text-emerald-600 font-medium mt-0.5">
              <NumericFormat
                value={product.promotionalPrice}
                displayType="text"
                prefix="£"
                decimalScale={2}
                fixedDecimalScale
                thousandSeparator
              />{" "}
              promo
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-500 relative">
        <Link
          href={`/admin/products/${product.id}`}
          className="absolute inset-0 z-10"
        />
        {formatDistance(new Date(product.updatedAt), new Date(), {
          addSuffix: true,
        })}
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
                <Link href={`/admin/products/${product.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/products/${product.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Product
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} disabled={isPending}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Product
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
