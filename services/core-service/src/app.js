const express = require('express');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requsetLogger');
const healthRoute = require('./routes/health.route');
const authRoute = require('./routes/auth.route');

const app = express();

app.use(requestLogger);
app.use(express.json());

app.use('/v1/health', healthRoute);
app.use('/v1/auth', authRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
