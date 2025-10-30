import { z } from "zod";

const forgotPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address").trim().toLowerCase(),
  })
  .strict();

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const validateForgotPassword = (data: unknown) =>
  forgotPasswordSchema.safeParseAsync(data);

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain at least one special character (!@#$%^&*)"
      ),
    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const validateResetPassword = (data: unknown) =>
  resetPasswordSchema.safeParseAsync(data);
