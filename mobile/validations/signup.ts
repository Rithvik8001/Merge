import { z } from "zod";

export const signupValidationSchema = z
  .object({
    userName: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .min(6, "Username must be at least 6 characters")
      .max(15, "Username must be at most 15 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email("Please enter a valid email address")
      .toLowerCase(),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(
        /[@$!%*?&]/,
        "Password must include a special character (@$!%*?&)"
      ),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
      invalid_type_error: "Confirm password must be a string",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupData = z.infer<typeof signupValidationSchema>;

export const validateSignup = (data: unknown) => {
  return signupValidationSchema.safeParse(data);
};
