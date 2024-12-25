"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/services/admin-categories";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CategoryFormInputType } from "../schema";

export default function ParentCategories() {
  const [openPrimary, setOpenPrimary] = useState<boolean>(false);
  const [openSecondary, setOpenSecondary] = useState<boolean>(false);
  const [openTertiary, setOpenTertiary] = useState<boolean>(false);

  const form = useFormContext<CategoryFormInputType>();
  const { control, setValue, watch } = form;

  const categoryType = watch("type");
  const selectedPrimaryId = watch("parentPrimaryCategory");
  const selectedSecondaryId = watch("parentSecondaryCategory");

  const { data: primaryData, isLoading: isPrimaryLoading } = useQuery({
    queryKey: ["categories", "PRIMARY"],
    queryFn: () =>
      fetchCategories({
        page: "1",
        page_size: "100",
        filter_type: "PRIMARY",
        sort_by: "name",
        sort_order: "asc",
      }),
    enabled: ["SECONDARY", "TERTIARY", "QUATERNARY"].includes(categoryType),
  });

  const { data: secondaryData, isLoading: isSecondaryLoading } = useQuery({
    queryKey: ["categories", "SECONDARY", selectedPrimaryId],
    queryFn: () =>
      fetchCategories({
        page: "1",
        page_size: "100",
        filter_type: "SECONDARY",
        primary_category_id: selectedPrimaryId,
        sort_by: "name",
        sort_order: "asc",
      }),
    enabled:
      !!selectedPrimaryId && ["TERTIARY", "QUATERNARY"].includes(categoryType),
  });

  const { data: tertiaryData, isLoading: isTertiaryLoading } = useQuery({
    queryKey: ["categories", "TERTIARY", selectedSecondaryId],
    queryFn: () =>
      fetchCategories({
        page: "1",
        page_size: "100",
        filter_type: "TERTIARY",
        secondary_category_id: selectedSecondaryId,
        sort_by: "name",
        sort_order: "asc",
      }),
    enabled: !!selectedSecondaryId && categoryType === "QUATERNARY",
  });

  const primaryCategories = primaryData?.data?.categories || [];
  const secondaryCategories = secondaryData?.data?.categories || [];
  const tertiaryCategories = tertiaryData?.data.categories || [];

  if (categoryType === "PRIMARY") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent Categories</CardTitle>
        <CardDescription>
          Specify the parent categories if applicable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {["SECONDARY", "TERTIARY", "QUATERNARY"].includes(categoryType) && (
            <FormField
              control={control}
              name="parentPrimaryCategory"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Parent Primary Category</FormLabel>
                  <FormControl>
                    <Popover open={openPrimary} onOpenChange={setOpenPrimary}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPrimary}
                          className="justify-between"
                          disabled={isPrimaryLoading}
                        >
                          {field.value ? (
                            primaryCategories.find(
                              (category) => category.id === field.value
                            )?.name
                          ) : (
                            <p className="text-muted-foreground">
                              Select a primary category
                            </p>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {primaryCategories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    field.onChange(category.id);
                                    setOpenPrimary(false);
                                    setValue("parentSecondaryCategory", "");
                                    setValue("parentTertiaryCategory", "");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {["TERTIARY", "QUATERNARY"].includes(categoryType) && (
            <FormField
              control={control}
              name="parentSecondaryCategory"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Parent Secondary Category</FormLabel>
                  <FormControl>
                    <Popover
                      open={openSecondary}
                      onOpenChange={setOpenSecondary}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSecondary}
                          className="justify-between"
                          disabled={isSecondaryLoading || !selectedPrimaryId}
                        >
                          {field.value ? (
                            secondaryCategories.find(
                              (category) => category.id === field.value
                            )?.name
                          ) : (
                            <p className="text-muted-foreground">
                              Select a secondary category
                            </p>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {secondaryCategories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    field.onChange(category.id);
                                    setOpenSecondary(false);
                                    setValue("parentTertiaryCategory", "");
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {categoryType === "QUATERNARY" && (
            <FormField
              control={control}
              name="parentTertiaryCategory"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel>Parent Tertiary Category</FormLabel>
                  <FormControl>
                    <Popover open={openTertiary} onOpenChange={setOpenTertiary}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openTertiary}
                          className="justify-between"
                          disabled={isTertiaryLoading || !selectedSecondaryId}
                        >
                          {field.value ? (
                            tertiaryCategories.find(
                              (category) => category.id === field.value
                            )?.name
                          ) : (
                            <p className="text-muted-foreground">
                              Select a tertiary category
                            </p>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search categories..." />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {tertiaryCategories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.name}
                                  onSelect={() => {
                                    field.onChange(category.id);
                                    setOpenTertiary(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
