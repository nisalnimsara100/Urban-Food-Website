// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.get('/email', userController.getUserByEmail);

module.exports = router;