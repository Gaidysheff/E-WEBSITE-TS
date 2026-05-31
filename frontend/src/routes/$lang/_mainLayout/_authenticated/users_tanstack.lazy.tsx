import { createLazyFileRoute } from "@tanstack/react-router";
import { type User } from "@/lib/types.ts";

interface LoaderData {
  users: User[];
}

export const Route = createLazyFileRoute("/$lang/_mainLayout/_authenticated/users_tanstack")({
  component: UsersPage,
});

function UsersPage() {
  const { users } = Route.useLoaderData() as LoaderData;
  return (
    <div className="container">
      {users.map((item, index: number) => (
        <div key={index} className="my-5">
          <div> ID: {item.id}</div>
          <div> Email: {item.email} </div>
        </div>
      ))}
    </div>
  );
}
