import { useI18nContext } from "@/i18n/i18n-react";
import { useNavigate } from "@tanstack/react-router";

export function useAppNavigate() {
  const navigate = useNavigate();
  const { locale } = useI18nContext();

  // Создаем обертку над стандартным navigate
  return (options: any) => {
    return navigate({
      ...options,
      // Автоматически подставляем текущий язык в параметры,
      // если путь ведет в $lang
      params: {
        lang: locale,
        ...options.params,
      },
    });
  };
}
