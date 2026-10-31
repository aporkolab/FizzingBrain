const express = require('express');
const router = express.Router();
const userController = require('./controller');

// Read
router.get('/', userController.findAll);
router.get('/:id', userController.findOne);

// Create
router.post('/', userController.create);

// Update
router.put('/:id', userController.update);
router.patch('/:id', userController.update);

// Delete
router.delete('/:id', userController.deleteOne);

module.exports = router;