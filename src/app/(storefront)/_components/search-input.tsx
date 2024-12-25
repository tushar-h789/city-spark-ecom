"use client";

import { Button } from "@/components/ui/button";
import { Search, Loader2, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchSuggestions from "./search-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

type BrandWithCount = Prisma.BrandGetPayload<{
  select: {
    name: true;
    image: true;
    countryOfOrigin: true;
    _count: {
      select: {
        products: true;
      };
    };
  };
}>;

type CategoryWithCount = Prisma.CategoryGetPayload<{
  select: {
    name: true;
    image: true;
    _count: {
      select: {
        primaryProducts: true;
        secondaryProducts: true;
        tertiaryProducts: true;
        quaternaryProducts: true;
      };
    };
  };
}>;

type InventoryWithProduct = Prisma.InventoryGetPayload<{
  select: {
    id: true;
    product: {
      select: {
        name: true;
        images: true;
        tradePrice: true;
        features: true;
        model: true;
        type: true;
        brand: {
          select: {
            name: true;
            image: true;
            countryOfOrigin: true;
          };
        };
        primaryCategory: { select: { name: true } };
        secondaryCategory: { select: { name: true } };
        tertiaryCategory: { select: { name: true } };
        quaternaryCategory: { select: { name: true } };
      };
    };
  };
}>;

type SearchResults = {
  brands: BrandWithCount[];
  categories: CategoryWithCount[];
  products: InventoryWithProduct[];
};

type FormData = {
  searchTerm: string;
};

const messages = [
  "boilers",
  "heaters",
  "bathroom & kitchen tiles",
  "plumbing tools and items",
  "spares",
  "renewables",
  "electrical & lighting items",
  "clearance",
];

const fetchSuggestions = async (term: string): Promise<SearchResults> => {
  const { data } = await axios.get(
    `/api/search-suggestions?term=${encodeURIComponent(term)}`
  );
  return data;
};

export default function SearchInput() {
  const [placeholder, setPlaceholder] = useState("Search for products");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTypingEffect, setIsTypingEffect] = useState(true);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { control, handleSubmit, watch, setValue, resetField } =
    useForm<FormData>({
      defaultValues: {
        searchTerm: "",
      },
    });

  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchSuggestions", debouncedSearchTerm],
    queryFn: () => fetchSuggestions(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isTypingEffect) return;

    const currentMessage = messages[messageIndex];
    let typingSpeed = 100;

    if (isDeleting) {
      typingSpeed /= 2;
    }

    const handleTyping = () => {
      if (!isDeleting && index < currentMessage.length) {
        setPlaceholder("Search for " + currentMessage.substring(0, index + 1));
        setIndex(index + 1);
      } else if (isDeleting && index > 0) {
        setPlaceholder("Search for " + currentMessage.substring(0, index - 1));
        setIndex(index - 1);
      } else if (!isDeleting && index === currentMessage.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }
    };

    const timeoutId = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [index, isDeleting, messageIndex, isTypingEffect]);

  useEffect(() => {
    setShowSuggestions(
      isFocused &&
        !!debouncedSearchTerm.trim() &&
        !isLoading &&
        !isError &&
        !!(
          searchResults?.brands.length ||
          searchResults?.categories.length ||
          searchResults?.products.length
        )
    );
  }, [debouncedSearchTerm, isLoading, isError, isFocused, searchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = (data: FormData) => {
    if (data.searchTerm.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(data.searchTerm.trim())}`
      );
      setShowSuggestions(false);
    }
  };

  const handleBrandSelect = (brand: BrandWithCount) => {
    setShowSuggestions(false);
    router.push(`/brands/${encodeURIComponent(brand.name.toLowerCase())}`);
  };

  const handleCategorySelect = (category: CategoryWithCount) => {
    setShowSuggestions(false);
    router.push(
      `/categories/${encodeURIComponent(category.name.toLowerCase())}`
    );
  };

  const handleProductSelect = (product: InventoryWithProduct) => {
    setValue("searchTerm", product.product.name);
    setShowSuggestions(false);
    router.push(`/products/p/${product.product.name}/p/${product.id}`);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsTypingEffect(false);
    setPlaceholder("Search for products");
  };

  const handleClear = () => {
    resetField("searchTerm");
    setShowSuggestions(false);
  };

  return (
    <div ref={searchContainerRef} className="flex-1 relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div
          className={cn(
            "flex h-12 items-center bg-white rounded-md border border-primary shadow-sm transition-all duration-200",
            "hover:border-secondary hover:shadow-md",
            isFocused && "border-secondary shadow-md ring-1 ring-secondary/20"
          )}
        >
          <div className="px-4 text-primary border-r">
            <Search className="h-5 w-5" />
          </div>

          <Controller
            name="searchTerm"
            control={control}
            render={({ field }) => (
              <div className="relative flex-1">
                <input
                  {...field}
                  className="h-full border-0 bg-transparent px-4 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 w-full py-2 outline-none"
                  placeholder={placeholder}
                  onFocus={handleFocus}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-sm hover:bg-secondary/10 text-muted-foreground/60"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          />

          <Button
            type="submit"
            variant="secondary"
            className={cn(
              "h-12 px-6 rounded-none rounded-r-md",
              "transition-all duration-200 hover:opacity-90"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {showSuggestions && searchResults && (
        <div className="absolute top-14 left-0 right-0 rounded-md shadow-lg animate-in fade-in-0 zoom-in-95 z-50">
          <div className="p-1">
            <SearchSuggestions
              brands={searchResults.brands}
              categories={searchResults.categories}
              products={searchResults.products}
              onSelectBrand={handleBrandSelect}
              onSelectCategory={handleCategorySelect}
              onSelectProduct={handleProductSelect}
            />
          </div>
        </div>
      )}
    </div>
  );
}
