import {describe, expect, it, jest, beforeEach} from '@jest/globals';
import { getMockReq, getMockRes } from '@jest-mock/express';

const { res,mockClear,next } = getMockRes();


//****************** config ****************************//
import {HealthCheck} from "./healthCheck";

//**************** helpers ******************************//
import { handleResponse } from "../../helpers/handlerResponse/handlerResponse";
jest.mock("../../helpers/handlerResponse/handlerResponse");


//******************* type ******************************//
import {HttpCode} from "../../helpers/response.type";


beforeEach(() => {
  mockClear() // can also use clearMockRes()
})

describe("should validate health check", () => {
  it("validate status 200", async() => {

    HealthCheck( getMockReq(), res, next);
    expect(handleResponse).toHaveBeenCalledWith(res,HttpCode.OK,expect.any(Object));
  })

})