require('dotenv').config({ quiet: true });

const isTest = process.env.NODE_ENV === 'test';

const parseOrigins = (value) => {
	if (!value || value.trim() === '*') {
		return '*';
	}
	return value.split(',').map(origin => origin.trim()).filter(Boolean);
};

const jwtSecret = process.env.JWT_SECRET || (isTest ? 'test-only-secret' : undefined);

module.exports = {
	port: Number(process.env.PORT) || 3000,
	jwt: {
		secret: jwtSecret,
		expiresIn: process.env.JWT_EXPIRES_IN || '1h',
	},
	corsOrigin: parseOrigins(process.env.CORS_ORIGIN),
	seedDatabase: process.env.SEED_DATABASE === 'true',
	/** Fails fast on start-up instead of signing tokens with an undefined secret. */
	assertRuntimeConfig() {
		if (!jwtSecret) {
			throw new Error('JWT_SECRET environment variable is required.');
		}
	},
};
