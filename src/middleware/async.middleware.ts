import { NextFunction, Request, RequestHandler, Response } from "express";

export const asyncMiddleware = (
  handler: (req: Request, res: Response) => Promise<any>
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
