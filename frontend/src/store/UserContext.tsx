import {
  createContext,
  useCallback,
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
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserLoggedIn | undefined>(undefined);
  // console.log("🚀 ~ UserContextProvider ~ user:", user);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUser = useCallback(async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      setUser(undefined);
      return;
    }
    setIsLoading(true);

    // if (token) {
    try {
      const response = await api.get(CURRENT_USER_URL);
      // setUser(response.data); // Если поля совпадают с UserLoggedIn

      console.log("🚀 ~ getUser ~ data:", response?.data);

      const loadedData = {
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        birthday: response.data.birthday,
        image: response.data.image,
        phone: response.data.phone,
        address: response.data.address,
        // { street, city, phone ... } или null
      };
      setUser(loadedData);
    } catch (error) {
      setUser(undefined);
      console.log("🚀 ~ Ошибка загрузки пользователя", error);
    } finally {
      setIsLoading(false);
    }
    // setIsLoading(false);
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  // Передаем getUser в значение контекста, чтобы его можно было вызвать
  // из формы логина!
  const value = {
    user,
    isLoading,
    setUser,
    refreshUser: getUser, // Протягиваем веревочку для триггера
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// export const useUser = () => useContext(UserContext);
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
