const express = require('express');
const router = express.Router();
const {authMiddleware,authorize} = require('../middlewares/authMiddleware');
const cart = require('../controllers/cartController');

router.post('/addto-cart/:bookId',authMiddleware,  cart.addToCart);
router.delete('/removefrom-cart/:bookId',authMiddleware,   cart.removeFromCart);
router.get('/checkout/:bookId',authMiddleware,  cart.checkout);
router.get('/get-cart',authMiddleware,  cart.getCart);
router.get('/get-cart-admin/:userId',authMiddleware,authorize(["admin"]),  cart.getCartAdmin);



module.exports = router;