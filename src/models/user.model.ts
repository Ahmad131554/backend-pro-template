import mongoose, { type HydratedDocument, type Model } from "mongoose";
import type { IRole } from "./role.model.js";

export interface IUser {
  username: string;
  email: string;
  password: string; // bcrypt hash
  role: mongoose.Types.ObjectId | IRole; // reference to Role model
  profilePicture?: string | null; // optional profile picture filename

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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Role is required"],
    },
    profilePicture: {
      type: String,
      required: false,
      default: null,
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
