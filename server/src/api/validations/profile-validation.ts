import { z } from "zod";

export const validateViewProfile = z
  .object({
    userId: z.string().min(1, "User ID is required"),
  })
  .strict();

export type ViewProfileData = z.infer<typeof validateViewProfile>;

export const validateEditProfile = z
  .object({
    userName: z
      .string()
      .min(6, "Username must be at least 6 characters")
      .max(15, "Username must be at most 15 characters")
      .optional(),
    age: z.number().min(18, "Age must be at least 18").optional(),
    gender: z.enum(["Male", "Female"]).optional(),
    about: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })
  .strict();

export type EditProfileData = z.infer<typeof validateEditProfile>;

export const validateWorkExperience = z
  .object({
    company: z.string().min(1, "Company name is required").trim(),
    position: z.string().min(1, "Position is required").trim(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date").optional().nullable(),
    isCurrentlyWorking: z.boolean().default(false),
    description: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (!data.isCurrentlyWorking && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required if not currently working",
      path: ["endDate"],
    }
  );

export type WorkExperienceData = z.infer<typeof validateWorkExperience>;

export const validateEducation = z
  .object({
    school: z.string().min(1, "School name is required").trim(),
    degree: z.string().min(1, "Degree is required").trim(),
    fieldOfStudy: z.string().min(1, "Field of study is required").trim(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date").optional().nullable(),
    isCurrentlyStudying: z.boolean().default(false),
    description: z.string().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (!data.isCurrentlyStudying && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required if not currently studying",
      path: ["endDate"],
    }
  );

export type EducationData = z.infer<typeof validateEducation>;

export const validatePasswordChange = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "Password must include uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .strict();

export type PasswordChangeData = z.infer<typeof validatePasswordChange>;

const viewProfileValidation = async (payload: unknown) => {
  const result = validateViewProfile.safeParse(payload);
  return result;
};

const editProfileValidation = async (payload: unknown) => {
  const result = validateEditProfile.safeParse(payload);
  return result;
};

const passwordChangeValidation = async (payload: unknown) => {
  const result = validatePasswordChange.safeParse(payload);
  return result;
};

const workExperienceValidation = async (payload: unknown) => {
  const result = validateWorkExperience.safeParse(payload);
  return result;
};

const educationValidation = async (payload: unknown) => {
  const result = validateEducation.safeParse(payload);
  return result;
};

export {
  viewProfileValidation,
  editProfileValidation,
  passwordChangeValidation,
  workExperienceValidation,
  educationValidation,
};
