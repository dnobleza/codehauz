const app = require('./app');
const config = require('./config/env');
const logger = require('./utils/logger');

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`core-service is running on http://localhost:${PORT}`);
});
