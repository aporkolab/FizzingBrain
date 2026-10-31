const { User } = require('../model');
const { buildSearchWhere } = require('../controller/base/search');

const findAll = async (params = {}) => User.findAll({ where: buildSearchWhere(User, params) });

const findById = (id) => User.findByPk(id);

const create = (userData) => User.create(userData);

const update = async (id, updateData) => {
  // individualHooks runs the beforeUpdate hook, which hashes a changed password.
  const [updatedRows] = await User.update(updateData, { where: { id }, individualHooks: true });
  if (updatedRows === 0) {
    throw new Error('Not found');
  }
  return findById(id);
};

const deleteById = async (id) => {
  const result = await User.destroy({ where: { id } });
  if (!result) {
    throw new Error('Not found');
  }
  return result;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById,
};
