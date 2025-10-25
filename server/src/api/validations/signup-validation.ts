import { z } from "zod";

export const validateSignupData = z
  .object({
    userName: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .max(15, "Username must be at most 15 characters")
      .optional(),
    email: z.email("Invalid email address").toLowerCase(),
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
    age: z.number().min(18, "Age must be at least 18").optional(),
    gender: z.enum(["Male", "Female"]).optional(),
    about: z.string().optional(),
  })
  .strict();

export type SignupData = z.infer<typeof validateSignupData>;

const signupValidation = async (payload: unknown) => {
  const result = validateSignupData.safeParse(payload);
  return result;
};

export default signupValidation;
