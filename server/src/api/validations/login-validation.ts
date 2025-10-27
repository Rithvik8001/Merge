import { z } from "zod";

export const validateLoginData = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof validateLoginData>;

const loginValidation = async (payload: unknown) => {
  const result = validateLoginData.safeParse(payload);
  return result;
};

export default loginValidation;
