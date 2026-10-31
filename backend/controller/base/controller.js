const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const sequelizeService = require('./service');

const toHttpError = (err) => {
	if (err.message === 'Not found') {
		return new createError.NotFound('Entity not found');
	}
	if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
		return new createError.BadRequest(err.errors?.map(e => e.message).join(', ') || err.message);
	}
	return err;
};

module.exports = (model, populateList = []) => {
	const service = sequelizeService(model, populateList);

	const handle = (fn) => asyncHandler(async (req, res, next) => {
		try {
			await fn(req, res);
		} catch (err) {
			next(toHttpError(err));
		}
	});

	return {
		findAll: handle(async (req, res) => {
			res.json(await service.findAll(req.query));
		}),

		findOne: handle(async (req, res) => {
			const entity = await service.findOne(req.params.id);
			if (!entity) {
				throw new Error('Not found');
			}
			res.json(entity);
		}),

		findRandom: handle(async (req, res) => {
			const entities = await service.findRandom();
			if (!entities.length) {
				throw new createError.NotFound('No entities found');
			}
			res.json(entities);
		}),

		replace: handle(async (req, res) => {
			res.json(await service.replace(req.params.id, req.body));
		}),

		update: handle(async (req, res) => {
			res.json(await service.update(req.params.id, req.body));
		}),

		create: handle(async (req, res) => {
			res.status(201).json(await service.create(req.body));
		}),

		delete: handle(async (req, res) => {
			await service.delete(req.params.id);
			res.status(204).end();
		}),
	};
};

module.exports.toHttpError = toHttpError;
