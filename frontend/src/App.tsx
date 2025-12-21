import { RouterProvider, createRouter } from "@tanstack/react-router";

import Error404notFound from "@/components/error/Error404notFound.tsx";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => {
    return <Error404notFound />;
  },
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
