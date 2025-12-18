import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-[85vh]">
      <section className="text-2xl">Hello, I'm Index-Page!</section>
    </main>
  );
}
