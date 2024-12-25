import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function useQueryString() {
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([name, value]) => {
        if (value === "") {
          params.delete(name);
        } else {
          params.delete(name); // Remove existing parameter
          params.set(name, value); // Add new value
        }
      });

      return params.toString();
    },
    [searchParams]
  );
  const removeQueryString = useCallback(
    (name: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      newSearchParams.delete(name);

      return newSearchParams.toString();
    },
    [searchParams]
  );

  return { createQueryString, removeQueryString };
}
