"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
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
import { MoreHorizontal, Edit, Trash2, Eye, Archive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { deleteTemplates } from "../actions";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { statusMap } from "@/app/data";

type TemplateWithRelations = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
    _count: {
      select: {
        fields: true;
      };
    };
  };
}> & {
  productCount: number;
};

interface TemplateTableRowProps {
  template: TemplateWithRelations;
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  showActions?: boolean;
}

export default function TemplateTableRow({
  template,
  isSelected = false,
  onSelect,
  showActions = true,
}: TemplateTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      try {
        const result = await deleteTemplates([template.id]);

        if (result?.success) {
          await queryClient.invalidateQueries({ queryKey: ["templates"] });
          await queryClient.invalidateQueries({
            queryKey: ["template", template.id],
          });

          toast({
            title: "Template Deleted",
            description: "The template has been successfully deleted.",
            variant: "success",
          });
        } else {
          throw new Error(result?.message || "Failed to delete template");
        }
      } catch (error) {
        toast({
          title: "Error Deleting Template",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
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
      <TableCell className="min-w-[200px] relative">
        <Link
          href={`/admin/templates/${template.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 line-clamp-1">
            {template.name}
          </span>
          <span className="text-sm text-gray-500 mt-1">
            {template.description || "No description"}
          </span>
        </div>
      </TableCell>
      <TableCell className="relative">
        <Link
          href={`/admin/templates/${template.id}`}
          className="absolute inset-0 z-10"
        />
        <div
          className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full",
            statusMap[template.status || "DRAFT"].background
          )}
        >
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full mr-2",
              statusMap[template.status || "DRAFT"].indicator
            )}
          />
          <span className="text-sm font-medium">
            {statusMap[template.status || "DRAFT"].label}
          </span>
        </div>
      </TableCell>
      <TableCell className="relative">
        <Link
          href={`/admin/templates/${template.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium">{template._count.fields}</span>
          <span className="text-sm text-gray-500">Fields</span>
        </div>
      </TableCell>
      <TableCell className="relative">
        <Link
          href={`/admin/templates/${template.id}`}
          className="absolute inset-0 z-10"
        />
        <div className="flex flex-col">
          <span className="font-medium">{template.productCount}</span>
          <span className="text-sm text-gray-500">Products</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-500 relative">
        <Link
          href={`/admin/templates/${template.id}`}
          className="absolute inset-0 z-10"
        />
        {formatDistance(new Date(template.updatedAt), new Date(), {
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
                <Link href={`/admin/templates/${template.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/templates/${template.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Template
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDelete}
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </TableRow>
  );
}
