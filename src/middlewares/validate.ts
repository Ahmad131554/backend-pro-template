import type { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult, type ValidationChain } from "express-validator";
import { error } from "../utils/apiResponse.js";

type FormattedErrors = Record<string, string>;

export function runValidations(validations: ValidationChain[]): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((v) => v.run(req)));

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const formatted: FormattedErrors = {};

      for (const err of result.array({ onlyFirstError: true })) {
        // express-validator v7 uses `path`; older versions used `param`
        const field = (err as any).path ?? (err as any).param ?? "general";
        if (!formatted[field]) formatted[field] = String(err.msg);
      }

      return error(res, 400, "Validation Failed", formatted);
    }

    return next();
  };
}
