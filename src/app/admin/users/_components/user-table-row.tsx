"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import React, { useTransition } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PlaceholderImage from "@/images/placeholder-image.png";
import { deleteUser } from "../actions";

export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    addresses: true;
  };
}>;

export default function UserTableRow({ user }: { user: UserWithRelations }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Stop the propagation to prevent routing

    startTransition(async () => {
      const result = await deleteUser(user.id);

      if (result.success) {
        toast({
          title: "User Deleted",
          description: "The user has been successfully deleted.",
          variant: "success",
        });
      } else {
        // Handle error (e.g., show an error message)
        toast({
          title: "Error Deleting User",
          description:
            "There was an error deleting the user. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <TableRow
      key={user.id}
      onClick={() => router.push(`/admin/users/${user.id}`)}
      className={`cursor-pointer ${isPending ? "opacity-30" : "opacity-100"}`}
    >
      <TableCell className="hidden sm:table-cell">
        {user.avatar ? (
          <Image
            alt="User Image"
            className="aspect-square rounded-md object-cover border border-input"
            height="64"
            src={user.avatar}
            width="64"
          />
        ) : (
          <Image
            alt="User Image"
            className="aspect-square rounded-md object-cover border border-input"
            height="64"
            src={PlaceholderImage}
            loading="lazy"
            width="64"
          />
        )}
      </TableCell>
      <TableCell className="font-medium flex-1">{user.firstName}</TableCell>
      <TableCell className="font-medium flex-1">{user.lastName}</TableCell>

      <TableCell className="hidden md:table-cell">
        {user.email || "N/A"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {user.phone || "N/A"}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {dayjs(user.createdAt).format("DD-MM-YY hh:mm A")}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/users/${user.id}`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                handleDelete(e);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
