"use client";

import React, { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/loading-button";
import { Category } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CategoryFormInputType, categorySchema } from "../schema";
import { createCategory, updateCategory } from "../actions";
import { FileState } from "@/components/custom/single-image-uploader";
import CategoryFormHeader from "./category-form-header";
import CategoryDetails from "./category-details-section";
import ParentCategories from "./parent-categories";
import CategoryImageUpload from "./category-image-upload";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryForm({
  categoryDetails,
}: {
  categoryDetails?: Category | null;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormInputType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      image: "",
      parentPrimaryCategory: "",
      type: "PRIMARY",
      parentSecondaryCategory: "",
      parentTertiaryCategory: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  // Initialize form with category data when editing
  useEffect(() => {
    if (categoryDetails) {
      reset({
        name: categoryDetails.name,
        type: categoryDetails.type,
        image: categoryDetails.image || "",
        parentPrimaryCategory: categoryDetails.parentPrimaryCategoryId || "",
        parentSecondaryCategory:
          categoryDetails.parentSecondaryCategoryId || "",
        parentTertiaryCategory: categoryDetails.parentTertiaryCategoryId || "",
      });

      if (categoryDetails?.image) {
        setFileState({
          file: categoryDetails.image,
          progress: "COMPLETE",
          key: "",
        });
      }
    }
  }, [categoryDetails, reset]);

  const onSubmit = (data: CategoryFormInputType) => {
    startTransition(async () => {
      try {
        let result;
        if (categoryDetails) {
          result = await updateCategory(categoryDetails.id, data);
        } else {
          result = await createCategory(data);
        }

        if (result.success) {
          await queryClient.invalidateQueries();

          toast({
            title: categoryDetails ? "Category Updated" : "Category Created",
            description: categoryDetails
              ? "The category has been successfully updated."
              : "The category has been successfully created.",
            variant: "success",
          });

          router.push("/admin/categories");
        } else {
          toast({
            title: "Error",
            description:
              result.message ||
              `Failed to ${categoryDetails ? "update" : "create"} category.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(
          `Error ${categoryDetails ? "updating" : "creating"} category:`,
          error
        );
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CategoryFormHeader
          isPending={isPending}
          categoryDetails={categoryDetails}
          fileState={fileState}
        />

        <div className="container pt-8 pb-4 px-4 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <CategoryDetails />
              <ParentCategories />
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <CategoryImageUpload
                fileState={fileState}
                setFileState={setFileState}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end md:hidden">
            <Button type="button" variant="outline" className="mr-4">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              disabled={
                !isDirty ||
                isPending ||
                typeof fileState?.progress === "number" ||
                fileState?.progress === "PENDING"
              }
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              {categoryDetails ? "Update Category" : "Save Category"}
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
