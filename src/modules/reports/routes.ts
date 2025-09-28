import { Router } from 'express';
import { ReportController } from './controller/report.controller';

export const ReportRoutes = Router();

ReportRoutes.use(ReportController);
