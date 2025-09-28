import { Router, Request, Response } from 'express';
import { ReportDomain } from '../domain/report.domain';
import { handleResponse, HttpCode } from '@/helpers';
import { verifytoken } from '@/middleware/verifyToken/verifyToken.middleware';
import multer from 'multer';
import { upload } from '@/middleware/multer/multer.middleware';
import { verifyRoles } from '@/middleware/verifyRoles/verifyRoles.middleware';
import { UserRole } from '@/models/users/users.type';

export const ReportController = Router();

ReportController.get(
  '/dashboard',
  verifytoken,
  verifyRoles([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const reportDomain = new ReportDomain();
    const dash = await reportDomain.getDashboardReport('userId');
    handleResponse(res, HttpCode.OK, dash);
  }
);

ReportController.post(
  '/import-tasks',
  verifytoken,
  upload.single('file'),
  async (req: Request, res: Response) => {
    const reportDomain = new ReportDomain();
    const result = await reportDomain.importTasks(req.file.buffer);
    handleResponse(res, HttpCode.OK, result);
  }
);
