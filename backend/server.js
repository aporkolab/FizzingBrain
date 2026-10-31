const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const logger = require('./logger/logger');
const config = require('./config');
const authenticateJwt = require('./model/auth/authenticate');

const app = express();

// Cross Origin Resource Sharing: restrict with CORS_ORIGIN (comma separated) in production.
app.use(cors({ origin: config.corsOrigin }));

// Request logging through the application logger
app.use(morgan('combined', {
	stream: {
		write: message => logger.info(message.trim())
	}
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define routes
app.use('/question', require('./controller/question/router'));
app.use('/user', authenticateJwt, require('./controller/user/router'));
app.use('/login', require('./controller/login/router'));

app.get('/', (req, res) => {
	res.send('Üdvözöljük a Fizzingbrain v.1.0.0 backend oldalon!');
});

app.use((req, res, next) => {
	next(createError(404, `Cannot ${req.method} ${req.path}`));
});

// Error handling: keep client errors, hide the details of unexpected ones.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	const status = err.status || err.statusCode || 500;
	if (status >= 500) {
		logger.error(err.stack || err.message);
	}
	res.status(status).json({
		hasError: true,
		message: status >= 500 ? 'Internal server error' : err.message,
	});
});

module.exports = app;
