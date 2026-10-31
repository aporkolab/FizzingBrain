const jwt = require('jsonwebtoken');
const config = require('../../config');

const tokenFor = (payload = { id: 1, email: 'admin@example.com' }, options = { expiresIn: '1h' }) =>
  jwt.sign(payload, config.jwt.secret, options);

const bearer = (token = tokenFor()) => `Bearer ${token}`;

module.exports = { tokenFor, bearer };
