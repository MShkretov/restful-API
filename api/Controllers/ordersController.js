const order = require('../models/order');
const Order = require('../models/order');
const product = require('../models/product');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
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

exports.create_order = (req, res, next) => {
    const productId = req.body.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: 'Invalid productId' });
    }

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: productId
            });

            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order created successfully',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.get_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('product quantity _id')
        .populate('product')
        .exec()
        .then(order => {
            if (order) {
                res.status(200).json({
                    order: order,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders'
                    }
                });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.update_order = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Order.findByIdAndUpdate(id, { $set: updateOps }, { new: true })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: 'Order updated',
                    updatedOrder: result,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                });
            } else {
                res.status(404).json({ message: 'Order not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
};