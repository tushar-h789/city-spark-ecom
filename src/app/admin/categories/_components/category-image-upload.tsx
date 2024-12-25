"use client";

import React, { Dispatch, SetStateAction } from "react";
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
import { SingleImageDropzone } from "@/components/custom/single-image-uploader";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState } from "@/components/custom/single-image-uploader";
import { CategoryFormInputType } from "../schema";
import { useFormContext } from "react-hook-form";

interface CategoryImageUploadProps {
  fileState: FileState | null;
  setFileState: Dispatch<SetStateAction<FileState | null>>;
}

export default function CategoryImageUpload({
  fileState,
  setFileState,
}: CategoryImageUploadProps) {
  const { control } = useFormContext<CategoryFormInputType>();
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileState((fileState) => {
      const newFileState = structuredClone(fileState);
      if (newFileState) {
        newFileState.progress = progress;
      }
      return newFileState;
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Images</CardTitle>
        <CardDescription>Upload your category image here.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="image"
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

                    if (file === null) {
                      field.onChange("");
                    }
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
                      const res = await edgestore.publicImages.upload({
                        file: addedFile.file,
                        options: {
                          temporary: true,
                        },

                        input: { type: "category" },

                        onProgressChange: async (progress) => {
                          updateFileProgress(addedFile.key, progress);

                          if (progress === 100) {
                            // wait 1 second to set it to complete
                            // so that the user can see the progress bar at 100%
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );

                            updateFileProgress(addedFile.key, "COMPLETE");
                          }
                        },
                      });

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
  );
}
