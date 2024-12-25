"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { createTemplate, updateTemplate } from "../actions";
import { TemplateFormInputType, templateSchema } from "../schema";
import { Prisma } from "@prisma/client";
import TemplateFormHeader from "./template-form-header";
import { useQueryClient } from "@tanstack/react-query";
import { FieldsSection } from "./fields-section";

export type TemplateWithRelations = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
  };
}>;

interface TemplateFormProps {
  templateDetails?: TemplateWithRelations | null;
}

export default function TemplateForm({ templateDetails }: TemplateFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TemplateFormInputType>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      fields: [
        {
          fieldId: "",
          fieldName: "",
          fieldType: "TEXT",
          fieldOptions: "",
          orderIndex: 0,
        },
      ],
      status: "DRAFT",
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  useEffect(() => {
    if (templateDetails) {
      reset({
        name: templateDetails.name,
        description: templateDetails.description || "",
        status: templateDetails.status || "DRAFT",
        fields: templateDetails.fields.map((field, index) => ({
          fieldId: field.id,
          fieldName: field.fieldName,
          fieldType: field.fieldType,
          fieldOptions: field.fieldOptions || "",
          orderIndex: field.orderIndex ?? index,
        })),
      });
    }
  }, [templateDetails, reset]);

  const onSubmit: SubmitHandler<TemplateFormInputType> = async (data) => {
    const modifiedData = {
      ...data,
      fields: data.fields.map((field, index) => ({
        ...field,
        orderIndex: index,
      })),
    };

    console.log(modifiedData);

    startTransition(async () => {
      try {
        const result = templateDetails
          ? await updateTemplate(templateDetails.id, modifiedData)
          : await createTemplate(modifiedData);
        if (result.success) {
          // Invalidate entire cache
          await queryClient.invalidateQueries();
          toast({
            title: templateDetails ? "Template Updated" : "Template Created",
            description: result.message,
            variant: "success",
          });
          router.push("/admin/templates");
        } else {
          toast({
            title: "Template Save Failed",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (error) {
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
        <TemplateFormHeader
          isPending={isPending}
          templateDetails={templateDetails}
        />

        <div className="container pt-8 pb-4 px-4 sm:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Template Details</CardTitle>
                  <CardDescription>
                    Enter the basic information for this template.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter template name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter the purpose of this template"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <FieldsSection />
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              if (value) {
                                field.onChange(value);
                              }
                            }}
                            value={field.value}
                          >
                            <SelectTrigger
                              id="status"
                              aria-label="Select status"
                            >
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DRAFT">Draft</SelectItem>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="ARCHIVED">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-end md:hidden">
            <Button type="button" variant="outline" className="mr-4">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              disabled={!formState.isDirty || isPending}
              loading={isPending}
            >
              {!isPending && <Check className="mr-2 h-4 w-4" />}
              {templateDetails ? "Update Template" : "Save Template"}
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
