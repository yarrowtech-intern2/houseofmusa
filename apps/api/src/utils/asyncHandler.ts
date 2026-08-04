import type { NextFunction, Request, Response } from "express";

/** Express 4 doesn't forward rejected promises to the error middleware on its own. */
export function asyncHandler<Req extends Request = Request, Res extends Response = Response>(
  handler: (req: Req, res: Res, next: NextFunction) => Promise<unknown>,
) {
  return (req: Req, res: Res, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
