import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { generateRandomString } from "@/lib/utilities.ts";
import { CARTITEMS_WITH_TOTAL_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import { type Cartitem } from "@/lib/types.ts";
import { GET_USER_CARTCODE_URL } from "@/api/endpoints_auth.ts";
import { useParams } from "@tanstack/react-router";

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cartCode: string;
  setCartCode: React.Dispatch<React.SetStateAction<string>>;
  cartItemsCount: number;
  setCartItemsCount: React.Dispatch<React.SetStateAction<number>>;
  // clearCart: () => void;
  clearCartAfterOrder: () => void;
  clearCartAndLogout: () => void;
  items: Cartitem[];
  totalPrice: number;
  refreshCart: () => void;
  isLoading: boolean;
  updateLocalQuantity: (itemId: number, newQuantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider = ({ children }: CartProviderProps) => {
  // 1. Вытаскиваем живой параметр lang из URL роутера
  const { lang } = useParams({ from: "/$lang" });

  const isAuthenticated = !!localStorage.getItem("Token");

  const [cartCode, setCartCode] = useState<string>("");
  const [cartItemsCount, setCartItemsCount] = useState<number>(0);
  const [items, setItems] = useState<Cartitem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0); // Теперь это стейт

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ----------- Один универсальный запрос для корзины ------------------------
  const fetchFullCartData = async (code: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `${CARTITEMS_WITH_TOTAL_URL}?cart_code=${code}`,
      );

      // Добавляем проверку на существование данных
      const items = response?.data?.items || [];
      const total_cart_price = response?.data?.total_cart_price || 0;

      setItems(items);
      setTotalPrice(total_cart_price);

      // Считаем количество элементов на основе длины массива или суммы quantity
      const count = items.reduce(
        (acc: number, item: Cartitem) => acc + item.quantity,
        0,
      );
      setCartItemsCount(count);
    } catch (error: any) {
      // console.error("Failed to fetch cart data:", error);

      if (error.response?.status === 404) {
        // Корзина удалена (после оплаты). Генерируем новую.
        const newCode = generateRandomString();
        localStorage.setItem("cart_code", newCode);
        setCartCode(newCode);
      }
      // Если корзина не найдена (404), обнуляем данные
      setItems([]);
      setTotalPrice(0);
      setCartItemsCount(0);
    }
    setIsLoading(false);
  };

  // 1. Инициализация кода при загрузке
  useEffect(() => {
    let code = localStorage.getItem("cart_code");
    if (!code) {
      code = generateRandomString();
      localStorage.setItem("cart_code", code);
    }
    setCartCode(code);
  }, []);

  // 2. Загрузка данных при изменении кода
  useEffect(() => {
    if (cartCode) {
      fetchFullCartData(cartCode);
    }
  }, [cartCode, lang]);

  // const clearCart = () => {
  //   // Полностью чистим LocalStorage от следов старого юзера
  //   // localStorage.removeItem("Token");
  //   localStorage.removeItem("cart_code");
  //   // localStorage.removeItem("user_id"); // Если сохраняли

  //   // Чтобы иконка корзины в шапке (счетчик) обнулилась мгновенно
  //   // после оплаты без window.location.reload()
  //   // Обнуляем ВСЕ стейты React корзины
  //   setItems([]);
  //   setTotalPrice(0);
  //   setCartItemsCount(0);

  //   // Генерируем чистый код для нового гостя БЕЗ привязок к БД
  //   const newCode = generateRandomString(); // Сразу создаем новый код
  //   localStorage.setItem("cart_code", newCode);
  //   setCartCode(newCode); // Засели новый код
  // };

  // ============== функция clearCart разбита на 2 отдельные ==========

  // 1. Вызываем СТРОГО на странице Success после успешной оплаты
  const clearCartAfterOrder = () => {
    // Токен НЕ трогаем! Пользователь остается авторизован.
    localStorage.removeItem("cart_code");

    // Обнуляем только товары в стейте React
    setItems([]);
    setTotalPrice(0);
    setCartItemsCount(0);

    // Создаем чистый код корзины для следующих покупок
    const newCode = generateRandomString();
    localStorage.setItem("cart_code", newCode);
    setCartCode(newCode);
  };

  // 2. Вызываем СТРОГО при целенаправленном выходе (Logout)
  const clearCartAndLogout = () => {
    localStorage.removeItem("Token"); // Вот теперь стираем токен!
    localStorage.removeItem("cart_code");

    setItems([]);
    setTotalPrice(0);
    setCartItemsCount(0);

    const newCode = generateRandomString();
    localStorage.setItem("cart_code", newCode);
    setCartCode(newCode);
  };
  // =====================================================================
  const refreshCart = useCallback(() => {
    if (cartCode) fetchFullCartData(cartCode);
  }, [cartCode]);

  const updateLocalQuantity = (itemId: number, newQuantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };
  // ----------------------------

  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        const response = await api.get(GET_USER_CARTCODE_URL);
        const serverCartCode = response.data.cart_code;

        if (serverCartCode !== localStorage.getItem("cart_code")) {
          localStorage.setItem("cart_code", serverCartCode);
          setCartCode(serverCartCode);
          refreshCart(); // Перекачиваем товары для нового кода
        }
      }
    };
    syncCart();
  }, [isAuthenticated]);

  const value = {
    cartCode,
    setCartCode,
    cartItemsCount,
    setCartItemsCount,
    // clearCart,
    clearCartAfterOrder,
    clearCartAndLogout,
    items,
    totalPrice,
    refreshCart,
    isLoading,
    updateLocalQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
