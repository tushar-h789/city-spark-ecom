"use client";

import Link from "next/link";
import React, { Fragment, useState, useTransition } from "react";
import { ChevronLeft, Trash } from "lucide-react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";

import {
  Form,
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

import { FromInputType, userSchema } from "../schema";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { createUser } from "../actions";
import { Separator } from "@/components/ui/separator";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  FileState,
  SingleImageDropzone,
} from "@/components/custom/single-image-uploader";
import { useEdgeStore } from "@/lib/edgestore";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Create User", href: "/admin/users/new", isCurrentPage: true },
];

const defaultValues = {
  avatar: "",
  name: "",
  email: "",
  phone: "",
  address: {
    street: "",
    postcode: "",
    city: "",
  },
};

export default function CreateUserPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const [fileState, setFileState] = useState<FileState | null>(null);
  const { edgestore } = useEdgeStore();
  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);

      if (newFileState) {
        newFileState.progress = progress;
      }

      console.log(newFileState);
      return newFileState;
    });
  }
  const form = useForm<FromInputType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      address: [
        {
          city: "",
          postalCode: "",
          state: "",
          addressLine1: "",
          addressLine2: "",
          country: "",
        },
      ],
    },
  });
  const { control, handleSubmit } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "address",
  });

  const onCreateUserSubmit: SubmitHandler<FromInputType> = async (data) => {
    startTransition(async () => {
      const result = await createUser(data);

      if (result.success) {
        toast({
          title: "Create User",
          description: result.message,
          variant: "success",
        });

        router.push("/admin/users");
      } else {
        toast({
          title: "Users Saved failed",
          description: result.message,
          variant: "destructive",
        });
        console.error(result.message);
      }
    });
  };

  return (
    <ContentLayout title="Create User">
      <DynamicBreadcrumb items={breadcrumbItems} />

      <Form {...form}>
        <form onSubmit={handleSubmit(onCreateUserSubmit)}>
          <div className="flex items-center gap-4 mb-5 mt-7">
            <Link href="/admin/users">
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Create User
            </h1>
            <Badge variant="outline" className="ml-auto sm:ml-0">
              Active
            </Badge>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <LoadingButton
                type="submit"
                disabled={isPending}
                size="sm"
                loading={isPending}
                className="text-xs font-semibold h-8"
              >
                Save User
              </LoadingButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Details</CardTitle>
                  <CardDescription>
                    Please provide the user details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter confirm password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Address</CardTitle>
                  <CardDescription>Provide address details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 space-y-4">
                    {fields.map((field, index) => (
                      <Fragment key={field.id}>
                        <div
                          key={field.id}
                          className="grid gap-3 sm:grid-cols-9"
                        >
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`address.${index}.city`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter city"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`address.${index}.state`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter state"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`address.${index}.postalCode`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter postalcode"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`address.${index}.addressLine1`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter address line 1"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`address.${index}.addressLine2`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter address line 2"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3 col-span-4">
                            <FormField
                              name={`address.${index}.country`}
                              control={control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter country"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="col-span-1 flex justify-end items-center">
                            <Button
                              disabled={fields.length === 1}
                              variant="ghost"
                              onClick={() => remove(index)}
                            >
                              <Trash className="w-4 h-4 text-primary" />
                            </Button>
                          </div>
                        </div>

                        {fields.length - 1 !== index && <Separator />}
                      </Fragment>
                    ))}

                    <div>
                      <Button
                        type="button"
                        onClick={() =>
                          append({
                            addressId: "",
                            city: "",
                            country: "",
                            postalCode: "",
                            state: "",
                            addressLine1: "",
                            addressLine2: "",
                          })
                        }
                      >
                        Add new
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-5">
                <CardHeader>
                  <CardTitle>Avatar</CardTitle>
                  <CardDescription>Upload your avatar here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem className="mx-auto">
                        <FormLabel>
                          <h2 className="text-xl font-semibold tracking-tight"></h2>
                        </FormLabel>

                        <FormControl>
                          <SingleImageDropzone
                            value={fileState}
                            dropzoneOptions={{
                              maxFiles: 1,
                              maxSize: 1024 * 1024 * 1, // 1MB
                            }}
                            onChange={(file) => {
                              setFileState(file);
                            }}
                            onFilesAdded={async (addedFile) => {
                              if (!(addedFile.file instanceof File)) {
                                console.error(
                                  "Expected a File object, but received:",
                                  addedFile.file
                                );
                                updateFileProgress(addedFile.key, "ERROR");
                                return;
                              }

                              setFileState(addedFile);

                              try {
                                const res = await edgestore.publicImages.upload(
                                  {
                                    file: addedFile.file,
                                    options: {
                                      temporary: true,
                                    },

                                    input: { type: "user" },

                                    onProgressChange: async (progress) => {
                                      updateFileProgress(
                                        addedFile.key,
                                        progress
                                      );

                                      if (progress === 100) {
                                        // wait 1 second to set it to complete
                                        // so that the user can see the progress bar at 100%
                                        await new Promise((resolve) =>
                                          setTimeout(resolve, 1000)
                                        );

                                        updateFileProgress(
                                          addedFile.key,
                                          "COMPLETE"
                                        );
                                      }
                                    },
                                  }
                                );

                                field.onChange(res.url);
                              } catch (err) {
                                updateFileProgress(addedFile.key, "ERROR");
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <LoadingButton
              type="submit"
              disabled={isPending}
              size="sm"
              loading={isPending}
              className="text-xs font-semibold h-8"
            >
              Save Category
            </LoadingButton>
          </div>
        </form>
      </Form>
    </ContentLayout>
  );
}
