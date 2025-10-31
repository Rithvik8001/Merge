import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

export type LoginData = z.infer<typeof loginValidationSchema>;

export const validateLogin = (data: unknown) => {
  return loginValidationSchema.safeParse(data);
};
