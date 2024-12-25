"use client";

import { useState, useEffect, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Utils and Types
import { cn } from "@/lib/utils";
import { ProductFormInputType } from "../schema";
import {
  fetchTemplateDetails,
  fetchTemplates,
  TemplatesResponse,
} from "@/services/admin-templates";
import { useDebounce } from "@/hooks/use-debounce";
import { CommandLoading } from "cmdk";
import { ProductWithDetails } from "@/services/admin-products";

interface TemplatesSectionProps {
  productDetails?: ProductWithDetails;
}

export default function TemplatesSection({
  productDetails,
}: TemplatesSectionProps) {
  const [openTemplates, setOpenTemplates] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { control, setValue, reset, getValues } =
    useFormContext<ProductFormInputType>();
  const templateId = useWatch({ control, name: "templateId" });

  // Templates infinite query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
  } = useInfiniteQuery<TemplatesResponse>({
    queryKey: ["templates", debouncedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchTemplates({
        sort_by: "name",
        sort_order: "asc",
        filter_status: "ACTIVE",
        page: String(pageParam),
        page_size: "10",
        search: debouncedSearch,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
  });

  // Template details query
  const { data: templateDetails, isLoading: isTemplateDetailsLoading } =
    useQuery({
      queryKey: ["templateDetails", templateId],
      queryFn: () => {
        if (!templateId) {
          throw new Error("Template ID is required");
        }
        return fetchTemplateDetails(templateId);
      },
      enabled: !!templateId,
    });

  // Memoize the flattened templates array
  const templates = useMemo(() => {
    return data?.pages.flatMap((page) => page.templates) ?? [];
  }, [data?.pages]);

  // Effect to update form fields when template details change
  useEffect(() => {
    if (templateDetails) {
      if (
        productDetails &&
        productDetails.productTemplate?.templateId === templateId
      ) {
        reset({
          ...getValues(),
          productTemplateFields: productDetails.productTemplate?.fields.map(
            (field) => ({
              id: field.id,
              fieldId: field.templateFieldId,
              fieldName: field.templateField.fieldName,
              fieldOptions: field.templateField.fieldOptions ?? "",
              fieldType: field.templateField.fieldType ?? "TEXT",
              fieldValue: field.fieldValue ?? "",
            })
          ),
        });
      } else {
        reset({
          ...getValues(),
          productTemplateFields: templateDetails.fields.map((field) => ({
            id: field.id,
            fieldId: field.id,
            fieldName: field.fieldName,
            fieldOptions: field.fieldOptions ?? "",
            fieldType: field.fieldType,
            fieldValue: "",
          })),
        });
      }
    }
  }, [getValues, templateDetails, productDetails, templateId]);

  // Load more pages until we find the selected template
  useEffect(() => {
    const findSelectedTemplate = async () => {
      if (!templateId || !openTemplates) return;
      if (templates.some((template) => template.id === templateId)) return;

      if (hasNextPage) {
        await fetchNextPage();
      }
    };

    findSelectedTemplate();
  }, [templateId, templates, hasNextPage, fetchNextPage, openTemplates]);

  const { fields: templateFields } = useFieldArray({
    control,
    name: "productTemplateFields",
  });

  // Selected template from the flattened list
  const selectedTemplate = useMemo(() => {
    if (!templateId) return null;
    return templates.find((template) => template.id === templateId);
  }, [templateId, templates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Templates</CardTitle>
        <CardDescription>
          Please provide the physical specifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-6">
          <div className="col-span-4 grid gap-3">
            <FormField
              control={control}
              name="templateId"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col gap-1">
                  <FormLabel>Templates</FormLabel>
                  <FormControl>
                    <Popover
                      open={openTemplates}
                      onOpenChange={setOpenTemplates}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            "Loading..."
                          ) : selectedTemplate ? (
                            <div className="flex items-center justify-between w-full">
                              <span>{selectedTemplate.name}</span>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(null);

                                    setValue("productTemplateFields", [], {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });

                                    setValue("templateId", "", {
                                      shouldDirty: true,
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">
                                    Clear template selection
                                  </span>
                                </Button>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-muted-foreground">
                                Select a template
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 popover-content-width-same-as-its-trigger">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Search templates..."
                            value={search}
                            onValueChange={setSearch}
                          />
                          <CommandList>
                            <CommandEmpty>No template found.</CommandEmpty>
                            {isPending ? (
                              <CommandLoading>
                                Loading templates...
                              </CommandLoading>
                            ) : (
                              <CommandGroup>
                                {templates?.map((template) => (
                                  <CommandItem
                                    key={template.id}
                                    value={template.name}
                                    onSelect={() => {
                                      field.onChange(template.id);
                                      setOpenTemplates(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === template.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {template.name}
                                  </CommandItem>
                                ))}
                                {hasNextPage && (
                                  <Button
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                  >
                                    {isFetchingNextPage ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      "Load more"
                                    )}
                                  </Button>
                                )}
                              </CommandGroup>
                            )}
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
        </div>
      </CardContent>

      {/* Template Fields Section */}
      <CardHeader>
        <CardTitle className="text-xl">Template Fields</CardTitle>
        <CardDescription>
          {templateFields.length > 0
            ? "Please provide the physical specifications."
            : "No related field found"}
        </CardDescription>
      </CardHeader>

      {isTemplateDetailsLoading && (
        <CardContent>
          <Spinner />
        </CardContent>
      )}

      {templateFields.length > 0 && (
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-9">
            {templateFields.map((templateField, index) => (
              <div className="col-span-3 grid gap-3" key={templateField.id}>
                <FormField
                  control={control}
                  name={`productTemplateFields.${index}.fieldValue`}
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col gap-1">
                      <FormLabel>{templateField.fieldName}</FormLabel>
                      <FormControl>
                        {templateField.fieldType === "TEXT" ? (
                          <Input
                            placeholder={`Enter ${templateField.fieldName}`}
                            {...field}
                          />
                        ) : (
                          <Select
                            onValueChange={(currentValue) => {
                              if (currentValue) {
                                field.onChange(currentValue);
                              }
                            }}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Enter ${templateField.fieldName}`}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {templateField.fieldOptions
                                ?.split(",")
                                .map((option) => (
                                  <SelectItem
                                    value={option.trim()}
                                    key={option}
                                  >
                                    {option.trim()}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
