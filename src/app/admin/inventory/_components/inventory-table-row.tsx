"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import PlaceholderImage from "@/images/placeholder-image.png";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTransition, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { updateInventoryStock } from "../actions";
import { BLUR_DATA_URL } from "@/lib/constants";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

interface InventoryTableRowProps {
  inventory: InventoryWithRelations;
}

export default function InventoryTableRow({
  inventory,
}: InventoryTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(inventory.stockCount);
  const debouncedQuantity = useDebounce(quantity, 500); // 500ms delay

  useEffect(() => {
    if (debouncedQuantity !== inventory.stockCount) {
      handleStockUpdate(debouncedQuantity);
    }
  }, [debouncedQuantity]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStockUpdate = async (newValue: number) => {
    startTransition(async () => {
      try {
        await updateInventoryStock(inventory.id, newValue);
        await queryClient.invalidateQueries({ queryKey: ["inventories"] });

        toast({
          title: "Stock Updated",
          description: "The inventory stock has been updated successfully.",
          variant: "success",
        });
      } catch (error) {
        setQuantity(inventory.stockCount); // Reset on error
        toast({
          title: "Error",
          description: "Failed to update the stock. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  const handleQuantityChange = (value: string) => {
    const newValue = parseInt(value, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setQuantity(newValue);
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(0, prev - 1));
  };

  return (
    <TableRow className="group">
      <TableCell className="w-[0%] relative">
        <Link
          href={`/admin/products/${inventory.product.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={inventory.product.images[0] || PlaceholderImage}
            alt={inventory.product.name}
            fill
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </TableCell>
      <TableCell className="min-w-[300px] relative">
        <Link
          href={`/admin/products/${inventory.product.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 line-clamp-1">
            {inventory.product.name}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            Product ID: {inventory.product.id}
          </span>
        </div>
      </TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecrement}
            disabled={isPending || quantity <= 0}
          >
            <MinusIcon className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className={cn(
              "w-20 text-center [appearance:textfield]",
              "[&::-webkit-outer-spin-button]:appearance-none",
              "[&::-webkit-inner-spin-button]:appearance-none"
            )}
            disabled={isPending}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleIncrement}
            disabled={isPending}
          >
            <PlusIcon className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-center">{inventory.soldCount || 0}</TableCell>
      <TableCell className="text-center">{inventory.heldCount || 0}</TableCell>
      <TableCell className="text-sm text-gray-500">
        {formatDistance(new Date(inventory.createdAt), new Date(), {
          addSuffix: true,
        })}
      </TableCell>
    </TableRow>
  );
}
