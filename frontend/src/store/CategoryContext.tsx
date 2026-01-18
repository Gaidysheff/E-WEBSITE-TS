import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Category } from "@/lib/types.ts";
import { CATEGORY_LIST_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";

interface CatProviderProps {
  children: ReactNode;
}

const CategoryContext = createContext<Category[] | undefined>(undefined);

export const CategoryContextProvider = ({ children }: CatProviderProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 4000));
      try {
        await api.get(CATEGORY_LIST_URL).then((response) => {
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
      } catch (error) {
        console.log("🚀 ~ Register ~ error:", error);
      }
    };
    getCategories();
  }, []);

  return (
    <CategoryContext.Provider value={categories}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
