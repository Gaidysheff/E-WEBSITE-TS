import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_test/test")({
  component: TestComponent,
});

function TestComponent() {
  return <div>Page for various tests of new components</div>;
}
