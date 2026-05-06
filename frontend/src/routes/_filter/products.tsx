import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_filter/products")({
  validateSearch: (search: Record<string, unknown>) => ({
    shape: (search.shape as string) || undefined,
    brand: (search.brand as string) || undefined,
    min_price: (search.min_price as number) || undefined,
    max_price: (search.max_price as number) || undefined,
    color: (search.color as string) || undefined,
    search: (search.search as string) || undefined,
    page: (search.page as number) || 1,
    page_size: (search.page_size as number) || 10,
    ordering: (search.ordering as string) || undefined,
    rating: (search.rating as number) || undefined,
  }),
});
