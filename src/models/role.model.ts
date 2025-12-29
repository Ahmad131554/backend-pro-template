import mongoose from "mongoose";
import { IRole } from "../interfaces/role.interface";

const roleSchema = new mongoose.Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      enum: {
        values: ["user", "admin"],
        message: "Role must be either user or admin",
      },
      trim: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
roleSchema.index({ name: 1 });

const Role = mongoose.model<IRole>("Role", roleSchema);

export default Role;
