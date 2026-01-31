import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { generateRandomString } from "@/lib/utils.ts";
import { CART_NUMBER_OF_ITEMS_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cartCode: string;
  cartItemsCount: number;
  // setCartItemsCount: (value: number) => void;
  setCartItemsCount: React.Dispatch<React.SetStateAction<number>>;
  clearCartCode: () => void;
  // isLoading: boolean;
  // error: unknown | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({ children }: CartProviderProps) => {
  const [cartCode, setCartCode] = useState<string>("");
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);

  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState<unknown | null>(null);

  // ----------- Number of Items in the Cart ------------------------

  const getCartItemsCount = async () => {
    try {
      await api
        .get(`${CART_NUMBER_OF_ITEMS_URL}?cart_code=${cartCode}`)
        .then((response) => {
          // console.log("🚀 ~ getCartItemsCount ~ response:", response);
          if (typeof response !== "undefined") {
            setCartItemsCount(response.data.num_of_items);
            return response;
          }
        });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("An unknown error occured");
    }
  };

  // -----------------------------------------------------------------
  useEffect(() => {
    let code = localStorage.getItem("cartcode");
    if (!code) {
      code = generateRandomString();
      localStorage.setItem("cartcode", code);
    }
    setCartCode(code);
  }, []);

  useEffect(() => {
    if (cartCode) {
      getCartItemsCount();
    }
  }, [cartCode]);

  const clearCartCode = () => {
    localStorage.removeItem("cartcode");
    setCartCode("");
  };

  const value = {
    cartCode,
    cartItemsCount,
    setCartItemsCount,
    clearCartCode,
    // isLoading,
    // error,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// export const useCart = () => useContext(CartContext)

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
