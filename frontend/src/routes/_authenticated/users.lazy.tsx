import { useEffect, useState } from "react";
import { type User } from "@/lib/types.ts";
import { USERS_URL } from "@/api/endpoints";
import api from "@/api/api";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/users")({
  component: Users,
});

function Users() {
  const [myData, setMyData] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const GetData = () => {
    api.get(USERS_URL).then((res) => {
      setMyData(res.data);
      // console.log(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <>
      <div className="text-xl font-semibold underline">List of Users</div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          {myData.map((item, index) => (
            <div key={index} className="my-5">
              <div> ID: {item.id}</div>
              <div> Email: {item.email} </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
