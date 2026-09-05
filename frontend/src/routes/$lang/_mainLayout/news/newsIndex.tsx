import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_mainLayout/news/newsIndex")({
  // component: RouteComponent,

  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || undefined,
    page: (search.page as number) || 1,
    page_size: (search.page_size as number) || 12,
  }),
});

// function RouteComponent() {
//   return <div>Hello "/$lang/_mainLayout/news/newsIndex"!</div>;
// }
