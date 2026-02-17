import BankCard from "@/components/payment/BankCard.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_test/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <BankCard />
    </div>
  );
}
