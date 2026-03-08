import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { generateRandomString } from "@/lib/utils.ts";
import { CARTITEMS_WITH_TOTAL_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import { type Cartitem } from "@/lib/types.ts";

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cartCode: string;
  cartItemsCount: number;
  setCartItemsCount: React.Dispatch<React.SetStateAction<number>>;
  clearCartCode: () => void;
  items: Cartitem[];
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({ children }: CartProviderProps) => {
  const [cartCode, setCartCode] = useState<string>("");
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [items, setItems] = useState<Cartitem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0); // Теперь это стейт

  // ----------- Один универсальный запрос для корзины ------------------------
  const fetchFullCartData = async (code: string) => {
    try {
      const response = await api.get(
        `${CARTITEMS_WITH_TOTAL_URL}?cart_code=${code}`,
      );

      const { items, total_cart_price } = response.data;

      setItems(items);
      setTotalPrice(total_cart_price);

      // Считаем количество элементов на основе длины массива или суммы quantity
      const count = items.reduce(
        (acc: number, item: Cartitem) => acc + item.quantity,
        0,
      );
      setCartItemsCount(count);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
      // Если корзина не найдена (404), обнуляем данные
      setItems([]);
      setTotalPrice(0);
      setCartItemsCount(0);
    }
  };

  // 1. Инициализация кода при загрузке
  useEffect(() => {
    let code = localStorage.getItem("cartcode");
    if (!code) {
      code = generateRandomString();
      localStorage.setItem("cartcode", code);
    }
    setCartCode(code);
  }, []);

  // 2. Загрузка данных при изменении кода
  useEffect(() => {
    if (cartCode) {
      fetchFullCartData(cartCode);
    }
  }, [cartCode]);

  // ----------------------------

  const clearCartCode = () => {
    localStorage.removeItem("cartcode");
    setCartCode("");
    setItems([]);
    setTotalPrice(0);
    setCartItemsCount(0);
  };

  // const clearCartCode = () => {
  //   localStorage.removeItem("cartcode");
  //   setCartCode("");
  // };

  const value = {
    cartCode,
    cartItemsCount,
    setCartItemsCount,
    clearCartCode,
    items,
    totalPrice,
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
