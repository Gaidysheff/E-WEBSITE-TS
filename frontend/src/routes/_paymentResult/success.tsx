import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_paymentResult/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: (search.orderId as string) || "N/A",
    cryptogram: (search.cryptogram as string) || "N/A",
  }),
});
