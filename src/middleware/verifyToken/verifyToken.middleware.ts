import { Request, Response, NextFunction } from 'express';

//*********************** helpers *****************************//
import { handleError, HttpCode, verifyToken, decodeToken } from '@/helpers';

import { logger } from '@/config/logger/logger';

export enum MessageError {
  ERROR_TOKEN_AUTHORIZATION = "You don't have permissions for the request",
}

/**
 * Valida la existencia de un token de usuario valido
 * @param req Request de la petición
 * @param res Respuesta de la petición
 * @param next Funcion para dar continuidad con la aplicación
 */
export const verifytoken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers['authorization'];
  //Token para pruebas en postman
  const token = bearerHeader ? bearerHeader.split(' ')[1] : null;
  if (token) {
    const decodedToken: any = decodeToken(token);

    if (!req.body) {
      req.body = {};
    }
    req.body.userToken = token;
    req.body.user = decodedToken.user;
    req.body.userEmail = decodedToken.user.email;
    req.body.rol = decodedToken.user.role;

    const validateToken = await verifyToken(token);

    logger.info('[Token] token validado: %s', validateToken);
    if (validateToken) {
      next();
    } else {
      logger.error('[Token] El token no es valido');
      handleError(
        res,
        HttpCode.UNAUTHORIZED,
        MessageError.ERROR_TOKEN_AUTHORIZATION
      );
    }
  } else {
    logger.error('[Token] No se ha enviado el token de autorización');
    handleError(
      res,
      HttpCode.UNAUTHORIZED,
      MessageError.ERROR_TOKEN_AUTHORIZATION
    );
  }
};
