const { buildSearchWhere } = require('./search');

module.exports = (model, populateList = []) => {
	const applyChanges = async (id, updateData) => {
		const entity = await model.findByPk(id);
		if (!entity) {
			throw new Error('Not found');
		}
		const { id: ignoredId, ...changes } = updateData;
		entity.set(changes);
		await entity.save();
		return model.findByPk(id, {
			include: populateList
		});
	};

	return {
		findAll: async (params = {}) => model.findAll({
			where: buildSearchWhere(model, params),
			include: populateList,
		}),

		findRandom: async (limit = 6) => model.findAll({
			order: model.sequelize.random(),
			limit,
			include: populateList,
		}),

		findOne: (id) => model.findByPk(id, {
			include: populateList,
		}),

		// PUT: replace the resource
		replace: applyChanges,

		// PATCH: partial update
		update: applyChanges,

		create: async (body) => {
			const { id, ...data } = body;
			return model.create(data);
		},

		delete: async (id) => {
			const result = await model.destroy({
				where: {
					id
				},
			});
			if (!result) {
				throw new Error('Not found');
			}
			return result;
		},
	};
};
