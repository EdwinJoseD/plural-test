/**
 * @type {object} ValidateErrorEndpoint - Estructura de validación de error de endpoint
 * @property {string} - Es la url del endpoint
 * @property {number} - Es el status de error del endpoint
 */
export type ValidateErrorEndpoint = {
    url: string;
    status: number;
}


/**
 * @type {object} ValidateEndpointRetry - Estructura de endpoint validar reintentos
 * @property {string} - Es la url del endpoint
 * @property {string} - Es el metodo http del endpoint
 */
export type ValidateEndpointRetry = {
    url: string;
    method: string;
}

/**
 *  @type {object} DataResponse - Estructura de respuesta capturada de un error
 *  @property {object} - Datos de respuesta capturado
 **/
export type DataResponse<T> = {
    data: T;
    mapError?: boolean
}