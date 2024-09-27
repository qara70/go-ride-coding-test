import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useQuery } from "@tanstack/react-query";

type Product = {
  id: string;
  title: string;
  priceRangeV2: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        src: string;
        altText: string | null;
      };
    }[];
  };
};

export type ProductsResponse = {
  body: {
    data: {
      products: {
        edges: {
          node: Product;
        }[];
      };
    };
  };
};

export function useGetProducts() {
  const fetch = useAuthenticatedFetch();
  return useQuery(["api", "products"], async () => {
    const res = await fetch("/api/products");
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const result = await res.json();
    return result;
  });
}
