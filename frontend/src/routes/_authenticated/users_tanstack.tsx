import { createFileRoute } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { type User } from "@/lib/types.ts";
import { USERS_URL } from "@/api/endpoints";
import Error from "@/components/error/Error";
import api from "@/api/api";

export const Route = createFileRoute("/_authenticated/users_tanstack")({
  // component: UsersPage,

  loader: async () => {
    // ---------- Loading Delay ----------
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await api.get<Array<User>>(USERS_URL);

    return {
      users: response.data,
    };
  },

  pendingComponent: () => <p>Loading data...</p>,

  errorComponent: () => {
    toast.error("Something went wrong");
    return <Error />;
  },
});

// export function UsersPage() {
//   const { users } = Route.useLoaderData();
//   return (
//     <div>
//       {users.map((item: User, index: number) => (
//         <div key={index} className="my-5">
//           <div> ID: {item.id}</div>
//           <div> Email: {item.email} </div>
//         </div>
//       ))}
//     </div>
//   );
// }
