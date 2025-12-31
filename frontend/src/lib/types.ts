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
};
