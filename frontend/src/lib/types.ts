export type User = {
  id: number;
  email: string;
  password: string;
  confirm_password: string;
  firstName: string;
  lastName: string;
  birthday: string;
  image: any;
  username: string;
  phone: string;
  address: {
    street: string;
    house: string;
    apartment: string;
    city: string;
    zip: string;
    region: string;
    state: string;
    // phone: string;
  };
};

// export type UserData = {
//   first_name?: string;
//   last_name?: string;
//   birthday?: string;
//   image?: string;
//   username?: string;
//   phone?: string;
// };

export type UserLoggedIn = AugmentedRequired<DeepPartial<User>, "email">;

// ------- Category -------

export type Category = {
  id: number;
  name: string;
  slug: string;
  image: string;
};

export type CategoryWithProducts = Category & { products: Product[] };

// ------- Product -------

export type Product = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  color: string;
  description: string;
  price: number;
  image: string;
  featured: boolean;
  carousel: boolean;
  category: Category;
  gender: string;
  shape: string;
  is_available: boolean;
};

export type Review = {
  id: number;
  product: Product;
  user: User;
  rating: number;
  review: string;
  created: string;
  updated: string;
};

export type Rating = {
  id: number;
  product: Product;
  average_rating: number;
  total_reviews: number;
};

export type Evaluation = {
  poor_review: number;
  fair_review: number;
  good_review: number;
  very_good_review: number;
  excellent_review: number;
};

export type ProductInDetails = Product &
  Evaluation & { rating: Rating } & { reviews: Review[] } & {
    similar_products: Product[];
  };

// ------ Filtering ------

export type ProductSearch = {
  shape: string;
  search: string;
  brand: string;
  maxPrice: number;
  minPrice: number;
  color: string;
  page: number;
  pageSize: number;
  ordering: string;
  rating: number;
};

export type ProductUrlQuery = {
  shape: string;
  search: string;
  brand: string;
  max_price: number;
  min_price: number;
  color: string;
  page: number;
  page_size: number;
  ordering: string;
  rating: number;
  isCatalog: boolean;
};

export type RatingStats = {
  four_plus: number;
  three_plus: number;
  two_plus: number;
  one_plus: number;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  total_pages: number;
  current_page: number;
  results: T[];
  rating_stats: RatingStats;
};

export type PricePreset = {
  id: string;
  label: string;
  min_price: string;
  max_price: string;
  order: string;
};

// ------- Cart -----------

// export type Cart = {
//   cart_code: string;
//   created_at: string;
//   updated_at: string;
// };

// export type CartItem = {
//   cart: Cart;
//   product: Product;
//   quantity: number;
// };

export type Cartitem = {
  id: number;
  product: Product;
  quantity: number;
  sub_total: number;
};

// export type CartItem = {
//   id: number;
//   product: Product;
//   quantity: number;
//   total: number;
// };

export type CartItemsWithTotal = {
  id: number;
  cart_code: string | undefined;
  cart_total: number;
  cartitems: Cartitem[];
};

// -------- Order ----------
export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type Order = {
  id: number;
  checkout_id: string;
  // stripe_checkout_id: string;
  amount: number;
  // currency: string;
  // customer_email: string;
  status: "Pending" | "Paid";
  created_at: string;
  items: OrderItem[];
};

// -------- WishList ----------
export type WishList = {
  id: string;
  user: User;
  product: Product;
  created: string;
};

// -------- Address ----------
export type PureAddress = {
  id?: string;
  street?: string;
  house?: string;
  apartment?: string;
  state?: string;
  city?: string;
  zip?: string;
  region?: string;
  // phone?: string;
};
export type Address = {
  id: string;
  customer: User;
  street: string;
  state: string;
  city: string;
  phone: string;
};

export type AddressWithError = Address & {
  error?: string;
};

// -------- Deliver ----------

// export type DeliveryType = "courier" | "pickup" | "post";

// export type DeliveryOption = {
//   id: DeliveryType;
//   title: string;
//   price: number;
//   time: string;
//   icon: any;
// };

export type DeliveryOption = {
  id: number; // Используем number для стандартного Django ID
  name: string;
  description: string;
  price: number;
  is_pickup: boolean;
  // is_active: boolean;
  // order: number;
  icon: string | null; // DRF вернет URL картинки строкой или null
};

// -------- Payments ----------

export type PaymentMethod = "card" | "sbp" | "yandex";

// --------------------- Theme -------------------------

export type ThemeSwitch = "light" | "dark";
// export type ThemeSwitch = "light" | "dark" | null;

// ----------------------------------------------------------

export interface CPResponse {
  Success?: boolean;
  Message?: string;
  TransactionId: string;
  AcsUrl: string;
  PaReq: string;
}

// ==================== Deep Partial ===========================

export type DeepPartial<T> = { [P in keyof T]?: _DeepPartial<T[P]> };

type _DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends object
      ? DeepPartial<T>
      : T | undefined;

interface _DeepPartialArray<T> extends Array<_DeepPartial<T>> {}

// ================ AugmentedRequired<Type, Key> =======================
export type AugmentedRequired<
  T extends object,
  K extends keyof T = keyof T,
> = Omit<T, K> & Required<Pick<T, K>>;

// ==================== Универсальный Helper ===========================

import { type ReactFormExtendedApi } from "@tanstack/react-form";

// Создаем "ленивый" тип, который сам проставит все any за нас
export type AnyReactForm<TData> = ReactFormExtendedApi<
  TData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
