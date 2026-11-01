import type { Category } from "@/lib/types.ts";

export type UserBase = {
  id: number;
  email: string;
  password: string;
  // confirm_password: string;
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
  };
};

export type UserInBackend = UserBase & { confirm_password: string };
export type User = UserBase & { confirmPassword: string };

// ------- Product -------

export type ProductBase = {
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
  // isAvailable: boolean;
  // is_available: boolean;
};

export type Product = ProductBase & {
  isAvailable: boolean;
};
export type ProductInBackend = ProductBase & {
  is_available: boolean;
};

export type ReviewBase = {
  id: number;
  // product: Product;
  // user: User;
  rating: number;
  review: string;
  created: string;
  updated: string;
};
export type ReviewInBackend = ReviewBase & {
  product: ProductInBackend;
  user: UserInBackend;
};
export type Review = ReviewBase & {
  product: Product;
  user: User;
};

export type RatingBase = {
  id: number;
  // product: Product;
};
export type Rating = RatingBase & {
  product: Product;
  averageRating: number;
  totalReviews: number;
};
export type RatingInBackend = RatingBase & {
  product: ProductInBackend;
  average_rating: number;
  total_reviews: number;
};

export type Evaluation = {
  poorReview: number;
  fairReview: number;
  goodReview: number;
  veryGoodReview: number;
  excellentReview: number;
};
export type EvaluationInBackend = {
  poor_review: number;
  fair_review: number;
  good_review: number;
  very_good_review: number;
  excellent_review: number;
};

export type ProductInDetails = Product & { evaluation: Evaluation } & {
  rating: Rating;
} & { reviews: Review[] } & {
  similarProducts: Product[];
};
export type ProductInDetailsInBackend = ProductInBackend & {
  evaluation: EvaluationInBackend;
} & {
  rating: RatingInBackend;
} & { reviews: ReviewInBackend[] } & {
  similar_products: ProductInBackend[];
};
