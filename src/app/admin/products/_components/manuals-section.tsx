"use client";

import { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductFormInputType } from "../schema";
import {
  MultiFileDropzone,
  type FileState,
} from "@/components/multi-file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductWithDetails } from "@/services/admin-products";

interface ManualsSectionProps {
  productDetails?: ProductWithDetails;
}

export default function ManualsSection({
  productDetails,
}: ManualsSectionProps) {
  const form = useFormContext<ProductFormInputType>();
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  const manuals = form.watch("manuals") || [];
  const uploadInProgress = useRef<boolean>(false);
  const mountedRef = useRef<boolean>(false);

  const getFileDetails = async (url: string): Promise<File> => {
    try {
      // Get the full file content instead of just headers
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = url.split("/").pop() || "";

      // Create File from the actual blob content
      return new File([blob], fileName, { type: blob.type });
    } catch (error) {
      console.error("Error getting file details:", error);
      return new File([], url.split("/").pop() || "", {
        type: "application/octet-stream",
      });
    }
  };

  // Handle initial state setup
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const initializeFiles = async () => {
      if (productDetails?.manuals?.length || manuals.length) {
        setIsLoading(true);
        try {
          const urlsToInit = productDetails?.manuals?.length
            ? productDetails.manuals
            : manuals;

          // Get file details for all URLs in parallel
          const fileDetailsPromises = urlsToInit.map(async (url) => {
            const file = await getFileDetails(url);

            console.log(file);
            return {
              file,
              key: Math.random().toString(36).slice(2),
              progress: "COMPLETE" as const,
              url: url,
            } satisfies FileState;
          });

          const states = await Promise.all(fileDetailsPromises);
          setFileStates(states);
        } catch (error) {
          console.error("Error initializing files:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeFiles();
  }, [productDetails, manuals]);

  const handleFilesAdded = async (addedFiles: FileState[]) => {
    if (uploadInProgress.current) return;
    uploadInProgress.current = true;

    try {
      const newFileStates = [...fileStates];
      addedFiles.forEach((file) => {
        newFileStates.push({
          ...file,
          progress: 0,
        });
      });
      setFileStates(newFileStates);

      const newUrls: string[] = [];

      await Promise.all(
        addedFiles.map(async (fileState) => {
          try {
            const res = await edgestore.publicFiles.upload({
              file: fileState.file,
              input: {
                type: "manual",
                category: "product",
              },
              options: {
                temporary: true,
                manualFileName: fileState.file.name,
              },
              onProgressChange: (progress) => {
                setFileStates((current) =>
                  current.map((state) =>
                    state.key === fileState.key ? { ...state, progress } : state
                  )
                );
              },
            });

            newUrls.push(res.url);

            setFileStates((current) =>
              current.map((state) =>
                state.key === fileState.key
                  ? { ...state, progress: "COMPLETE", url: res.url }
                  : state
              )
            );
          } catch (error) {
            console.error("File upload error:", error);
            setFileStates((current) =>
              current.filter((state) => state.key !== fileState.key)
            );
          }
        })
      );

      if (newUrls.length > 0) {
        const updatedManuals = [...manuals, ...newUrls];
        form.setValue("manuals", updatedManuals, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } finally {
      uploadInProgress.current = false;
    }
  };

  const handleRemoveFile = async (keyToRemove: string) => {
    const fileToRemove = fileStates.find((state) => state.key === keyToRemove);

    if (!fileToRemove) return;

    setFileStates((current) =>
      current.filter((state) => state.key !== keyToRemove)
    );

    if (fileToRemove.url && fileToRemove.progress === "COMPLETE") {
      const updatedManuals = manuals.filter((url) => url !== fileToRemove.url);
      form.setValue("manuals", updatedManuals, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manuals & Instructions</CardTitle>
          <CardDescription>Loading existing manuals...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Manuals & Instructions</CardTitle>
        <CardDescription>
          Upload user manuals, technical documents, and installation guides
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MultiFileDropzone
          value={fileStates}
          dropzoneOptions={{
            maxSize: 10 * 1024 * 1024,
            accept: {
              "application/pdf": [".pdf"],
              "application/msword": [".doc"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
            },
          }}
          onChange={(files) => {
            setFileStates(files);
            const completedUrls = files
              .filter((f) => f.progress === "COMPLETE" && f.url)
              .map((f) => f.url!);
            if (completedUrls.length > 0) {
              form.setValue("manuals", completedUrls, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }
          }}
          onFilesAdded={handleFilesAdded}
          onFileRemove={handleRemoveFile}
        />
      </CardContent>
    </Card>
  );
}
