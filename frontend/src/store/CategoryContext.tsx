import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Category } from "@/lib/types.ts";
import { CATEGORY_LIST_URL } from "@/api/endpoints.ts";
import { publicApi } from "@/api/api.ts";
import { useParams } from "@tanstack/react-router";

interface CatProviderProps {
  children: ReactNode;
}

interface CategoriesContextType {
  categories: Category[];
  isLoading: boolean;
  error: unknown | null;
}

const CategoryContext = createContext<CategoriesContextType | undefined>(
  undefined,
);

export const CategoryContextProvider = ({ children }: CatProviderProps) => {
  // 1. Вытаскиваем живой параметр lang из URL роутера
  const { lang } = useParams({ from: "/$lang" });

  const [categories, setCategories] = useState<Category[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const value = {
    categories,
    isLoading,
    error,
  };

  useEffect(() => {
    const getCategories = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 4000));
      try {
        setIsLoading(true);
        await publicApi.get<Category[]>(CATEGORY_LIST_URL).then((response) => {
          const res = response.data;
          const loadedData: Category[] = [];

          for (const key in res) {
            loadedData.push({
              id: res[key].id,
              name: res[key].name,
              image: res[key].image,
              slug: res[key].slug,
            });
          }

          setCategories(loadedData);
        });
      } catch (error: any) {
        console.log("🚀 ~ Register ~ error:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, [lang]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

// export const useCategory = () => useContext(CategoryContext)

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error(
      "useCategory must be used within a CategoryContextProvider",
    );
  }
  return context;
};
