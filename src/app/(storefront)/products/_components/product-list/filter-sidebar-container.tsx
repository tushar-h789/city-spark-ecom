import React from "react";
import FilterSidebar from "./filter-sidebar";
import { getBrands, getProductFilterOptions } from "../../actions";

type ProductCardsContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
};

export default async function FilterSidebarContainer(
  props: ProductCardsContainerProps
) {
  const {
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
  } = props;

  const brands = await getBrands();
  const filterOptions = await getProductFilterOptions(
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId
  );

  return <FilterSidebar initialBrands={brands} filterOptions={filterOptions} />;
}
