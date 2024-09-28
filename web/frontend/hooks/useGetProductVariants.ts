import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useQuery } from "@tanstack/react-query";

type ProductVariant = {
  id: string;
  displayName: string;
  price: string;
  image: {
    url: string;
    altText: string;
  } | null;
};

export type ProductVariantsResponse = {
  body: {
    data: {
      productVariants: {
        edges: {
          node: ProductVariant;
        }[];
      };
    };
  };
};

export function useGetProductVariants() {
  const fetch = useAuthenticatedFetch();
  return useQuery(["api", "products", "variant"], async () => {
    const res = await fetch("/api/products/variant");
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const result = await res.json();
    return result;
  });
}
