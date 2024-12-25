import { Prisma } from "@prisma/client";
import axios from "axios";

// Define types based on Prisma schema for orders
export type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        phone: true;
        addresses: true;
      };
    };
    cart: {
      include: {
        cartItems: {
          include: {
            inventory: {
              include: {
                product: {
                  include: {
                    brand: true;
                    primaryCategory: true;
                    secondaryCategory: true;
                    tertiaryCategory: true;
                    quaternaryCategory: true;
                  };
                };
              };
            };
          };
        };
        promoCode: true;
      };
    };
    orderItems: {
      include: {
        product: {
          include: {
            brand: true;
            primaryCategory: true;
            secondaryCategory: true;
            tertiaryCategory: true;
            quaternaryCategory: true;
          };
        };
      };
    };
  };
}>;

// Define the type for list view orders (lighter than full OrderWithRelations)
export type OrderListItem = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
      };
    };
    cart: {
      select: {
        totalPriceWithVat: true;
        cartItems: {
          include: {
            inventory: {
              include: {
                product: {
                  select: {
                    name: true;
                    images: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}> & {
  customerName: string;
};

// Pagination types
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

// API response types
interface OrderListResponse {
  success: boolean;
  message: string;
  data: {
    orders: OrderListItem[];
    pagination: PaginationInfo;
  };
}

interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: OrderWithRelations & {
    customerName: string;
  };
}

// Parameters for fetching orders
export interface FetchOrdersParams {
  page?: string;
  page_size?: string;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filter_status?: string;
  filter_payment_status?: string;
  filter_shipping_status?: string;
  start_date?: string;
  end_date?: string;
}

export async function fetchOrders(params: FetchOrdersParams = {}) {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value);
      }
    });

    const { data } = await axios.get<OrderListResponse>(
      `/api/admin/orders?${searchParams.toString()}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    return {
      orders: data.data.orders,
      pagination: data.data.pagination,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
    throw error;
  }
}

export async function fetchOrderDetails(orderId: string) {
  try {
    const { data } = await axios.get<OrderDetailResponse>(
      `/api/admin/orders/${orderId}`
    );

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch order details");
    }

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
    throw error;
  }
}
