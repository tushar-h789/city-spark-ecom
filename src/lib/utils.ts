import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createFormData(
  obj: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  if (
    obj &&
    typeof obj === "object" &&
    !(obj instanceof Date) &&
    !(obj instanceof File)
  ) {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = parentKey
            ? `${parentKey}[${key}][${index}]`
            : `${key}[${index}]`;
          createFormData(item, formData, arrayKey);
        });
      } else if (typeof value === "object" && value !== null) {
        const newKey = parentKey ? `${parentKey}[${key}]` : key;
        createFormData(value, formData, newKey);
      } else {
        const formKey = parentKey ? `${parentKey}[${key}]` : key;
        formData.append(
          formKey,
          value instanceof Date ? value.toISOString() : String(value)
        );
      }
    });
  } else {
    if (parentKey) {
      formData.append(
        parentKey,
        obj instanceof Date ? obj.toISOString() : String(obj)
      );
    }
  }
  return formData;
}
