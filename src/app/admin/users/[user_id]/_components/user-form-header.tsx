"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { ChevronLeft, X, Check, Mail, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    orders: true;
    addresses: true;
  };
}>;

interface UserFormHeaderProps {
  userDetails?: UserWithRelations | null;
  isPending: boolean;
}

const UserFormHeader: React.FC<UserFormHeaderProps> = ({
  userDetails,
  isPending,
}) => {
  const {
    formState: { isDirty },
  } = useFormContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fullName = userDetails
    ? `${userDetails.firstName} ${userDetails.lastName}`.trim()
    : "New User";

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-[10] w-full",
          isScrolled ? "bg-white shadow-md" : "bg-zinc-50"
        )}
      >
        <div
          className={cn(
            "px-8 py-3 transition-all duration-200",
            "container pb-4 px-4 sm:px-8"
          )}
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/users">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to users</span>
              </Button>
            </Link>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold tracking-tight truncate">
                {userDetails ? `Edit ${fullName}` : "Add New User"}
              </h1>

              <div className="flex items-center space-x-4 mt-2">
                {userDetails?.email && (
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-1.5" />
                    {userDetails.email}
                  </span>
                )}
                <Badge variant="outline" className="ml-2">
                  {userDetails?.role || "USER"}
                </Badge>
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link href="/admin/users">
                <Button type="button" variant="outline" className="h-9">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <LoadingButton
                type="submit"
                className="h-9"
                disabled={!isDirty || isPending}
                loading={isPending}
              >
                {!isPending && <Check className="mr-2 h-4 w-4" />}
                {userDetails ? "Update User" : "Save User"}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>

      {isDirty && (
        <div className="mt-4 container px-4 sm:px-8">
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3">
              <div className="text-sm text-amber-600 flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
                You have unsaved changes. Don&apos;t forget to save your work.
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserFormHeader;
