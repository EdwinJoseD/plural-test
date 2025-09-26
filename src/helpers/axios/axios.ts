import axios, { AxiosError, AxiosResponse } from 'axios';
const { URI_AUTH, RETRY_NUMBER, RETRY_TIME }: any = process.env;

import axiosRetry from 'axios-retry';

import { HttpCode } from '../response.type';
import {retryCondition, rejected, onFullfilled} from "./axiosFunctions";
import { ValidateEndpointRetry, ValidateErrorEndpoint } from './axios.type';

/**
 * Arreglo de objetos con la url y el status de error a validar de acuerdo a un endpoint
 **/
export const validateError: Array<ValidateErrorEndpoint> = [
  { url: `${URI_AUTH}/onboarding`, status: HttpCode.CONFLICT },
];

/**
* Arreglo de objetos con la url y metodo del endpoint para reintentar en caso de error
**/
export const exceptionRetry: Array<ValidateEndpointRetry> = [
];

axiosRetry(axios, { retries: RETRY_NUMBER, retryDelay: (retryCount) => {
    log.info("Intento servicio: %s", retryCount)
    return retryCount * RETRY_TIME;
  },
  retryCondition: retryCondition
});

axios.interceptors.response.use(onFullfilled, rejected);

const Axios = axios;

export default Axios;
