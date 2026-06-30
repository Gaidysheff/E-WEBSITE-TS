import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(3, "address.street_too_short"),
  house: z.string(),
  apartment: z.string(),
  city: z.string().min(2, "address.city_too_short"),

  zip: z
    .string()
    .regex(/^\d{6}$/, "address.zipDigitsOnly") // Строго 6 цифр
    .or(z.literal("")), // ИЛИ разрешаем пустую строку

  region: z.string(),
  state: z.string().min(2, "address.state_too_short"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
