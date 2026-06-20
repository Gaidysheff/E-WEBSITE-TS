import { z } from "zod";

export const userInfoSchema = z.object({
  email: z.email("auth.emailInvalid"),
  username: z.string().min(2, "___"),
  firstName: z.string().min(2, "___"),
  lastName: z.string().min(2, "___"),
  phone: z.string().regex(/^\+?[1-9]\d{1,12}$/, "address.invalid_phone"),
  // Простая проверка телефона
});

export type userInfoFormValues = z.infer<typeof userInfoSchema>;
