import mongoose, { type HydratedDocument, type Model } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  username: string;
  email: string;
  password: string; // bcrypt hash
  role: UserRole;

  // Password reset (OTP) - optional
  resetPasswordOtp?: string;
  resetPasswordOtpExpiry?: Date;

  // timestamps (added by Mongoose when timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const { Schema } = mongoose;

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [30, "Email must not exceed 30 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin",
      },
      default: "user",
    },

    // OTP reset fields (optional)
    resetPasswordOtp: { type: String, required: false },
    resetPasswordOtpExpiry: { type: Date, required: false },
  },
  { timestamps: true, strict: true }
);

// Helpful indexes (unique already creates indexes, but explicit is fine)
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Prevent OverwriteModelError in dev/hot-reload environments
const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

export default User;
