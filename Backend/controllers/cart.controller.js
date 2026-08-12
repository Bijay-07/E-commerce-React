const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

// Helper to recalculate total price
const calculateTotal = (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Only the cart's owner (or an admin) may read/modify it
const isOwnerOrAdmin = (req) =>
  req.user._id.toString() === req.params.userId || req.user.role === 'admin';

//Get logged in user cart (By ID)
exports.getCart = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this cart' });
    }

    const cart = await Cart.findOne({ user: req.params.userId }).populate(
      'items.product',
      'name images price'
    );
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Add item in Cart or Create the Cart if it doesn't exist
exports.addItemToCart = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this cart' });
    }

    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Update the quantity of cart item
exports.updateCartItem = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this cart' });
    }

    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Remove Item From Cart
exports.removeItemFromCart = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this cart' });
    }

    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    cart.totalPrice = calculateTotal(cart.items);
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Clear entire Cart
exports.clearCart = async (req, res) => {
  try {
    if (!isOwnerOrAdmin(req)) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this cart' });
    }

    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};