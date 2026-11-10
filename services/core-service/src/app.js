const express = require('express');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requsetLogger');
const healthRoute = require('./routes/health.route');

const app = express();

app.use(requestLogger);
app.use(express.json());

app.use('/v1/health', healthRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
