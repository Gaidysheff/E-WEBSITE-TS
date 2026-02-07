export type User = {
  id: number;
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  birthday: string;
  image: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
};

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
  description: string;
  price: number;
  slug: string;
  image: string;
  featured: boolean;
  category: Category;
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
  stripe_checkout_id: string;
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

// --------------------- Theme -------------------------

export type ThemeSwitch = "light" | "dark";
// export type ThemeSwitch = "light" | "dark" | null;

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

// ==================== AugmentedRequired<Type, Key> ===========================
export type AugmentedRequired<
  T extends object,
  K extends keyof T = keyof T,
> = Omit<T, K> & Required<Pick<T, K>>;
