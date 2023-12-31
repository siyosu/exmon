const createHttpError = require('http-errors');
const { env } = require('../config');

const notFound = (req, res, next) => {
	next(createHttpError(404, 'Resource not found!'));
};

const globalErrorHandler = (e, req, res, next) => {
	let status = e.status || 500;
	const response = {
		success: false,
		message: e.message || 'Unknown error occurred.',
	};

	const addErrorStack = env.NODE_ENV === 'development' && e.stack;
	if (addErrorStack) response.stack = e.stack;

	res.status(status).send(response);
};

module.exports = {
	notFound,
	globalErrorHandler,
};
