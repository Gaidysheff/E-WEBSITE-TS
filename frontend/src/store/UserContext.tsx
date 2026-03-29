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

export type UserLoggedIn = AugmentedRequired<DeepPartial<User>, "email">;

// Создаем тип для значения контекста
interface UserContextType {
  user: UserLoggedIn | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserLoggedIn | undefined>>;
  isLoading: boolean; // Полезно, чтобы не отправлять платеж, пока юзер грузится
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserLoggedIn | undefined>();
  // console.log("🚀 ~ UserContextProvider ~ user:", user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("Token");
      if (token) {
        try {
          // const response = await api.get(CURRENT_USER_URL);
          // setUser(response.data); // Если поля совпадают с UserLoggedIn
          // console.log("🚀 ~ getUser ~ data:", response?.data);
          await api.get(CURRENT_USER_URL).then((response) => {
            const loadedData = {
              id: response.data.id,
              email: response.data.email,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              birthday: response.data.birthday,
              image: response.data.image,
              address: response.data.address,
              // { street, city, phone ... } или null
            };
            setUser(loadedData);
          });
        } catch (error) {
          console.log("🚀 ~ Ошибка загрузки пользователя", error);
        }
      }
      setIsLoading(false);
      // return;
    };

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// export const useUser = () => useContext(UserContext);
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
