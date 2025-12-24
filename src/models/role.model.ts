import mongoose from "mongoose";

export interface IRole {
  name: string; // 'user' or 'admin'
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
roleSchema.index({ name: 1 });

const Role = mongoose.model<IRole>("Role", roleSchema);

// Initialize default roles
export const initializeRoles = async () => {
  try {
    const userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      await Role.create({
        name: "user",
        description: "Standard user role",
      });
    }

    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      await Role.create({
        name: "admin",
        description: "Administrator role",
      });
    }
    
    console.log("Roles initialized successfully");
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
};

export default Role;
