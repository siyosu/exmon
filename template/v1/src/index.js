const express = require('express');
const morgan = require('morgan');
const { env } = require('./config');
require('./config/db');
const { globalErrorHandler, notFound } = require('./middleware/error');
const routes = require('./routes');

const app = express();

const morganFormat = env.NODE_ENV === 'development' ? 'dev' : 'combined';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(morganFormat));
app.use(routes);
app.use(notFound);
app.use(globalErrorHandler);

app.listen(env.PORT, () =>
	console.log(`Successfully running in ${env.NODE_ENV} mode on port ${env.PORT}.`)
);
