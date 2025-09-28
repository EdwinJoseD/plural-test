import { NextFunction, Request, Response } from 'express';
import { HttpCode, handleError } from '../../helpers';

export enum MessageError {
  ERROR_TOKEN_AUTHORIZATION = "You don't have permissions with your rol",
}

export const verifyRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRoles.includes(req.body.rol)) {
      return handleError(
        res,
        HttpCode.FORBIDDEN,
        MessageError.ERROR_TOKEN_AUTHORIZATION
      );
    }

    next();
  };
};
