"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CategoryFormInputType } from "../schema";

export default function CategoryDetails() {
  const form = useFormContext<CategoryFormInputType>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Category Details</CardTitle>
        <CardDescription>
          Enter the basic information for this category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter category name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Category Type</FormLabel>
                <FormControl>
                  <Select
                    value={value}
                    onValueChange={(value) => {
                      if (value) {
                        onChange(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIMARY">Primary</SelectItem>
                      <SelectItem value="SECONDARY">Secondary</SelectItem>
                      <SelectItem value="TERTIARY">Tertiary</SelectItem>
                      <SelectItem value="QUATERNARY">Quaternary</SelectItem>
                    </SelectContent>
                  </Select>
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
