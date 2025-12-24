// src/routes/index.ts
import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { uploadRoutes } from "./upload.routes";

export const routesV1 = Router();

routesV1.use("/auth", authRoutes);
routesV1.use("/user", userRoutes);
routesV1.use("/upload", uploadRoutes);
