"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductFormInputType } from "../schema";
import { cn } from "@/lib/utils";

export default function PriceSection() {
  const { control } = useFormContext<ProductFormInputType>();

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const value = e.target.value.replace(/[^\d.]/g, "");
    // Ensure only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      e.target.value = `${parts[0]}.${parts[1]}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Price</CardTitle>
        <CardDescription>Please provide the pricing details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-4">
          <div className="grid gap-3">
            <FormField
              control={control}
              name="retailPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retail Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        handleNumberInput(e);
                        field.onChange(e);
                      }}
                      className={cn(
                        "[-moz-appearance:textfield]",
                        "[&::-webkit-outer-spin-button]:appearance-none",
                        "[&::-webkit-inner-spin-button]:appearance-none"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              control={control}
              name="promotionalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promotional Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        handleNumberInput(e);
                        field.onChange(e);
                      }}
                      className={cn(
                        "[-moz-appearance:textfield]",
                        "[&::-webkit-outer-spin-button]:appearance-none",
                        "[&::-webkit-inner-spin-button]:appearance-none"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3">
            <FormField
              control={control}
              name="tradePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        handleNumberInput(e);
                        field.onChange(e);
                      }}
                      className={cn(
                        "[-moz-appearance:textfield]",
                        "[&::-webkit-outer-spin-button]:appearance-none",
                        "[&::-webkit-inner-spin-button]:appearance-none"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3">
            <FormField
              control={control}
              name="contractPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => {
                        handleNumberInput(e);
                        field.onChange(e);
                      }}
                      className={cn(
                        "[-moz-appearance:textfield]",
                        "[&::-webkit-outer-spin-button]:appearance-none",
                        "[&::-webkit-inner-spin-button]:appearance-none"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
