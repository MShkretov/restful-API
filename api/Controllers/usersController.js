const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'csmanqka1',
    database: 'restfullapi',
});

const jwtSecret = process.env.JWT_SECRET;

exports.get_all_users = (req, res, next) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql, (err, results, fields) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching users' });
        }
        res.status(200).json(results);
    });
};

exports.signup_user = (req, res, next) => {
    const { email, password, firstName, lastName, age, country, city } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            const sql = 'INSERT INTO users (email, password, firstName, lastName, age, country, city) VALUES (?, ?, ?, ?, ?, ?, ?)';
            connection.execute(sql, [email, hash, firstName, lastName, age, country, city], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    res.status(201).json({
                        message: 'User created successfully',
                        createdUser: {
                            id: result.insertId,
                            email,
                            firstName,
                            lastName,
                            age,
                            country,
                            city
                        }
                    });
                }
            });
        }
    });
};

exports.update_user = (req, res, next) => {
    const id = req.params.userId;
    const { email, password, firstName, lastName, age, country, city } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        } else {
            const sql = 'UPDATE users SET email=?, password=?, firstName=?, lastName=?, age=?, country=?, city=? WHERE id=?';
            connection.execute(sql, [email, hash, firstName, lastName, age, country, city, id], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err });
                } else {
                    res.status(200).json({
                        message: 'User updated',
                        updatedUser: {
                            id,
                            email,
                            firstName,
                            lastName,
                            age,
                            country,
                            city
                        }
                    });
                }
            });
        }
    });
};

exports.login_user = (req, res, next) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.execute(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.length === 0) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            const token = jwt.sign(
                {
                    email: result[0].email,
                    userId: result[0].id
                },
                'miro',
                {
                    expiresIn: '1h'
                }
            );
            res.status(200).json({ message: 'Authentication successful', token: token });
        });
    });
};

exports.get_user_by_id = (req, res, next) => {
    const id = req.params.userId;
    const sql = 'SELECT * FROM users WHERE id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result[0]);
    });
};

exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    const sql = 'DELETE FROM users WHERE id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
};