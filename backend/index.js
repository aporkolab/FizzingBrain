const logger = require('./logger/logger');
const config = require('./config');
const app = require('./server');

config.assertRuntimeConfig();
const port = config.port;

app.listen(port, () => {
	logger.info(`Server is running on port ${port}`);
});