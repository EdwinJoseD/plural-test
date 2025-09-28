import environment from 'dotenv-flow';
environment.config({
  silent: true,
});
import express, { Application, Request, Response } from 'express';
import timeout from 'connect-timeout';
// import 'express-async-errors';
import helmet from 'helmet';
import permission from 'permissions-policy';
import cors from 'cors';
import morgan from 'morgan';
import { HealthCheck } from './healthCheck/healthCheck';
import { AuthRoutes } from '@/modules/auth/routes';
import { TasksRoutes } from '@/modules/tasks/routes';
import { ReportRoutes } from '@/modules/reports/routes';
import { NotificationsRoutes } from '@/modules/notifications/routes';

const { PREFIX }: any = process.env;

const app: Application = express();

app.use(timeout(20000));
app.use(
  morgan('dev', {
    skip: function (req: Request, res: Response) {
      return res.statusCode < 400;
    },
  })
);
app.enable('trust proxy');
app.use(cors());
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(
  permission({
    features: {
      fullscreen: ['self'], // fullscreen=()
      vibrate: ['none'], // vibrate=(none)
      payment: ['self', '"example.com"'], // payment=(self "example.com")
      syncXhr: [], // syncXhr=()
    },
  })
);

app.get(PREFIX + '/ping', (req, res) => {
  res.json({
    ok: true,
    msg: 'Plural Test',
    date: new Date(),
  });
});

const apiPrefix = '/api';
app.use('/healthcheck', HealthCheck);
app.use(PREFIX + apiPrefix + '/auth', AuthRoutes);
app.use(PREFIX + apiPrefix + '/tasks', TasksRoutes);
app.use(PREFIX + apiPrefix + '/reports', ReportRoutes);
app.use(PREFIX + apiPrefix + '/notifications', NotificationsRoutes);

export default app;
