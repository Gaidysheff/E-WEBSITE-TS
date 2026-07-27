import React, { createContext, useContext, useEffect, useState } from "react";

import { CURRENCY_RATES_URL } from "@/api/endpoints.ts";
import { publicApi } from "@/api/api.ts";
import { useI18nContext } from "@/i18n/i18n-react";

// 1. Определяем доступные валюты как тип
export type CurrencyType = "RUB" | "USD" | "EUR";

// 2. Описываем, что контекст отдает наружу
interface CurrencyContextProps {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  formatPrice: (priceInRub: number) => string;
  rates: Record<Exclude<CurrencyType, "RUB">, number>; // Курсы USD и EUR по отношению к RUB
  getPresetLabel: (minRub: number, maxRub: number | null) => string;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { locale } = useI18nContext();

  // Загружаем сохраненную валюту из localStorage или ставим RUB по дефолту
  const [currency, setCurrencyState] = useState<CurrencyType>(() => {
    return (localStorage.getItem("user_currency") as CurrencyType) || "RUB";
  });

  // Временные хардкод-курсы для старта фронтенда (позже мы заменим их на fetch от нашего Django)
  // Курс означает: сколько рублей стоит 1 доллар / 1 евро
  // const [rates] = useState({
  //   USD: 90.5, // 1 USD = 90.5 RUB
  //   EUR: 98.2, // 1 EUR = 98.2 RUB
  // });

  // Инициализируем курсы дефолтными значениями (на случай задержки сети)
  const [rates, setRates] = useState({
    USD: 77.0,
    EUR: 88.0,
  });

  // Стягиваем живые курсы из Django при первой загрузке приложения
  useEffect(() => {
    const fetchLiveRates = async () => {
      try {
        const response = await publicApi.get(CURRENCY_RATES_URL);
        if (response.data && response.data.USD && response.data.EUR) {
          setRates({
            USD: Number(response.data.USD),
            EUR: Number(response.data.EUR),
          });
          console.log(
            "🌟 ФРОНТЕНД: Живые курсы валют успешно получены от Django!",
            response.data,
          );
        }
      } catch (error) {
        console.error("Ошибка при получении курсов валют с бэкенда:", error);
      }
    };

    fetchLiveRates();
  }, []);

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

  const getPresetLabel = (minRub: number, maxRub: number | null): string => {
    // Функция для красивого округления валютных значений
    const roundToNiceNumber = (amountInCurrency: number): number => {
      if (amountInCurrency <= 0) return 0;

      // Если цена маленькая (до 20 долларов/евро), округляем до ближайших 5 единиц
      if (amountInCurrency <= 20) {
        return Math.round(amountInCurrency / 5) * 5 || 5;
      }
      // Если цена средняя (до 100), округляем до ближайших 10 единиц
      if (amountInCurrency <= 100) {
        return Math.round(amountInCurrency / 10) * 10;
      }
      // Для больших цен округляем до ближайших 50 единиц
      return Math.round(amountInCurrency / 50) * 50;
    };

    // 1. Обработка для базовой рублевой валюты (оставляем как есть, без копеек)
    if (currency === "RUB") {
      const minStr = Math.round(minRub).toLocaleString();
      if (maxRub === null) return `от ${minStr} ₽`;
      return `${minStr} – ${Math.round(maxRub).toLocaleString()} ₽`;
    }

    // # 2. Расчет курса для USD или EUR
    const currentRate = rates[currency as Exclude<CurrencyType, "RUB">];

    const minConverted = roundToNiceNumber(minRub / currentRate);
    const maxConverted =
      maxRub !== null ? roundToNiceNumber(maxRub / currentRate) : null;

    // Оформляем красивый вывод с символом валюты в зависимости от языка сайта
    const symbol = currency === "USD" ? "$" : "€";
    const isRu = locale === "ru"; // Ваша переменная текущего языка

    if (maxConverted === null) {
      return isRu
        ? `от ${symbol} ${minConverted}`
        : `from ${symbol} ${minConverted}`;
    }

    // Защита: если из-за округления min и max совпали, искусственно раздвигаем шаг
    const finalMax =
      maxConverted <= minConverted ? minConverted + 5 : maxConverted;

    return `${symbol} ${minConverted} – ${symbol} ${finalMax}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, rates, getPresetLabel }}
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
