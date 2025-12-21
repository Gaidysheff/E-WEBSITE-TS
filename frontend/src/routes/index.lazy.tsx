import { createLazyFileRoute } from "@tanstack/react-router";
// import { useTheme } from "@/store/ThemeContext.tsx";

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-[85vh]">
      <section className="text-2xl">Hello, I'm Index-Page!</section>

      {/* {theme === "light" ? <p>I am LIGHT THEME</p> : <p>I am DARK THEME</p>} */}
    </main>
  );
}
