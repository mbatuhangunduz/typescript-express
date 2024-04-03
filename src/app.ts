import 'dotenv/config';
/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { Server, createServer } from 'http';
// import { corsAllowedOrigins } from '@kobil/wallet-db-redis-utilities/lib/config/envVariables';
// import { NotFoundError, ApiError, InternalError } from '@kobil/wallet-db-redis-utilities/lib/core/ApiError';
// import routes from './routes';
import helmet from 'helmet';
// import { StaticOrigin } from '@kobil/wallet-db-redis-utilities/src/types/allRequestTypes';
import winston from 'winston';
// import { log, logger } from '@kobil/wallet-db-redis-utilities/lib/utils/logger';
import schedule from 'node-schedule';
import { log } from './helpers/logger';

process.on('uncaughtException', (e: any) => {
	log.error("uncaughtException" + e?.message || e);
});


process.on('SIGINT', () => {
	schedule.gracefulShutdown().then(() => process.exit(0));
});

const app = express();
const corsAllowedOrigins: string = '*';

// create http server and wrap the express app
const httpServer: Server = createServer(app);

type StaticOrigin =
  | boolean
  | string
  | RegExp
  | (boolean | string | RegExp)[];


app.use(helmet()); // set security HTTP headers

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(
	cors({
		origin: (_: string | undefined, callback: (err: Error | null, origin?: StaticOrigin | undefined) => void) => {
			if (corsAllowedOrigins?.split(',').includes('*')) {
				callback(null, '*');
			} else {
				callback(null, corsAllowedOrigins?.split(','));
			}
		},
		optionsSuccessStatus: 200,
	}),
);


export default httpServer;
