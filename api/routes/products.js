const express = require('express');
const router = express.Router();
const multer = require('multer');

const ProductsController = require('../Controllers/productsController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG or PNG allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProductsController.get_all_products);

router.post('/create', ProductsController.create_product);

router.get('/:productId', ProductsController.get_product);

router.patch('/:productId', ProductsController.update_product);

module.exports = router;