import {describe, expect, it, jest} from '@jest/globals';
import * as  SwaggerDoc from "express-jsdoc-swagger";

let app:any = {
    use:jest.fn(),
    get: jest.fn()
}
//**************config **********************//
import {SwaggerSpec} from "./swagger";

describe("should validate config swagger", () => {
  it("validate initial swagger", async() => {
  	let swagger = SwaggerSpec;

  	expect( swagger(app) ).toBeInstanceOf(Object)
  })
});