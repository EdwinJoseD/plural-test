import axios, { AxiosError, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';


//******************* types ***********************//
import { HttpCode,HttpMethod, MapErrorRequest } from '../response.type';
import { ValidateErrorEndpoint, ValidateEndpointRetry, DataResponse } from './axios.type';
import { exceptionRetry, validateError } from './axios';

//******************helper *************************//
export const getExceptionRetry = (): ValidateEndpointRetry[] => exceptionRetry;
export const getValidateErrorArray = (): ValidateErrorEndpoint[] => validateError;


/**
 * Respuesta de error interceptor axios
 * @param error objeto con los datos de error de una respuesta axios
 * @method retryCondition interceptor de reintento de errores axios
 */
export const retryCondition = (error:AxiosError):boolean=>{
    let statusErrorValiate = false;

    if(getExceptionRetry().length>0){
        let requestInfo = getExceptionRetry().find(x=>x.url==error.config?.url && 
            x.method.toLowerCase()==error.config?.method?.toLowerCase());

        if(requestInfo){
            statusErrorValiate = error.response?(error.response.status >= 400):true;
        }
    }
    log.info("Falla servicio:  %s", error.config?.url+" - "+error.config?.method)
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || statusErrorValiate;
}

/**
 * Respuesta exitosa interceptor axios
 * @param response objeto de respuesta exitosa axios
 * @method onFullfilled interceptor de respuesta existosa axios
 */
export const onFullfilled = (response: AxiosResponse) => {
  return response;
};

/**
 * Respuesta de error interceptor axios
 * @param error objeto con los datos de error de una respuesta axios
 * @validateError arreglo de objetos con la url y el status de error a validar de acuerdo a un endpoint
 * @method rejected interceptor de respuesta de error axios
 */
export const rejected = (error: AxiosError):Promise<DataResponse<any>>=>{
    let msgError = "Error peticion"
    let message = error.message?error.message:`${msgError} ${error.config?.url}`;
    let url = error.config?.url;

    log.error(`${msgError} %s`, { 
        message: message,
        url: error.config?.url,
        data: error.config?.data,
        code : error.code ? error.code : 'No hay codigo de error',
        status: error.response?.status ? error.response?.status : 'No hay status de error',
    });


    let response = getValidateErrorArray().find(
        (item) => item.url === error.config?.url && item.status === error.response?.status
        );
    if (response) {
        let dataError = MapErrorRequest(error.response?.data);
        return Promise.resolve({data: dataError, mapError:true});
    } else {
        return Promise.reject(error);
    }
}