const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../../config');

/**
 * Express middleware that accepts only requests carrying a valid
 * "Authorization: Bearer <jwt>" header and exposes the token payload as req.user.
 */
module.exports = (req, res, next) => {
	const header = req.headers.authorization || '';
	const [scheme, token] = header.split(' ');
	if (scheme !== 'Bearer' || !token) {
		return next(createError(401, 'Missing bearer token'));
	}

	try {
		req.user = jwt.verify(token, config.jwt.secret);
		return next();
	} catch (err) {
		return next(createError(401, 'Invalid or expired token'));
	}
};
