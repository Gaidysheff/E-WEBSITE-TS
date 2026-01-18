export type Product = {
  id: number;
  image: string;
  title: string;
  price: number;
  // sale: number;
};

export type ThemeSwitch = "light" | "dark";
// export type ThemeSwitch = "light" | "dark" | null;

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
