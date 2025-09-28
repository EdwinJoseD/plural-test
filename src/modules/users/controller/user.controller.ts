import { Router, Request, Response } from 'express';
import { UserDomain } from '../domain/user.domain';
import { validateGetUsersMiddleware } from '../validator';
import { handleResponse, HttpCode } from '@/helpers';
import { verifytoken } from '@/middleware/verifyToken/verifyToken.middleware';
import { verifyRoles } from '@/middleware/verifyRoles/verifyRoles.middleware';
import { UserRole } from '@/models/users/users.type';

export const UserController = Router();

UserController.get(
  '/search',
  verifytoken,
  verifyRoles([UserRole.ADMIN]),
  validateGetUsersMiddleware,
  async (req: Request, res: Response) => {
    const { page, limit, fieldName, fieldValue, fieldSort, valueSort }: any =
      req.validatedQuery;
    const userDomain = new UserDomain();
    const token = await userDomain.getUserPaginated(
      page,
      limit,
      fieldName,
      fieldValue,
      fieldSort,
      valueSort
    );
    handleResponse(res, HttpCode.OK, token);
  }
);
