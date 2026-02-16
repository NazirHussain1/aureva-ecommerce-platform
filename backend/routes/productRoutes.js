const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/multer');
const { protect, admin } = require('../middleware/authMiddleware');
const { validateProduct } = require('../middleware/validationMiddleware');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/suggestions', productController.getProductSuggestions);
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

router.post('/create', upload.single('image'), productController.createProduct);
router.post('/', protect, admin, upload.single('image'), validateProduct, productController.createProduct);
router.put('/:id', protect, admin, validateProduct, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
