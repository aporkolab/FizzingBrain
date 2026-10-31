const { Op } = require('sequelize');

/**
 * Turns query string parameters into a LIKE filter, ignoring keys that are not
 * attributes of the model (an unknown column would otherwise end in a SQL error).
 */
const buildSearchWhere = (model, params = {}) => {
	const attributes = model.getAttributes();
	const where = {};
	for (const [key, value] of Object.entries(params)) {
		if (Object.hasOwn(attributes, key) && key !== 'password' && typeof value === 'string') {
			where[key] = {
				[Op.like]: `%${value}%`
			};
		}
	}
	return where;
};

module.exports = { buildSearchWhere };
