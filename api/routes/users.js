const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/usersController.js');

router.get('/', UserController.get_all_users);

router.post('/signup', UserController.signup_user);

router.post('/login', UserController.login_user);

router.get('/:userId', UserController.get_user_by_id);

router.patch('/:userId', UserController.update_user);

router.delete('/:userId', UserController.delete_user);

module.exports = router;