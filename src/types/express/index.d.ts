import { Params, Query } from 'express-serve-static-core';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: Query;
      validatedParams?: Params;
    }
  }
}
