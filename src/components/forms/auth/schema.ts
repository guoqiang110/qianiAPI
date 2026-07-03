import { z } from "zod";

export const SignInSchema = z.object({
  apiKey: z.string().min(1, "请输入 API Key"),
  remember: z.boolean().default(true).optional(),
});

export type SignInFormType = z.infer<typeof SignInSchema>;