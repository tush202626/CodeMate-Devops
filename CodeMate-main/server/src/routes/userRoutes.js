const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get User by ID
router.get('/:id', authMiddleware.authenticate, userController.getUserById);

// Get User by Username
router.get('/username/:username', authMiddleware.authenticate, userController.getUserByUsername);

module.exports = router;