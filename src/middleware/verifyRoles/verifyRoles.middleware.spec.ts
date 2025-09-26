import { NextFunction } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { verifyRoles } from './verifyRoles.middleware'

const { ROL_CONTRACTOR }: any = process.env

const { res } = getMockRes();

describe('Validate VerifyRoles', () => {  

    const next: NextFunction = jest.fn();

    it('valid rol contractor', async () => {
        verifyRoles([ROL_CONTRACTOR])(getMockReq(), res, next)

        expect(res.json).toBeDefined();
        
    })

 

})