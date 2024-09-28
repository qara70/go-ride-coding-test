import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useMutation } from "@tanstack/react-query";

export function useUpdateProductTitle() {
  const fetch = useAuthenticatedFetch();
  return useMutation(
    ["api", "products", "task", "title"],
    async (enabled: boolean) => {
      const res = await fetch("/api/products/task/title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const result = await res.json();
      return result;
    }
  );
}
