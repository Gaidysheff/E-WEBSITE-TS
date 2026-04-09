import { RouterProvider, createRouter } from "@tanstack/react-router";

import Error404notFound from "@/components/error/Error404notFound.tsx";
import { routeTree } from "./routeTree.gen";

// Регистрируем типы
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

// const auth = { isAuthenticated: !!localStorage.getItem("Token") };
// Логика проверки авторизации (наличие токена)

const router = createRouter({
  routeTree,
  // context: { auth },
  defaultNotFoundComponent: () => {
    return <Error404notFound />;
  },

  defaultPendingMs: 500, // Set the default pending time to 500ms (0,5 seconds)
  // other options can be added here. Default is 1 sec.
  defaultPendingMinMs: 2000,
  // that ensures a pending component is displayed for at least a certain amount
  // of time, even if the data loads quickly
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
