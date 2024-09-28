import { useAuthenticatedFetch, useToast } from "@shopify/app-bridge-react";
import { useMutation } from "@tanstack/react-query";

export interface UpdateProductTitleInput {
  id: string;
  price: string;
}

export function useUpdateProductTitle() {
  const { show: showToast } = useToast();
  const fetch = useAuthenticatedFetch();
  return useMutation(
    ["api", "products", "variant"],
    async (input: UpdateProductTitleInput) => {
      const res = await fetch("/api/products/variant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const result = await res.json();
      return result;
    },
    {
      onSuccess: () => {
        showToast("更新しました");
      },
      onError: (error) => {
        showToast(`エラーが発生しました ${error}`);
      },
    }
  );
}
