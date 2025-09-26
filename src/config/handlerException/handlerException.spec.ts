import {describe, expect, it, jest, beforeEach} from '@jest/globals';
import { getMockReq, getMockRes } from '@jest-mock/express';

const { res,mockClear,next } = getMockRes();


//****************** config ****************************//
import {HandlerException} from "./handlerException";

//**************** helpers ******************************//
import { handleError } from "../../helpers/handlerResponse/handlerResponse";
jest.mock("../../helpers/handlerResponse/handlerResponse");


//******************* type ******************************//
import {HttpCode, AppError} from "../../helpers/response.type";


beforeEach(() => {
  mockClear() // can also use clearMockRes()
})

describe("should validate handler error", () => {
  it("validate throw error", async() => {
  	let error:Error= new Error("error test");
  	await HandlerException(error, getMockReq(), res, next);
  	expect(handleError).toHaveBeenCalled();
  })

  it("validate throw error with details", async() => {
  	let error:AppError<string>= new AppError({message:"error test",status:HttpCode.BAD_REQUEST,detailsError:"detalles"});
  	HandlerException(error, getMockReq(), res, next);
  	expect(handleError).toHaveBeenCalled();
  })

})