import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";

// import { Login } from "./_auth/login.jsx";

export const Route = createFileRoute("/_authenticated")({
  component: () => {
    const navigate = useNavigate();

    const token = localStorage.getItem("Token");

    // return token ? <Outlet /> : <Login />;
    // This version of Login is framed by NavBar and Footer

    return token ? <Outlet /> : navigate({ to: `/login` });
    // This version of Login is NOT framed by NavBar and Footer
  },
});
