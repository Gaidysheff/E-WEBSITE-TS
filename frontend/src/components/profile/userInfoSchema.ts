import { z } from "zod";

export const userInfoSchema = z.object({
  username: z.string().min(2, "___"),
  birthday: z.string(),
  image: z.any().optional(),
  // image: z.string(),
  firstName: z.string().min(2, "___"),
  lastName: z.string().min(2, "___"),
  phone: z.string().regex(/^\+?[1-9]\d{1,12}$/, "address.invalid_phone"),
  // Пока простая проверка телефона
});

export type UserInfoFormValues = z.infer<typeof userInfoSchema>;
