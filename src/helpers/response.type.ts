/**
 * Codigo de estado respuestas api rest
 */
export enum HttpCode {
  PENDING = 102,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 *  Estructura respuesta exitosa
 */
export type ResponseApi<T> = {
  status: HttpCode;
  data: T;
};

/**
 * Estructura de error de negocio
 */
export type AppErrorArgs<T> = {
  status?: HttpCode;
  message: string;
  detailsError?: T;
};

/**
 * Clase encargada de mapear los errores de negocio
 * @typedef {object} ServerError
 * @property {number} status.required - Código de respuesta de error
 * @property {string} message.required - Descripción del error
 */
/**
 * Clase encargada de mapear los errores de negocio
 * @typedef {object} AppError
 * @property {number} status.required - Código de respuesta de error
 * @property {string} message.required - Descripción del error
 * @property {object} detailsError - Detalle del error
 */
export class AppError<T> extends Error {
  public readonly status: HttpCode;
  public readonly detailsError?: T;

  constructor(args: AppErrorArgs<T>) {
    super(args.message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.detailsError = args.detailsError ? args.detailsError : undefined;
    this.status = args.status ? args.status : HttpCode.BAD_REQUEST;

    Error.captureStackTrace(this);
  }
}

/**
 * Metodos de solicitud http
 */
export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

/**
 * @function MapErrorRequest Mapea los datos de un error de una solicitud, para retornarlos como correctos a la transacción
 * @return {any} Datos de la respuesta de un error de una solicitud
 */
export const MapErrorRequest = (req: any): any => {
  return {
    id: req.error_detailed_message[0].id,
    request_state: req.error_detailed_message[0].request_state,
  };
};
