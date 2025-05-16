import Joi from "joi";

export const signupValidation = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 30 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const changePasswordValidation = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.pattern.base":
        "New password must include uppercase, lowercase, number, and special character",
    }),
});

export const createAdminValidation = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name cannot exceed 30 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
    }),
  role: Joi.string().valid("admin").default("admin"),
});
