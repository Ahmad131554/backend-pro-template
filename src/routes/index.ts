// src/routes/index.ts
import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";

export const routesV1 = Router();

routesV1.use("/auth", authRoutes);
routesV1.use("/user", userRoutes);
