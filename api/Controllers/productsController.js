const product = require('../models/product');
const Product = require('../models/product');
const mongoose = require('mongoose');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'csmanqka1',
    database: 'restfullapi',
});

exports.get_all_products = (req, res, next) => {
    const sql = 'SELECT * FROM products';
    connection.query(sql, (err, results, fields) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json(results);
    });
};

exports.get_product = (req, res, next) => {
    const id = req.params.productId;
    const sql = 'SELECT * FROM products WHERE id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(result[0]);
    });
};

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const { name, price } = req.body;
    const sql = 'UPDATE products SET name=?, price=? WHERE id=?';
    connection.execute(sql, [name, price, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
};

exports.create_product = (req, res, next) => {
    const { name, price } = req.body;
    const sql = 'INSERT INTO products (name, price) VALUES (?, ?)';
    connection.execute(sql, [name, price], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({
            message: 'Product created successfully',
            createdProduct: {
                id: result.insertId,
                name,
                price
            }
        });
    });
};

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    const sql = 'DELETE FROM products WHERE id = ?';
    connection.execute(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    });
};