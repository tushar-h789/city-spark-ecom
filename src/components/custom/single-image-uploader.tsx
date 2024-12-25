"use client";

import { formatFileSize } from "@edgestore/react/utils";
import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { UploadCloudIcon, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";

const variants = {
  base: "relative rounded-md aspect-square flex justify-center items-center flex-col cursor-pointer border border-dashed border-input hover:border-primary dark:border-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-500/15 bg-gray-500/10",
  image: "p-0 relative  bg-slate-200 dark:bg-slate-900 rounded-md ",
  active: "border",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

export type FileState = {
  file: File | string;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  className?: string;
  value?: FileState | null;
  onChange?: (file: FileState | null) => void | Promise<void>;
  onFilesAdded?: (addedFile: FileState) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const SingleImageDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onChange, onFilesAdded },
    ref
  ) => {
    const [customError, setCustomError] = React.useState<string>();
    const [isFullScreen, setIsFullScreen] = React.useState(false);

    const openFullScreen = () => setIsFullScreen(true);
    const closeFullScreen = () => setIsFullScreen(false);

    const imageUrl = React.useMemo(() => {
      if (typeof value?.file === "string") {
        // in case an url is passed in, use it to display the image
        return value.file;
      } else if (value) {
        // in case a file is passed in, create a base64 url to display the image
        return URL.createObjectURL(value.file);
      }
      return null;
    }, [value]);

    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      accept: { "image/*": [] },
      disabled,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setCustomError(undefined);

        if (
          dropzoneOptions?.maxFiles &&
          (acceptedFiles?.length ?? 0) > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }

        if (file) {
          const addedFile: FileState = {
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          };

          void onFilesAdded?.(addedFile);
          void onChange?.(addedFile);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="relative w-full">
        <div>
          {/* Dropzone */}

          <>
            {!value ? (
              <div
                {...getRootProps({
                  className: dropZoneClassName,
                })}
              >
                {/* Main File Input */}
                <input ref={ref} {...getInputProps()} />

                <div className="flex flex-col items-center justify-center text-lg text-gray-400">
                  <UploadCloudIcon className="mb-2 h-9 w-9 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                    &nbsp; or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or JPEG
                  </p>
                  <div className="mt-3">
                    <Button
                      disabled={disabled}
                      type="button"
                      variant="secondary"
                      color="primary"
                      size="sm"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={openFullScreen}
                className={twMerge(
                  variants.image,
                  "w-full aspect-square border border-input shadow-sm group relative cursor-pointer overflow-hidden"
                )}
              >
                {imageUrl && (
                  <Image
                    className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                    src={imageUrl}
                    alt="Uploaded image"
                    layout="fill"
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300">
                  {value?.progress === "COMPLETE" && (
                    <MagnifyingGlassIcon className="text-white h-14 w-14 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  )}
                </div>

                {/* Progress Bar */}
                {typeof value?.progress === "number" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-70">
                    <CircleProgress progress={value.progress} />
                  </div>
                )}

                {/* Remove Image Icon */}
                {imageUrl && !disabled && (
                  <div
                    className="group absolute right-2 top-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange?.(null);
                    }}
                  >
                    <div className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-70 transition-all duration-300 hover:bg-opacity-100">
                      <X className="text-gray-700" width={16} height={16} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </>

          {/* Error Text */}
          <div className="mt-1 text-xs text-red-500">
            {customError ?? errorMessage}
          </div>
        </div>

        {isFullScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
            onClick={closeFullScreen}
          >
            <div className="relative w-[90vw] h-[90vh]">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Full-screen image"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              )}
            </div>
            <button
              className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={closeFullScreen}
            >
              <Cross2Icon className="h-6 w-6" />
              <span className="sr-only">Close full-screen view</span>
            </button>
          </div>
        )}
      </div>
    );
  }
);

SingleImageDropzone.displayName = "SingleImageDropzone";

export { SingleImageDropzone };

function CircleProgress({ progress }: { progress: number }) {
  const strokeWidth = 5;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-16 w-16">
      <svg
        className="absolute top-0 left-0 -rotate-90 transform"
        width="100%"
        height="100%"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${
          (radius + strokeWidth) * 2
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="text-gray-400"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
        <circle
          className="text-white transition-all duration-300 ease-in-out"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={((100 - progress) / 100) * circumference}
          strokeLinecap="round"
          fill="none"
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
        />
      </svg>
      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center text-xs text-white">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
