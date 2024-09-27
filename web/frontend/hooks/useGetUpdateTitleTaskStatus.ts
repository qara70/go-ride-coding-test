import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useQuery } from "@tanstack/react-query";

export type TaskStatusResponse = {
  shop: string;
  status: string;
  lastRun: string;
};

export function useGetUpdateTitleTaskStatus() {
  const fetch = useAuthenticatedFetch();
  return useQuery(["api", "products", "task", "title"], async () => {
    const res = await fetch("/api/products/task/title");
    if (!res.ok) {
      throw new Error(await res.text());
    }
    const result = await res.json();
    return result;
  });
}
