import { Request, Response, NextFunction } from "express";

//**************** helpers ******************************//
import { handleResponse, HttpCode } from '../../helpers';

/**
 * Realiza validación de health check del api 
  * @param req Request de la petición
  * @param res Respuesta de la petición
  * @param next Funcion para dar continuidad con la aplicación
 */
export const HealthCheck =async  (req: Request, res: Response, next: NextFunction) => {

   const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };

   handleResponse(res,HttpCode.OK,healthcheck);
}
