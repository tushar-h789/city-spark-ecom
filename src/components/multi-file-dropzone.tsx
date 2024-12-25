// MultiFileDropzone.tsx
"use client";

import { formatFileSize } from "@edgestore/react/utils";
import { FileText, Upload, X, AlertCircle, CheckCircle } from "lucide-react";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { cn } from "@/lib/utils";

export type FileState = {
  file: File;
  key: string;
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
  url?: string;
  abortController?: AbortController;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  onFileRemove?: (key: string) => void;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `File size must be less than ${formatFileSize(maxSize)}`;
  },
  fileInvalidType() {
    return "Only PDF and Word documents are allowed";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only upload ${maxFiles} file(s) at a time`;
  },
};

export const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      dropzoneOptions,
      value,
      className,
      disabled,
      onFilesAdded,
      onChange,
      onFileRemove,
    } = props;
    const [customError, setCustomError] = React.useState<string>();
    const [hoveredFile, setHoveredFile] = React.useState<string | null>(null);
    const isDisabled = disabled;

    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled: isDisabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);

        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
        }
      },
      ...dropzoneOptions,
    });

    const errorMessage = React.useMemo(() => {
      if (!fileRejections[0]) return undefined;

      const { errors } = fileRejections[0];
      const error = errors[0];

      if (error?.code === "file-too-large") {
        return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
      }
      if (error?.code === "file-invalid-type") {
        return ERROR_MESSAGES.fileInvalidType();
      }
      if (error?.code === "too-many-files") {
        return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
      }

      return "File not supported";
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="w-full space-y-4">
        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isFocused && "border-primary ring-2 ring-primary/20",
            isDragAccept && "border-green-500 bg-green-50",
            isDragReject && "border-red-500 bg-red-50",
            isDisabled && "bg-gray-100 cursor-default pointer-events-none",
            "hover:border-primary hover:bg-primary/5",
            className
          )}
        >
          <input ref={ref} {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </div>
            <p className="text-xs text-gray-500">
              PDF or Word documents (max. 10MB)
            </p>
          </div>
        </div>

        {/* Error Messages */}
        {(customError || errorMessage) && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>{customError ?? errorMessage}</span>
          </div>
        )}

        {/* File List */}
        {value?.map((fileState) => (
          <div
            key={fileState.key}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group"
            onMouseEnter={() => setHoveredFile(fileState.key)}
            onMouseLeave={() => setHoveredFile(null)}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {fileState.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(fileState.file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {typeof fileState.progress === "number" && (
                <div className="w-20 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${fileState.progress}%` }}
                  />
                </div>
              )}
              <div className="relative w-5 h-5">
                {fileState.progress === "COMPLETE" && (
                  <CheckCircle
                    className={cn(
                      "h-5 w-5 text-green-500 absolute",
                      "transition-opacity duration-200",
                      hoveredFile === fileState.key && "opacity-0"
                    )}
                  />
                )}
                {fileState.progress === "ERROR" && (
                  <AlertCircle className="h-5 w-5 text-red-500 absolute" />
                )}
                <button
                  onClick={() => onFileRemove?.(fileState.key)}
                  className={cn(
                    "text-gray-500 hover:text-red-500 absolute",
                    "transition-opacity duration-200",
                    hoveredFile !== fileState.key &&
                      fileState.progress === "COMPLETE" &&
                      "opacity-0",
                    hoveredFile === fileState.key && "opacity-100"
                  )}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

MultiFileDropzone.displayName = "MultiFileDropzone";
