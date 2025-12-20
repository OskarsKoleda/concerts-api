import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncMiddleware = <T extends Request = Request>(
  handler: (req: T, res: Response) => Promise<any>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req as T, res);
    } catch (ex) {
      next(ex);
    }
  };
};
