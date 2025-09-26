import { validationResult,ValidationError} from "express-validator";
import { Request, Response, NextFunction } from "express";

//*************** interface ************************//
import { ResponseApi,AppErrorArgs,HttpCode,AppError } from "../response.type";

/**
* Realiza el mapeo de una respuesta de error de la aplicación
* @param res Respuesta de la petición
* @param message Mensaje de error de la respuesta
* @param error Detalle del error 
 */
export const handleError = <T>(res: Response, status: HttpCode, message: string, error?:T ) => {
  let response:AppErrorArgs<T> = {
    status: status,
    message: message
  }

  if(error)
    response.detailsError=error;
  res.status(status).json(response);
};

/**
* Realiza el mapeo de una respuesta exitosa de la aplicación
* @param res Respuesta de la petición
* @param status Estado de restuespa de la aplicación
* @param data Cuerpo de la respuesta exitosa 
 */
export const handleResponse = <T>(res: Response, status: HttpCode, data: T) => {
  
  let response:ResponseApi<T> = {
    status: status,
    data:data
  }

  res.status(status).json(response);
};

/**
    * Valida los datos ingresados en el body de una petición
    * @param req Request de la petición
    * @param res Respuesta de la petición
    * @param next Funcion para dar continuidad con la aplicación
*/
export const handleValidator = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {

      throw new AppError<ValidationError[]>({
        message: 'Error validation request',
        detailsError: errors.array()
      });

    }else
      return next();
};
