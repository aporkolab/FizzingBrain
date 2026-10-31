const userRepository = require('../repositories/user.repository');

// Password hashing lives in the User model hooks; hashing here as well would store a hash of the hash.

const getAllUsers = (params) => userRepository.findAll(params);

const getUserById = (id) => userRepository.findById(id);

const createUser = (userData) => userRepository.create(userData);

const updateUser = (id, userData) => {
  const dataToSave = { ...userData };
  // An empty password field means "keep the current password".
  if (!dataToSave.password) {
    delete dataToSave.password;
  }
  delete dataToSave.id;
  return userRepository.update(id, dataToSave);
};

const deleteUser = (id) => userRepository.deleteById(id);

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
