import axios from "axios";
import { Prisma, Status } from "@prisma/client";

/**
 * Type definition for a template with its related fields and counts
 */
export type TemplateWithDetails = Prisma.TemplateGetPayload<{
  include: {
    fields: true;
    _count: {
      select: {
        fields: true;
      };
    };
  };
}> & {
  productCount: number;
};

/**
 * Parameters for fetching templates with pagination, sorting and filtering
 */
export interface FetchTemplatesParams {
  page?: string;
  page_size?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
}

/**
 * Response structure for paginated templates
 */
export interface TemplatesResponse {
  templates: TemplateWithDetails[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Fetches templates with pagination, sorting, and filtering support
 *
 * @param params - Query parameters for filtering and pagination
 * @returns Promise containing paginated templates and pagination metadata
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const { templates, pagination } = await fetchTemplates({
 *   page: "1",
 *   page_size: "10",
 *   sort_by: "createdAt",
 *   sort_order: "desc",
 *   filter_status: "ACTIVE"
 * });
 * ```
 */
export async function fetchTemplates(
  params: FetchTemplatesParams
): Promise<TemplatesResponse> {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });

    const { data } = await axios.get<{
      success: boolean;
      message: string;
      data: TemplateWithDetails[];
      pagination: TemplatesResponse["pagination"];
    }>(`/api/templates?${searchParams.toString()}`);

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch templates");
    }

    return {
      templates: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch templates: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch templates");
  }
}

/**
 * Fetches details of a specific template by ID
 *
 * @param templateId - The ID of the template to fetch
 * @returns Promise containing template details with its fields
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const templateDetails = await fetchTemplateDetails('template-123');
 * ```
 */
export async function fetchTemplateDetails(
  templateId: string
): Promise<TemplateWithDetails> {
  try {
    const { data } = await axios.get<{
      success: boolean;
      message: string;
      data: TemplateWithDetails;
    }>(`/api/templates/${templateId}`);

    if (!data.success || !data.data) {
      throw new Error(data.message || "Failed to fetch template details");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch template details: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch template details");
  }
}
