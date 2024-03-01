const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');

const Order = require('../models/order');
const Product = require('../models/product');

const OrdersController = require('../Controllers/ordersController');

router.use(authMiddleware.verifyToken);

router.get('/', OrdersController.get_all);

router.post('/', OrdersController.create_order);

router.get('/:orderId', OrdersController.get_order);

router.patch('/:orderId', OrdersController.update_order);

router.delete('/:orderId', OrdersController.delete_order);

module.exports = router;