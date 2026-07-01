import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Определяем доступные валюты как тип
export type CurrencyType = "RUB" | "USD" | "EUR";

// 2. Описываем, что контекст отдает наружу
interface CurrencyContextProps {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatPrice: (priceInRub: number) => string;
  rates: Record<Exclude<CurrencyType, "RUB">, number>; // Курсы USD и EUR по отношению к RUB
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Загружаем сохраненную валюту из localStorage или ставим RUB по дефолту
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    return (localStorage.getItem("user_currency") as CurrencyType) || "RUB";
  });

  // Временные хардкод-курсы для старта фронтенда (позже мы заменим их на fetch от нашего Django)
  // Курс означает: сколько рублей стоит 1 доллар / 1 евро
  const [rates] = useState({
    USD: 90.5, // 1 USD = 90.5 RUB
    EUR: 98.2, // 1 EUR = 98.2 RUB
  });

  const setCurrency = (newCurrency: CurrencyType) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("user_currency", newCurrency);
  };

  // 🔥 Главная функция-конвертер цен для всего сайта
  const formatPrice = (priceInRub: number): string => {
    if (isNaN(priceInRub) || priceInRub === null) return "0 ₽";

    switch (currency) {
      case "USD": {
        const priceInUsd = priceInRub / rates.USD;
        // Округляем до 2 знаков после запятой для центовой валюты
        return `$ ${priceInUsd.toFixed(2)}`;
      }
      case "EUR": {
        const priceInEur = priceInRub / rates.EUR;
        return `€ ${priceInEur.toFixed(2)}`;
      }
      case "RUB":
      default:
        // Для рублей обычно округляют до целого, так как копейки в ритейле редко используют
        return `${Math.round(priceInRub).toLocaleString()} ₽`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, rates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

// Удобный хук для использования в компонентах
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
