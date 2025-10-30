import { z } from "zod";

const verifyEmailOtpSchema = z
  .object({
    email: z.string().email("Invalid email address").trim().toLowerCase(),
    otp: z
      .string()
      .length(6, "OTP must be 6 digits")
      .regex(/^\d{6}$/, "OTP must contain only digits"),
  })
  .strict();

export type VerifyEmailOtpData = z.infer<typeof verifyEmailOtpSchema>;

export const validateVerifyEmailOtp = (data: unknown) =>
  verifyEmailOtpSchema.safeParseAsync(data);

const resendVerificationOtpSchema = z
  .object({
    email: z.string().email("Invalid email address").trim().toLowerCase(),
  })
  .strict();

export type ResendVerificationOtpData = z.infer<
  typeof resendVerificationOtpSchema
>;

export const validateResendVerificationOtp = (data: unknown) =>
  resendVerificationOtpSchema.safeParseAsync(data);
