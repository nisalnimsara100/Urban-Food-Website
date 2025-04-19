const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Get cart by user ID
router.get('/user/:user_id', cartController.getCartByUser);

// Create a new cart
router.post('/', cartController.addCart);

// Add item to cart
router.post('/add-item', cartController.addCartItem);

// Get cart items
router.get('/:cart_id', cartController.getCartItems);

// Get cart item count
router.get('/count/:user_id', cartController.getCartCount);

// Update cart item quantity
router.put('/update-item', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove-item/:cart_id/:item_id', cartController.deleteCartItem);

module.exports = router;