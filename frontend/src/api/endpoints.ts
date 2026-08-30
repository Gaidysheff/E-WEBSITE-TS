import { env } from "@/lib/env";

const BASE_URL = env.VITE_API_URL;

// ----------------------- Users Application -----------------------

export const USERS_URL = `${BASE_URL}/api/users/users/`;
export const CURRENT_USER_URL = `${BASE_URL}/api/users/current_user/`;
export const CURRENT_USER_DATA_URL = `${BASE_URL}/api/users/user_data/`;

// ----------------------- Core Application -----------------------

export const CATEGORY_LIST_URL = `${BASE_URL}/api/core_app/category_list/`;
export const CATEGORY_DETAIL_PAGE_URL = `${BASE_URL}/api/core_app/categories/`;

export const FEATURED_PRODUCT_LIST_URL = `${BASE_URL}/api/core_app/featured_product_list/`;
export const PRODUCTS_IN_CAROUSEL_URL = `${BASE_URL}/api/core_app/products_for_carousel/`;
export const PRODUCT_DETAIL_PAGE_URL = `${BASE_URL}/api/core_app/products/`;
export const PRODUCT_SEARCH_URL = `${BASE_URL}/api/core_app/search?query=`;

export const REVIEW_ADD_URL = `${BASE_URL}/api/core_app/add_review/`;
export const REVIEW_UPDATE_URL = `${BASE_URL}/api/core_app/update_review/`;
export const REVIEW_DELETE_URL = `${BASE_URL}/api/core_app/delete_review/`;

export const WISHLIST_ADD_AND_DELETE_URL = `${BASE_URL}/api/core_app/add_to_wishlist/`;
export const WISHLIST_PRODUCT_ADDED_URL = `${BASE_URL}/api/core_app/product_in_wishlist/`;
export const WISHLISTS_GET_URL = `${BASE_URL}/api/core_app/my_wishlists?email=`;

export const CART_ADD_URL = `${BASE_URL}/api/core_app/add_to_cart/`;
export const CART_PRODUCT_ADDED_URL = `${BASE_URL}/api/core_app/product_in_cart/`;
// export const CART_NUMBER_OF_ITEMS_URL = `${BASE_URL}/api/core_app/get_cart_stat`;
export const CART_UPDATE_URL = `${BASE_URL}/api/core_app/update_cart/`;
export const CART_DELETE_URL = `${BASE_URL}/api/core_app/delete_cart/`;
// export const CART_GET_URL = `${BASE_URL}/api/core_app/get_cart/`;

export const CARTITEM_UPDATE_QUANTITY_URL = `${BASE_URL}/api/core_app/update_cartitem_quantity/`;
export const CARTITEM_DELETE_URL = `${BASE_URL}/api/core_app/delete_cartitem/`;

export const CARTITEMS_WITH_TOTAL_URL = `${BASE_URL}/api/core_app/cart_items_with_total/`;

export const ADDRESS_ADD_URL = `${BASE_URL}/api/core_app/add_address/`;
export const ADDRESS_GET_URL = `${BASE_URL}/api/core_app/get_address?email=`;

export const DELIVERY_OPTIONS_URL = `${BASE_URL}/api/core_app/delivery_options/`;

export const CHECKOUT_URL = `${BASE_URL}/api/core_app/create_checkout_session/`;

export const ORDER_GET_URL = `${BASE_URL}/api/core_app/get_orders?email=`;

export const CLOUD_PAYMENTS_URL = `${BASE_URL}/api/core_app/process_from_cloud_payments/`;

export const CURRENCY_RATES_URL = `${BASE_URL}/api/core_app/currency_rates/`;

export const FILTERING_URL = `${BASE_URL}/api/core_app/filtering/`;
export const USER_ORDERS_URL = `${BASE_URL}/api/core_app/user_orders_list/`;
export const FILTER_METADATA_URL = `${BASE_URL}/api/core_app/get_filter_metadata/`;

// ----------------------- News Application -----------------------

export const NEWS_CATEGORY_LIST_URL = `${BASE_URL}/api/app_news/category_list/`;
export const NEWS_CATEGORY_DETAIL_PAGE_URL = `${BASE_URL}/api/app_news/categories/`;
export const NEWS_POST_LIST_URL = `${BASE_URL}/api/app_news/post_list/`;
export const NEWS_POST_DETAIL_PAGE_URL = `${BASE_URL}/api/app_news/posts/`;

export const POST_FILTERING_URL = `${BASE_URL}/api/app_news/filtering/`;
export const POST_FILTER_LABELS_URL = `${BASE_URL}/api/app_news/get_filter_labels/`;
