const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.get_all_users = (req, res, next) => {
    User.find()
        .select('_id name email')
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(user => {
                    return {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/users/' + user._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.signup_user = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (user) {
                return res.status(409).json({
                    message: 'Email already exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ error: err });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created successfully',
                                    createdUser: {
                                        _id: result._id,
                                        email: result.email,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:3000/users/' + result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.login_user = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Authentication failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err || !result) {
                    return res.status(401).json({
                        message: 'Authentication failed'
                    });
                }
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user._id
                    },
                    'secret_key',
                    {
                        expiresIn: '1h'
                    }
                );
                res.status(200).json({
                    message: 'Authentication successful',
                    token: token
                });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.get_user_by_id = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .select('_id name email')
        .exec()
        .then(user => {
            if (user) {
                res.status(200).json({
                    user: user,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/users'
                    }
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/users/signup',
                    body: { name: 'String', email: 'String' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};