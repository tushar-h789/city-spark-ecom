import { Prisma } from "@prisma/client";
import axios from "axios";

/**
 * Type definition for an inventory item with its related product
 */
export type InventoryWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: true;
  };
}>;

/**
 * Parameters for inventory fetching
 */
export interface FetchInventoriesParams {
  page?: string | number;
  pageSize?: string | number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filterStatus?: string;
}

/**
 * Response structure for paginated inventory data
 */
export interface InventoryResponse {
  success: boolean;
  message?: string;
  inventories: InventoryWithRelations[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

/**
 * Fetches inventory items with pagination, sorting, and filtering capabilities
 *
 * @param params - Object containing query parameters
 * @param params.page - Current page number (default: 1)
 * @param params.pageSize - Number of items per page (default: 10)
 * @param params.search - Search term for filtering inventory items
 * @param params.sortBy - Field to sort by (e.g., 'createdAt', 'stockCount')
 * @param params.sortOrder - Sort direction ('asc' or 'desc')
 * @param params.filterStatus - Filter by inventory status
 *
 * @returns Promise containing inventory data and pagination information
 *
 * @throws Will throw an error if the API request fails
 *
 * @example
 * ```typescript
 * const result = await fetchInventories({
 *   page: '1',
 *   pageSize: '10',
 *   search: 'boiler',
 *   sortBy: 'createdAt',
 *   sortOrder: 'desc'
 * });
 * ```
 */
export async function fetchInventories(
  params: FetchInventoriesParams
): Promise<InventoryResponse> {
  try {
    // Convert params object to URLSearchParams
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    // Make the API request
    const { data } = await axios.get<InventoryResponse>(
      `/api/admin/inventory?${queryParams.toString()}`
    );
    return data;
  } catch (error) {
    // Re-throw the error with a more specific message
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch inventory items: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw new Error("Failed to fetch inventory items");
  }
}
