import { z } from "zod";

export const otpValidationSchema = z.object({
  otp: z
    .string({
      required_error: "OTP is required",
      invalid_type_error: "OTP must be a string",
    })
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address")
    .toLowerCase(),
});

export type OtpData = z.infer<typeof otpValidationSchema>;

export const validateOtp = (data: unknown) => {
  return otpValidationSchema.safeParse(data);
};
