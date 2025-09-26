import { Request, Response, NextFunction } from 'express';

//*********************** helpers *****************************//
import { handleError, HttpCode } from '../../helpers';

export enum MessageError {
  ERROR_TOKEN_AUTHORIZATION = "You don't have permissions for the request",
}

/**
 * Valida la existencia de un token de usuario valido
 * @param req Request de la petición
 * @param res Respuesta de la petición
 * @param next Funcion para dar continuidad con la aplicación
 */
export const verifyBasicAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = {
        login: process.env.BASIC_AUTH_LOGIN,
        password: process.env.BASIC_AUTH_PASSWORD,
    }
    const bs64Auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(bs64Auth, 'base64').toString().split(':');
    if (login && password && login === auth.login && password === auth.password) {
        req.body.basicAuth = bs64Auth;
        console.log('basicAuth', req.body.basicAuth);
        return next();
    }else{
    handleError(res, HttpCode.UNAUTHORIZED, MessageError.ERROR_TOKEN_AUTHORIZATION);
    }
};
