"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Trash, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Prisma } from "@prisma/client";
import { LoadingButton } from "@/components/ui/loading-button";
import { InventoryFormInputType, inventorySchema } from "../schema";
import { useToast } from "@/components/ui/use-toast";
import { updateInventoryItem } from "../actions";

export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: { product: true };
}>;

export default function InventoryForm({
  inventoryDetails,
}: {
  inventoryDetails: InventoryWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<InventoryFormInputType>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      stock: "0",
      deliveryAreas: [{ deliveryArea: "" }],
      collectionPoints: [{ collectionPoint: "" }],
      collectionAvailabilityTime: "",
      collectionEligibility: false,
      deliveryEligibility: false,
      maxCollectionCount: "",
      maxDeliveryCount: "",
      minCollectionCount: "",
      minDeliveryCount: "",
      maxDeliveryTime: "",
      maxDeliveryTimeExceedingStock: "",
      maxCollectionTimeExceedingStock: "",
      productId: "",
    },
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form;

  const {
    fields: deliveryAreas,
    append: appendDeliveryArea,
    remove: removeDeliveryArea,
  } = useFieldArray({
    control,
    name: "deliveryAreas",
  });

  const {
    fields: collectionPoints,
    append: appendCollectionPoint,
    remove: removeCollectionPoint,
  } = useFieldArray({
    control,
    name: "collectionPoints",
  });

  useEffect(() => {
    if (inventoryDetails) {
      reset({
        stock: inventoryDetails.stockCount.toString(),
        deliveryAreas:
          inventoryDetails.deliveryAreas?.map((area) => ({
            deliveryArea: area || "",
          })) || [],
        collectionPoints:
          inventoryDetails.collectionPoints?.map((point) => ({
            collectionPoint: point || "",
          })) || [],
        productId: inventoryDetails.product.id,
        deliveryEligibility: inventoryDetails.deliveryEligibility,
        collectionEligibility: inventoryDetails.collectionEligibility,
        maxDeliveryTime: inventoryDetails.maxDeliveryTime || "",
        maxDeliveryTimeExceedingStock:
          inventoryDetails.maxDeliveryTimeExceedingStock || "",
        collectionAvailabilityTime:
          inventoryDetails.collectionAvailabilityTime || "",
        maxCollectionTimeExceedingStock:
          inventoryDetails.maxCollectionTimeExceedingStock || "",
        minDeliveryCount: inventoryDetails.minDeliveryCount?.toString() || "",
        minCollectionCount:
          inventoryDetails.minCollectionCount?.toString() || "",
        maxDeliveryCount: inventoryDetails.maxDeliveryCount?.toString() || "",
        maxCollectionCount:
          inventoryDetails.maxCollectionCount?.toString() || "",
      });
    }
  }, [inventoryDetails, reset]);

  const onEditInventorySubmit: SubmitHandler<InventoryFormInputType> = async (
    data
  ) => {
    if (inventoryDetails?.id) {
      startTransition(async () => {
        const result = await updateInventoryItem(inventoryDetails.id, data);
        if (result.success) {
          toast({
            title: "Success",
            description: result.message,
            variant: "success",
          });
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onEditInventorySubmit)}>
        <div className="flex items-center gap-4 mb-8 mt-7">
          <Link href="/admin/inventory">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            Edit {inventoryDetails.product.name}
          </h1>
          <div className="hidden items-center gap-4 ml-auto md:flex">
            <Link href="/admin/inventory">
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
              Save Changes
            </LoadingButton>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Delivery Information
                  <FormField
                    control={control}
                    name="deliveryEligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="minDeliveryCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Minimum count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="maxDeliveryCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Maximum count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="maxDeliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Delivery Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Estimated delivery time"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="maxDeliveryTimeExceedingStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Time After Exceeding Stock</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Max time after stock exceeded"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Delivery Areas</h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Post codes for delivery areas
                    </p>
                    {deliveryAreas.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <FormField
                          name={`deliveryAreas.${index}.deliveryArea`}
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input
                                  placeholder="Enter delivery post code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDeliveryArea(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendDeliveryArea({ deliveryArea: "" })}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Delivery Area
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Collection Information
                  <FormField
                    control={control}
                    name="collectionEligibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="minCollectionCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Minimum count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="maxCollectionCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Count</FormLabel>
                          <FormControl>
                            <Input placeholder="Maximum Count" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="collectionAvailabilityTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Collection Availability Time</FormLabel>
                          <FormControl>
                            <Input placeholder="Availability time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="maxCollectionTimeExceedingStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Time After Exceeding Stock</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Max time after stock exceeded"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Collection Points / Branches
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                      Post codes for collection points / branches
                    </p>
                    {collectionPoints.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        <FormField
                          name={`collectionPoints.${index}.collectionPoint`}
                          control={control}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input
                                  placeholder="Enter collection post code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCollectionPoint(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        appendCollectionPoint({ collectionPoint: "" })
                      }
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Collection Point
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Stock Information</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Count</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter stock value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Save and Close Buttons */}
        <div className="mt-8 flex justify-end md:hidden">
          <Link href="/admin/inventory">
            <Button type="button" variant="outline" className="mr-2">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </Link>
          <LoadingButton
            type="submit"
            disabled={!isDirty || isPending}
            loading={isPending}
          >
            {!isPending && <Check className="mr-2 h-4 w-4" />}
            Save Changes
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
