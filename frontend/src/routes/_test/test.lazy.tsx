import BankCard from "@/components/payment/BankCard.tsx";
import CloudPayments from "@/components/svgImages/CloudPaymentsForButton";
import StripeIcon from "@/components/svgImages/StripeIcon.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_test/test")({
  component: TestComponent,
});

function TestComponent() {
  return (
    <div>
      <BankCard />
      <CloudPayments />
      <StripeIcon />
    </div>
  );
}
