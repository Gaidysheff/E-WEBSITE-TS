import { PRODUCTS_IN_CAROUSEL_URL } from "@/api/endpoints.ts";
import api from "@/api/api.ts";
import axios from "axios";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang/_mainLayout/")({
  // loader: async () => {
  //   // ---------- get Products for Carousel ----------
  //   try {
  //     const response = await api.get(`${PRODUCTS_IN_CAROUSEL_URL}`);
  //     return {
  //       productsForCarousel: response?.data,
  //     };
  //   } catch (error: any) {
  //     throw error;
  //   }
  // },
  loader: async () => {
    try {
      // Обязательно добавляем await и сохраняем в переменную
      const response = await axios.get(
        "https://e-shop-ts-back.onrender.com/api/products_for_carousel/",
      );
      // ВНИМАТЕЛЬНО посмотрите в консоль браузера на этот объект!
      console.log("Данные от Django:", response.data);

      // Временно возвращаем пустой массив, чтобы компонент не падал из-за .map()
      return response.data.data;
    } catch (err) {
      console.error("Ошибка запроса внутри лоадера:", err);
      // Возвращаем пустой массив или null, чтобы компонент не падал при ошибке
      return [];
    }
  },
});
