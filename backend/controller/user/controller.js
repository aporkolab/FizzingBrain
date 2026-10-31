const userService = require('../../services/user.service');
const createError = require('http-errors');
const asyncHandler = require('express-async-handler');
const { toHttpError } = require('../base/controller');

const handle = (fn) => asyncHandler(async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (err) {
    next(toHttpError(err));
  }
});

const findAll = handle(async (req, res) => {
  res.json(await userService.getAllUsers(req.query));
});

const findOne = handle(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    throw new createError.NotFound('User not found');
  }
  res.json(user);
});

const create = handle(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
});

const update = handle(async (req, res) => {
  res.json(await userService.updateUser(req.params.id, req.body));
});

const deleteOne = handle(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(204).end();
});

module.exports = {
  findAll,
  findOne,
  create,
  update,
  deleteOne,
};
