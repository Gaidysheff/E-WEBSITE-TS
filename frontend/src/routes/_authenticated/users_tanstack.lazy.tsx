import { createLazyFileRoute } from "@tanstack/react-router";
import { type User } from "@/lib/types.ts";

export const Route = createLazyFileRoute("/_authenticated/users_tanstack")({
  component: UsersPage,
});

function UsersPage() {
  const { users } = Route.useLoaderData();
  return (
    <div>
      {users.map((item: User, index: number) => (
        <div key={index} className="my-5">
          <div> ID: {item.id}</div>
          <div> Email: {item.email} </div>
        </div>
      ))}
    </div>
  );
}
