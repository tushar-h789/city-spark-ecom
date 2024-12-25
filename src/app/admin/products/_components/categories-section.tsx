"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProductFormInputType } from "../schema";

interface Category {
  id: string;
  name: string;
}

interface CategorySectionProps {
  primaryCategories: Category[] | undefined;
  secondaryCategories: Category[] | undefined;
  tertiaryCategories: Category[] | undefined;
  quaternaryCategories: Category[] | undefined;
  onPrimaryCategoryChange: (id: string | undefined) => void;
  onSecondaryCategoryChange: (id: string | undefined) => void;
  onTertiaryCategoryChange: (id: string | undefined) => void;
  isPrimaryLoading: boolean;
  isSecondaryLoading: boolean;
  isTertiaryLoading: boolean;
  isQuaternaryLoading: boolean;
  primaryCategoryId: string | undefined;
  secondaryCategoryId: string | undefined;
  tertiaryCategoryId: string | undefined;
}

export default function CategoriesSection({
  primaryCategories = [],
  secondaryCategories = [],
  tertiaryCategories = [],
  quaternaryCategories = [],
  onPrimaryCategoryChange,
  onSecondaryCategoryChange,
  onTertiaryCategoryChange,
  isPrimaryLoading,
  isSecondaryLoading,
  isTertiaryLoading,
  isQuaternaryLoading,
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
}: CategorySectionProps) {
  const { control, setValue } = useFormContext<ProductFormInputType>();
  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSecondary, setOpenSecondary] = useState(false);
  const [openTertiary, setOpenTertiary] = useState(false);
  const [openQuaternary, setOpenQuaternary] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Primary Category */}
          <FormField
            control={control}
            name="primaryCategoryId"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <FormLabel>Primary</FormLabel>
                <FormControl>
                  <Popover open={openPrimary} onOpenChange={setOpenPrimary}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={isPrimaryLoading}
                        aria-expanded={openPrimary}
                        className="justify-between"
                      >
                        {field.value ? (
                          primaryCategories?.find(
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
                        <CommandInput placeholder="Search primary categories..." />
                        <CommandList>
                          <CommandEmpty>
                            No primary category found.
                          </CommandEmpty>
                          <CommandGroup>
                            {primaryCategories?.map((primaryCategory) => (
                              <CommandItem
                                key={primaryCategory.id}
                                value={primaryCategory.name}
                                onSelect={() => {
                                  field.onChange(primaryCategory.id);
                                  setValue("secondaryCategoryId", "");
                                  setValue("tertiaryCategoryId", "");
                                  setValue("quaternaryCategoryId", "");
                                  setOpenPrimary(false);
                                  onPrimaryCategoryChange(primaryCategory.id);
                                  onSecondaryCategoryChange(undefined);
                                  onTertiaryCategoryChange(undefined);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === primaryCategory.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {primaryCategory.name}
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

          {/* Secondary Category */}
          <FormField
            control={control}
            name="secondaryCategoryId"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <FormLabel>Secondary</FormLabel>
                <FormControl>
                  <Popover open={openSecondary} onOpenChange={setOpenSecondary}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSecondary}
                        className="justify-between"
                        disabled={!primaryCategoryId || isSecondaryLoading}
                      >
                        {field.value ? (
                          secondaryCategories?.find(
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
                        <CommandInput placeholder="Search secondary categories..." />
                        <CommandList>
                          <CommandEmpty>
                            No secondary category found.
                          </CommandEmpty>
                          <CommandGroup>
                            {secondaryCategories?.map((secondaryCategory) => (
                              <CommandItem
                                key={secondaryCategory.id}
                                value={secondaryCategory.name}
                                onSelect={() => {
                                  field.onChange(secondaryCategory.id);
                                  setValue("tertiaryCategoryId", "");
                                  setValue("quaternaryCategoryId", "");
                                  setOpenSecondary(false);
                                  onSecondaryCategoryChange(
                                    secondaryCategory.id
                                  );
                                  onTertiaryCategoryChange(undefined);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === secondaryCategory.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {secondaryCategory.name}
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

          {/* Tertiary Category */}
          <FormField
            control={control}
            name="tertiaryCategoryId"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <FormLabel>Tertiary</FormLabel>
                <FormControl>
                  <Popover open={openTertiary} onOpenChange={setOpenTertiary}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTertiary}
                        className="justify-between"
                        disabled={!secondaryCategoryId || isTertiaryLoading}
                      >
                        {field.value ? (
                          tertiaryCategories?.find(
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
                        <CommandInput placeholder="Search tertiary categories..." />
                        <CommandList>
                          <CommandEmpty>
                            No tertiary category found.
                          </CommandEmpty>
                          <CommandGroup>
                            {tertiaryCategories?.map((tertiaryCategory) => (
                              <CommandItem
                                key={tertiaryCategory.id}
                                value={tertiaryCategory.name}
                                onSelect={() => {
                                  field.onChange(tertiaryCategory.id);
                                  setValue("quaternaryCategoryId", "");
                                  setOpenTertiary(false);
                                  onTertiaryCategoryChange(tertiaryCategory.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === tertiaryCategory.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {tertiaryCategory.name}
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

          {/* Quaternary Category */}
          <FormField
            control={control}
            name="quaternaryCategoryId"
            render={({ field }) => (
              <FormItem className="grid gap-1">
                <FormLabel>Quaternary</FormLabel>
                <FormControl>
                  <Popover
                    open={openQuaternary}
                    onOpenChange={setOpenQuaternary}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openQuaternary}
                        className="justify-between"
                        disabled={!tertiaryCategoryId || isQuaternaryLoading}
                      >
                        {field.value ? (
                          quaternaryCategories?.find(
                            (category) => category.id === field.value
                          )?.name
                        ) : (
                          <p className="text-muted-foreground">
                            Select a quaternary category
                          </p>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search quaternary categories..." />
                        <CommandList>
                          <CommandEmpty>
                            No quaternary category found.
                          </CommandEmpty>
                          <CommandGroup>
                            {quaternaryCategories?.map((quaternaryCategory) => (
                              <CommandItem
                                key={quaternaryCategory.id}
                                value={quaternaryCategory.name}
                                onSelect={() => {
                                  field.onChange(quaternaryCategory.id);
                                  setOpenQuaternary(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === quaternaryCategory.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {quaternaryCategory.name}
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
        </div>
      </CardContent>
    </Card>
  );
}
