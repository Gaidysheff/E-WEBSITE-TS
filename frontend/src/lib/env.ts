import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_MY_EMAIL_TO_RECEIVE: z.string(),
});

export const env = envSchema.parse(import.meta.env);
