import { Request, Response, NextFunction } from 'express';

//**************** helpers ******************************//
import { handleError, AppError, HttpCode } from '../../helpers';
import { logger } from '../logger/logger';

/**
 * Realiza el mapeo de errores
 * @param error clase de error capturado
 * @param req Request de la petición
 * @param res Respuesta de la petición
 * @param next Funcion para dar continuidad con la aplicación
 */
export const HandlerException = async (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let status = HttpCode.INTERNAL_SERVER_ERROR;
	let detailsError;

	if (error instanceof AppError) {
		status = error.status;
		detailsError = error.detailsError;
	}
	logger.error(error.message);
	handleError(res, status, error.message, detailsError);
};
