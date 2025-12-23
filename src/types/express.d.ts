import type { AuthenticatedUser } from "../interfaces/user.interface.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};