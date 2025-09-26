import {describe, expect, it, jest, beforeEach} from '@jest/globals';
import { getMockReq, getMockRes } from '@jest-mock/express'
import { ValidationError, Result} from "express-validator";

const { res,mockClear, next } = getMockRes()

//******************* type ******************************//
import {HttpCode,  AppError} from "../response.type";

//******************** helpers ********************************//
import {handleError,handleResponse,handleValidator} from "./handlerResponse";

beforeEach(() => {
  mockClear() // can also use clearMockRes()
})

 describe("handler response api", () => {

   it("validate response error",async  () => {
   	const expectedResponse = {
      message: "error api",
      status:HttpCode.BAD_REQUEST
    };

   	await handleError(res,HttpCode.BAD_REQUEST,expectedResponse.message);

   	expect(res.json).toHaveBeenCalledWith(expectedResponse);
   })

   it("validate response error with details",async  () => {
   	const expectedResponse = {
      message: "error api",
      status:HttpCode.BAD_REQUEST,
      detailsError:"detalles"
    };

   	await handleError(res,HttpCode.BAD_REQUEST,expectedResponse.message,expectedResponse.detailsError);

   	expect(res.json).toHaveBeenCalledWith(expectedResponse);
   })

    it("validate response success",async  () => {
   	const expectedResponse = {
      data: "respuesta exitosa",
      status:HttpCode.OK
    };

   	await handleResponse(res,HttpCode.OK,expectedResponse.data);

   	expect(res.json).toHaveBeenCalledWith(expectedResponse);
   })

    it("response validate request",async  () => {
   		
   })
 })


 describe("handler validator", () => {
  it("response validate request success",async  () => {

    jest.spyOn(Result.prototype,'isEmpty').mockReturnValue(true);

    let validator = handleValidator(getMockReq(),res,next);
    expect(next).toHaveBeenCalled();
   })

  it("response validate request error",async () => {

    let errors:any[]=[{
      param: '_error',
      msg: "error",
      nestedErrors:[]
    }];

    jest.spyOn(Result.prototype,'isEmpty').mockReturnValue(false);
    jest.spyOn(Result.prototype,'array').mockReturnValue(errors);

     expect(()=>{
      handleValidator(getMockReq(),res,next)
     } ).toThrow(
      AppError
    );
   })

 })