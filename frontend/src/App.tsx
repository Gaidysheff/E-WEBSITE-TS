import { RouterProvider, createRouter } from "@tanstack/react-router";

import Error404notFound from "@/components/error/Error404notFound.tsx";
import { routeTree } from "./routeTree.gen";

// Register things for typesafety
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }

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
