import { CategoryWithChildParent } from "@/types/storefront-products";
import { getCategoriesByType, getTopBrands } from "../products/actions";
import CategoryNav from "./category-nav";

export default async function CategoryNavContainer() {
  const { categories: mobileNavCategories } = await getCategoriesByType(
    "PRIMARY",
    ""
  );
  const navCategories = mobileNavCategories as CategoryWithChildParent[];

  const topBrands = await getTopBrands();

  return <CategoryNav categories={navCategories} topBrands={topBrands} />;
}
