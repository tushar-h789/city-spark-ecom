"use client";

import { useEffect, useState } from "react";
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
} from "@/components/ui/form";
import { MultiImageDropzone, type FileState } from "./multi-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useFormContext, useFieldArray } from "react-hook-form";

interface ProductImagesSectionProps {
  initialImages?: string[];
}

export default function ProductImagesSection({
  initialImages = [],
}: ProductImagesSectionProps) {
  const { edgestore } = useEdgeStore();
  const { control } = useFormContext();
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  const { append: appendImages } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (initialImages.length > 0) {
      setFileStates(
        initialImages.map((image) => ({
          file: image,
          key: Math.random().toString(36).slice(2),
          progress: "COMPLETE",
        }))
      );
    }
  }, [initialImages]);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl">Images</CardTitle>
        <CardDescription>Upload product images here.</CardDescription>
      </CardHeader>

      <CardContent>
        <FormField
          control={control}
          name="images"
          render={({ field }) => (
            <FormItem className="mx-auto">
              <FormLabel>
                <h2 className="text-xl font-semibold tracking-tight"></h2>
              </FormLabel>
              <FormControl>
                <MultiImageDropzone
                  value={fileStates}
                  dropzoneOptions={{
                    maxFiles: 6,
                    maxSize: 1024 * 1024 * 1, // 1MB
                  }}
                  onChange={(files) => {
                    setFileStates(files);
                  }}
                  onFilesAdded={async (addedFiles) => {
                    const allFiles = [...fileStates, ...addedFiles];
                    setFileStates(allFiles);

                    await Promise.all(
                      addedFiles.map(async (addedFileState) => {
                        if (!(addedFileState.file instanceof File)) {
                          console.error(
                            "Expected a File object, but received:",
                            addedFileState.file
                          );
                          updateFileProgress(addedFileState.key, "ERROR");
                          return;
                        }

                        try {
                          const res = await edgestore.publicImages.upload({
                            file: addedFileState.file,
                            options: {
                              temporary: true,
                            },
                            input: { type: "product" },
                            onProgressChange: async (progress) => {
                              updateFileProgress(addedFileState.key, progress);
                              if (progress === 100) {
                                // wait 1 second to set it to complete
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 1000)
                                );

                                updateFileProgress(
                                  addedFileState.key,
                                  "COMPLETE"
                                );
                              }
                            },
                          });

                          appendImages({
                            image: res.url,
                          });
                        } catch (err) {
                          updateFileProgress(addedFileState.key, "ERROR");
                        }
                      })
                    );
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
