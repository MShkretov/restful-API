const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/usersController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/', authMiddleware.verifyToken, UserController.get_all_users);

router.post('/signup', UserController.signup_user);

router.post('/login', UserController.login_user);

router.get('/:userId', authMiddleware.verifyToken, UserController.get_user_by_id);

router.patch('/:userId', authMiddleware.verifyToken, UserController.update_user);

router.delete('/:userId', authMiddleware.verifyToken, UserController.delete_user);

module.exports = router;