import { Logger } from 'winston';
import app from './src/config/app';

import { logger } from './src/config/logger/logger';
import { SwaggerSpec } from './src/config/swagger/swagger';
import { HandlerException } from './src/config/handlerException/handlerException';

const port = process.env.PORT || 3000;

declare global {
	var log: Logger;
}

global.log = logger;

app.use(HandlerException);

SwaggerSpec(app);

app.listen(port, () => {
	log.info(`[server]: Server is running at http://localhost:${port}`);
});
