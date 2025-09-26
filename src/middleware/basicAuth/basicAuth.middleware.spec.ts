import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { NextFunction } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

const { res } = getMockRes();

//*************** meddlewares ************************//
import { verifyBasicAuth, MessageError } from './basicAuth.middleware';

//********************** types *******************************//
import { HttpCode } from '../../helpers';

describe('should validate autorization middleware', () => {
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    process.env = {
        BASIC_AUTH_LOGIN:'vanti',
        BASIC_AUTH_PASSWORD:'vanti',
    };
  });

  it('validate not authorization token', async () => {
    const expectedResponse = {
      message: MessageError.ERROR_TOKEN_AUTHORIZATION,
      status: HttpCode.UNAUTHORIZED,
    };

    verifyBasicAuth(getMockReq(), res, nextFunction);

    expect(res.json).toHaveBeenCalledWith(expectedResponse);
  });

  it('validate authorization token', async () => {

    let base64Auth = "dmFudGk6dmFudGk==";
    let token =
      'Basic '+base64Auth;

    let req = getMockReq({
      headers: { authorization: token },
    });

    verifyBasicAuth(req, res, nextFunction);
    expect(req.body.basicAuth).toEqual("dmFudGk6dmFudGk==");
  });
});