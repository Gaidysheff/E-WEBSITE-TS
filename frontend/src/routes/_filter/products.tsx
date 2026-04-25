import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_filter/products")({
  validateSearch: (search) => ({
    shape: (search.shape as string) || "",
    search: (search.search as string) || "",
    brand: (search.brand as string) || "",
    min_price: (search.min_price as string) || "",
    max_price: (search.max_price as string) || "",
  }),
});
