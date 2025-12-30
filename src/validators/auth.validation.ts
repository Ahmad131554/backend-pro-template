import { body, type ValidationChain } from "express-validator";

export const registerRules: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .bail()
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage("Email must not exceed 254 characters"),

  body("username")
    .isString()
    .withMessage("Valid username is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("Username must be between 2 and 30 characters"),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginRules: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .bail()
    .normalizeEmail(),

  body("password")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const forgotPasswordRules: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .bail()
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage("Email must not exceed 254 characters"),
];

export const verifyOtpRules: ValidationChain[] = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .bail()
    .normalizeEmail(),

  body("otp")
    .isString()
    .withMessage("OTP must be a string")
    .bail()
    .notEmpty()
    .withMessage("OTP cannot be empty")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .bail()
    .matches(/^\d{6}$/)
    .withMessage("OTP must contain only numbers"),
];

export const resetPasswordRules: ValidationChain[] = [
  body("resetToken")
    .isString()
    .withMessage("Reset token is required")
    .bail()
    .notEmpty()
    .withMessage("Reset token cannot be empty")
    .bail()
    .isJWT()
    .withMessage("Invalid reset token format"),

  body("newPassword")
    .isString()
    .withMessage("Password must be a string")
    .bail()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .bail(),
];

// .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//     .withMessage(
//       "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//     ),
