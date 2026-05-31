import { Outlet, createFileRoute } from "@tanstack/react-router";

import Footer from "@/components/footer/Footer.tsx";
import NavBar from "@/components/navbar/NavBar.tsx";

export const Route = createFileRoute("/$lang/_mainLayout")({
  component: MainLayoutComponent,
});

function MainLayoutComponent() {
  return (
    <div className="h-screen">
      <NavBar />
      <div className="min-h-6/10">
        <Outlet /> {/* Сюда будут залетать дочерние страницы шаблона */}
      </div>
      <Footer />
    </div>
  );
}
