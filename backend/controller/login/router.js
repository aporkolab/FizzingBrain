const express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../../model');
const config = require('../../config');

const router = express.Router();

const invalidCredentials = (res) => res.status(401).json({
	error: [{
		msg: 'Invalid credentials'
	}]
});

router.post('/', asyncHandler(async (req, res) => {
	const { email, password } = req.body || {};
	if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
		return res.status(400).json({
			error: [{
				msg: 'Email and password are required'
			}]
		});
	}

	const user = await User.findOne({ where: { email } });
	// Same answer for an unknown e-mail and a wrong password: no account enumeration.
	if (!user || !(await user.validPassword(password))) {
		return invalidCredentials(res);
	}

	const accessToken = jwt.sign({ id: user.id, email: user.email }, config.jwt.secret, {
		expiresIn: config.jwt.expiresIn,
	});

	res.json({
		success: true,
		accessToken,
		user: {
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
		}
	});
}));

module.exports = router;
