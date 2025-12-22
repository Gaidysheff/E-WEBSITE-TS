import Hero from "@/components/hero/Hero.tsx";
import Introduction from "@/components/introduction/Introduction.tsx";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-[85vh]">
      <Introduction />
      <Hero />
      {/* <Hero productsForCarousel={productsForCarousel} /> */}
    </main>
  );
}
