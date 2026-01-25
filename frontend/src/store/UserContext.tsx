import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User,
  type DeepPartial,
  type AugmentedRequired,
} from "@/lib/types.ts";
import { CURRENT_USER_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";

// type UserPartial = Partial<User>;
// type UserDeepPartial = DeepPartial<User>;
type UserLoggedIn = AugmentedRequired<DeepPartial<User>, "email">;

const UserContext = createContext<UserLoggedIn | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserLoggedIn | undefined>();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("Token");
      if (token) {
        try {
          await api.get(CURRENT_USER_URL).then((response) => {
            // console.log("🚀 ~ getUser ~ Response:", response);

            const loadedData = {
              id: response.data.id,
              email: response.data.email,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              birthday: response.data.birthday,
              image: response.data.image,
            };

            setUser(loadedData);
          });
        } catch (error) {
          console.log("🚀 ~ Register ~ error:", error);
        }
      }
      return;
    };

    getUser();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
