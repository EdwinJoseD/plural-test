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

ReportController.get(
  '/user-ranking',
  verifytoken,
  verifyRoles([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const reportDomain = new ReportDomain();
    const result = await reportDomain.getUserRanking();
    handleResponse(res, HttpCode.OK, result);
  }
);

ReportController.get(
  '/project-timeline',
  verifytoken,
  verifyRoles([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const reportDomain = new ReportDomain();
    const result = await reportDomain.getProjectTimeline();
    handleResponse(res, HttpCode.OK, result);
  }
);

ReportController.get(
  '/workload-distribution',
  verifytoken,
  verifyRoles([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const reportDomain = new ReportDomain();
    const result = await reportDomain.getWorkloadReport();
    handleResponse(res, HttpCode.OK, result);
  }
);

ReportController.post(
  '/export-data',
  verifytoken,
  async (req: Request, res: Response) => {
    const reportDomain = new ReportDomain();
    const result = await reportDomain.exportTasks();
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="tasks_export.csv"'
    );
    res.setHeader('Content-Type', 'text/csv');
    handleResponse(res, HttpCode.OK, result);
  }
);
