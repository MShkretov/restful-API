const product = require('../models/product');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc.id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
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

exports.get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price')
        .exec()
        .then(product => {
            if (product) {
                res.status(200).json({
                    name: product.name,
                    price: product.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.findByIdAndUpdate(id, { $set: updateOps }, { new: true })
        .exec()
        .then(updatedProduct => {
            if (updatedProduct) {
                res.status(200).json({
                    message: 'Product updated successfully',
                    updatedProduct: updatedProduct
                });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.create_product = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};