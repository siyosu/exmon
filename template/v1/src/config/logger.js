const winston = require('winston');
require('winston-mongodb');
const env = require('./env');

const { createLogger, format, transports } = winston;
const { colorize, combine, errors, json, metadata, timestamp, printf } = format;

const mongoDbTransport = new transports.MongoDB({
	level: 'info',
	format: combine(timestamp(), metadata({ fillWith: ['service', 'details'] }), json()),
	db: env.MONGODB_URI,
	options: {
		useUnifiedTopology: true,
	},
});

const buildDevLogger = () =>
	createLogger({
		level: 'debug',
		format: combine(
			colorize(),
			errors({ stack: true }),
			timestamp({ format: 'YYYY:MM:DD HH:mm:ss' }),
			printf(({ timestamp, level, message, stack }) => {
				return `(${timestamp})[${level}]: ${stack || message}`;
			})
		),
		transports: [new transports.Console()],
	});

const buildProdLogger = () => createLogger({ transports: [mongoDbTransport] });

const logger = env.NODE_ENV === 'development' ? buildDevLogger() : buildProdLogger();

module.exports = logger;
