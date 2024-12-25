import axios from "axios";
import { Prisma, CategoryType } from "@prisma/client";

/**
 * Type definition for a category with its parent relationships and counts
 */
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parentPrimaryCategory: true;
    parentSecondaryCategory: true;
    parentTertiaryCategory: true;
    _count: {
      select: {
        primaryProducts: true;
        secondaryProducts: true;
        tertiaryProducts: true;
        quaternaryProducts: true;
        primaryChildCategories: true;
        secondaryChildCategories: true;
        tertiaryChildCategories: true;
      };
    };
  };
}>;

/**
 * Response structure for paginated categories data
 */
export interface CategoriesResponse {
  success: boolean;
  data: {
    categories: CategoryWithRelations[];
    pagination: {
      currentPage: number;
      totalCount: number;
      totalPages: number;
      pageSize: number;
    };
  };
}

/**
 * Parameters for category fetching
 */
export interface FetchCategoriesParams {
  page?: string;
  page_size?: string;
  search?: string;
  sort_by?: "name" | "createdAt";
  sort_order?: "asc" | "desc";
  filter_type?: CategoryType;
  primary_category_id?: string;
  secondary_category_id?: string;
  tertiary_category_id?: string;
}

/**
 * Fetches categories with pagination, sorting, and filtering capabilities
 *
 * @param params - Object containing query parameters
 * @param params.page - Current page number (default: 1)
 * @param params.page_size - Number of items per page (default: 10)
 * @param params.search - Search term for filtering categories
 * @param params.sort_by - Field to sort by ('name' or 'createdAt')
 * @param params.sort_order - Sort direction ('asc' or 'desc')
 * @param params.filter_type - Filter by category type (PRIMARY, SECONDARY, etc.)
 * @param params.primary_category_id - Filter by primary parent category ID
 * @param params.secondary_category_id - Filter by secondary parent category ID
 * @param params.tertiary_category_id - Filter by tertiary parent category ID
 *
 * @returns Promise containing categories data and pagination information
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const result = await fetchCategories({
 *   page: '1',
 *   page_size: '10',
 *   search: 'heating',
 *   sort_by: 'name',
 *   sort_order: 'desc',
 *   filter_type: 'PRIMARY',
 *   primary_category_id: 'some-id'
 * });
 * ```
 */
export async function fetchCategories(
  params: FetchCategoriesParams
): Promise<CategoriesResponse> {
  try {
    const queryParams = new URLSearchParams();

    // Helper function to add param if it exists and isn't empty
    const addParam = (key: string, value: any) => {
      if (value !== undefined && value !== "" && value !== null) {
        queryParams.append(key, value.toString());
      }
    };

    // Add all possible parameters
    addParam("page", params.page);
    addParam("page_size", params.page_size);
    addParam("sort_by", params.sort_by);
    addParam("sort_order", params.sort_order);
    addParam("filter_type", params.filter_type);
    addParam("search", params.search);
    addParam("primary_category_id", params.primary_category_id);
    addParam("secondary_category_id", params.secondary_category_id);
    addParam("tertiary_category_id", params.tertiary_category_id);

    const data = await axios.get<CategoriesResponse>(
      `/api/categories?${queryParams.toString()}`
    );

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch categories: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch categories");
  }
}

/**
 * Fetches a single category by ID
 *
 * @param categoryId - The ID of the category to fetch
 *
 * @returns Promise containing the category data
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const category = await fetchCategory('123');
 * ```
 */

/**
 * Response structure for single category fetch
 */
export interface CategoryResponse {
  status: "success" | "error";
  data: CategoryWithRelations;
}

export async function fetchCategory(
  categoryId: string
): Promise<CategoryResponse> {
  try {
    const { data } = await axios.get<CategoryResponse>(
      `/api/categories/${categoryId}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch category: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch category");
  }
}
