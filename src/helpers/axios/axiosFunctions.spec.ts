import {describe, expect, it, jest, beforeEach} from '@jest/globals';

//************* helpers *********************************//
import { onFullfilled, rejected, retryCondition } from "./axiosFunctions";
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as axiosFunctions from './axiosFunctions'
import axiosRetry from 'axios-retry';

jest.mock('axios');

jest.mock('axios-retry');


//******************* type ******************************//
import {HttpCode, HttpMethod} from "../response.type";
import { validateError } from './axios';
import { ValidateErrorEndpoint } from './axios.type';

describe("axios interceptor response", () => {

 it("response success interceptor", () => {
  let statusText = "ok";
  let response:AxiosResponse = {
    status: HttpCode.OK,
    statusText: statusText
  } as AxiosResponse;

  let result= onFullfilled(response);

  expect(result.status).toEqual(HttpCode.OK);
  expect(result.statusText).toEqual(statusText);
})

 it("response error OnReject with config",async () => {
  let errorText = "error interceptor";

  const responseData = errorText;
  const response: AxiosResponse = {
    data: responseData,
    status: HttpCode.NOT_FOUND,
  } as AxiosResponse;

  const axiosError = {
    message:errorText,
    config: {
      url: 'http://localhost:3001/v1/request/vanti-c4c/api'
    },
    request: {},
    response: response
  } as AxiosError;

  try{
    await rejected(axiosError)
  }catch(error:any){

    expect(error.config.url).toEqual(axiosError.config?.url);
  }

})
 it("response error OnReject", async() => {
  let errorText = "error interceptor";

  const responseData = errorText;
  const response: AxiosResponse = {
    data: responseData,
    status: HttpCode.NOT_FOUND,
  } as AxiosResponse;

  const axiosError = {
    message:errorText,
    request: {},
    response: response
  } as AxiosError;

  try{
    await rejected(axiosError);
  }catch(error:any){
    expect(error.message).toEqual(errorText);
  }


})


 it("response error OnReject with code", async() => {
  let errorText = "error interceptor";

  const responseData = errorText;
  const response: AxiosResponse = {
    data: responseData,
    status: HttpCode.NOT_FOUND,
  } as AxiosResponse;

  const axiosError = {
    message:errorText,
    request: {},
    code: HttpCode.BAD_REQUEST.toString(),
    response: response
  } as AxiosError;

  try{
    await rejected(axiosError);
  }catch(error:any){
    expect(error.code).toEqual(HttpCode.BAD_REQUEST.toString());
  }

})

 it("response error OnReject with exception url", async() => {
  let errorText = "error interceptor";

  const responseData = {error_detailed_message:[{
    id:"id",
    request_state:"error"
  }]};

  const response: AxiosResponse = {
    data: responseData,
    status: HttpCode.CONFLICT,
  } as AxiosResponse;

  const axiosError = {
    message:errorText,
    request: {},
    config: {
      url: "http://localhost:3000/v1/request"
    },
    response: response
  } as AxiosError;

  jest.spyOn(axiosFunctions, 'getValidateErrorArray').mockReturnValue([{ url: `http://localhost:3000/v1/request`, status: HttpCode.CONFLICT }])

  let result = await rejected(axiosError);
  expect(result.data).toEqual(responseData.error_detailed_message[0]);

})

})

describe("axios retry response", () => {
  it("response current retry axios error 404",()=>{
    let errorText = "error interceptor";

    const response: AxiosResponse = {
      data: errorText,
      status: HttpCode.NOT_FOUND,
    } as AxiosResponse;

    const axiosError = {
      message:errorText,
      request: {},
      config: {
        url: "http://localhost:3000/v1/request",
        method: "post"
      },
      response: response
    } as AxiosError;

    let result = retryCondition(axiosError)

    expect(result).toBeFalsy()
  })


  it("response retry axios error 404 service exception",()=>{
    let errorText = "error interceptor";

    const response: AxiosResponse = {
      data: errorText,
      status: HttpCode.NOT_FOUND,
    } as AxiosResponse;

    const axiosError = {
      message:errorText,
      request: {},
      config: {
        url: "http://localhost:3000/v1/request",
        method: "post"
      },
      response: response
    } as AxiosError;

    jest.spyOn(axiosFunctions, 'getExceptionRetry').mockReturnValue([{ url: `http://localhost:3000/v1/request`, method: HttpMethod.POST }])


    let result = retryCondition(axiosError)

    expect(result).toBeTruthy()
  })
})
