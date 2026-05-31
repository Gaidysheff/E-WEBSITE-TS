import { Link, type LinkProps } from "@tanstack/react-router";

import { useI18nContext } from "@/i18n/i18n-react";

// Создаем правильный тип для пропсов, объединяя свойства роутера и
// нативные атрибуты ссылки <a>
type AppLinkProps = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;

export function AppLink({ to, params, ...props }: AppLinkProps) {
  const { locale } = useI18nContext();

  // Если путь начинается со слэша, но не содержит $lang,
  // автоматически превращаем его в правильный динамический маршрут
  let targetTo = to;

  if (to && to.startsWith("/") && !to.includes("$lang")) {
    // Если это был "/products", он превратится в "/$lang/products"
    // (TanStack Router сопоставит его с /$lang/_mainLayout/_filter/products
    // автоматически)
    targetTo = `/$lang${to === "/" ? "" : to}`;
  }
  return (
    <Link
      to={targetTo as any}
      params={{ lang: locale, ...params } as any}
      {...props}
    />
  );
}
