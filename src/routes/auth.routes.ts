import { Router } from "express";
import {
  registerRules,
  loginRules,
  forgotPasswordRules,
  verifyOtpRules,
  resetPasswordRules,
} from "../validators/auth.validation.js";
import { runValidations } from "../middlewares/validate.js";
import { authRateLimit } from "../middlewares/security.js";
import {
  uploadProfilePicture,
  handleMulterError,
} from "../middlewares/index.js";
import { authController } from "../controllers/index.js";

export const authRoutes = Router();

// Public authentication routes with rate limiting
authRoutes.post(
  "/register",
  uploadProfilePicture,
  handleMulterError,
  runValidations(registerRules),
  authController.register
);

authRoutes.post("/login", runValidations(loginRules), authController.login);

authRoutes.post(
  "/forgot-password",
  runValidations(forgotPasswordRules),
  authController.forgotPassword
);

authRoutes.post(
  "/verify-otp",
  authRateLimit,
  runValidations(verifyOtpRules),
  authController.verifyOtp
);

authRoutes.post(
  "/reset-password",
  authRateLimit,
  runValidations(resetPasswordRules),
  authController.resetPassword
);
