import { z } from "zod";

export const validateLoginData = z.object({
  email: z.email().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must include uppercase, lowercase, number, and special character",
      },
    ),
});

export type LoginData = z.infer<typeof validateLoginData>;

const loginValidation = async (payload: unknown) => {
  const result = validateLoginData.safeParse(payload);
  return result;
};

export default loginValidation;
