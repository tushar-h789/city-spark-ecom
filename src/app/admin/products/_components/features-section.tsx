"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductFormInputType } from "../schema";

export default function FeaturesSection() {
  const { control } = useFormContext<ProductFormInputType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Features & Benefits</CardTitle>
        <CardDescription>
          List the key features and benefits of your product or service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2">
              <FormField
                name={`features.${index}.feature`}
                control={control}
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={`Feature ${index + 1}`}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          ))}
          <Separator className="my-4" />
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ feature: "" })}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Feature
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
