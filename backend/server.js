const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const logger = require('./logger/logger');

const app = express();

// Cross Origin Resource Sharing
app.use(cors());

// Morgan middleware - log kérések a logger segítségével
app.use(morgan('combined', {
	stream: {
		write: message => logger.info(message.trim())
	}
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(express.json());

const authenticateJwt = require('./model/auth/authenticate');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const swaggerDocument = YAML.parse(fs.readFileSync(path.join(__dirname, 'swagger.yaml'), 'utf8'));

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define routes
app.use('/question', require('./controller/question/router'));
app.use('/user', authenticateJwt, require('./controller/user/router'));
app.use('/login', require('./controller/login/router'));

// Root route - az összes route kezelése után
app.use('/', (req, res, next) => {
	logger.info(`Request to ${req.url}`);
	res.send('Üdvözöljük a Fizzingbrain v.1.0.0 backend oldalon!');
});

// Error handling - az összes route kezelése után
app.use((err, req, res, next) => {
	logger.error(`Error: ${err.message}`);
	res.status(500).json({
		hasError: true,
		message: err.message,
	});
});

module.exports = app;