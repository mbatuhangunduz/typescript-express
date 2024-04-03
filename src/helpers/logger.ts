import { transports, format, createLogger } from 'winston';

const { combine } = format;

const errorFilter = format((info) => (info.level === 'error' ? info : false))();

const infoFilter = format((info) => (info.level === 'info' ? info : false))();

const warnFilter = format((info) => (info.level === 'warn' ? info : false))();

const _format = format.combine(
	format.colorize(),
	format.splat(),
	format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss',
	}),

	format.padLevels(),
	format.printf((info) => `${info.timestamp} ${info.level}${info.message}`),
);
const log = createLogger({
	level: 'debug',
	transports: [
		new transports.Console({ format: _format }),
		new transports.File({ filename: 'error.log', level: 'error', format: combine(errorFilter, _format) }),
		new transports.File({ filename: 'info.log', level: 'info', format: combine(infoFilter, _format) }),
		new transports.File({ filename: 'warn.log', level: 'warn', format: combine(warnFilter, _format) }),
	],
});

export { log };
