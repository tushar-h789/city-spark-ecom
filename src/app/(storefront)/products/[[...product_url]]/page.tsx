import React from "react";
import { Metadata } from "next";
import StorefrontProductListPage from "../_components/storefront-product-list-page";
import StorefrontProductDetailsPage from "../_components/storefront-product-details-page";
import { getInventoryItem } from "../../actions";
import DynamicCategoryPage from "../_components/categories-pages/dynamic-categories-page";

type PageParams = Promise<{
  product_url?: string[];
}>;

type SearchParams = Promise<{
  p_id?: string;
  s_id?: string;
  t_id?: string;
  q_id?: string;
  search?: string;
}>;

export async function generateMetadata(props: {
  params: PageParams;
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await props.params;

  if (params.product_url?.[0] === "p" && params.product_url?.[2] === "p") {
    const inventoryItem = await getInventoryItem(params.product_url[3]);
    return {
      title: inventoryItem.product.name,
      description: inventoryItem.product.description || "Product details",
    };
  }

  return {
    title: "Products",
    description: "Browse our products",
  };
}

const getCategoryFromUrl = async (
  product_url: string[] | undefined
): Promise<string[]> => {
  if (!product_url?.length) return [];

  const startIndex = product_url.indexOf("c");
  if (startIndex === -1) return [];

  const endIndex = product_url.indexOf("c", startIndex + 1);
  return endIndex === -1
    ? product_url.slice(startIndex + 1)
    : product_url.slice(startIndex + 1, endIndex);
};

export default async function StorefrontProductsPage(props: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const categories = await getCategoryFromUrl(params.product_url);

  if (params.product_url?.[0] === "p" && params.product_url?.[2] === "p") {
    const inventoryItem = await getInventoryItem(params.product_url[3]);

    return <StorefrontProductDetailsPage inventoryItem={inventoryItem} />;
  }

  if (searchParams.search) {
    return <StorefrontProductListPage isSearch search={searchParams.search} />;
  }

  if (categories.length === 4) {
    return (
      <StorefrontProductListPage
        isPrimaryRequired
        isSecondaryRequired
        isTertiaryRequired
        isQuaternaryRequired
        primaryCategoryId={searchParams.p_id}
        secondaryCategoryId={searchParams.s_id}
        tertiaryCategoryId={searchParams.t_id}
        quaternaryCategoryId={searchParams.q_id}
      />
    );
  }

  if (categories.length === 3) {
    return (
      <DynamicCategoryPage
        primaryId={searchParams.p_id}
        secondaryId={searchParams.s_id}
        tertiaryId={searchParams.t_id}
        type="QUATERNARY"
      />
    );
  }

  if (categories.length === 2) {
    return (
      <DynamicCategoryPage
        primaryId={searchParams.p_id}
        secondaryId={searchParams.s_id}
        type="TERTIARY"
      />
    );
  }

  if (categories.length === 1) {
    return (
      <DynamicCategoryPage primaryId={searchParams.p_id} type="SECONDARY" />
    );
  }

  if (!params.product_url?.length) {
    return <DynamicCategoryPage type="PRIMARY" />;
  }

  return <div>Page not available</div>;
}
