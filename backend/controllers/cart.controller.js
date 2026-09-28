const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

const getCart = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate('cart.product');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, cart: customer.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );
    const quantity = (cartItem?.quantity || 0) + 1;

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
    }

    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      customer.cart.push({ product: productId, quantity: 1 });
    }
    await customer.save();
    await customer.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: customer.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const quantity = req.body?.quantity;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ success: false, message: 'Quantity must be a number greater than or equal to 1' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const cartItem = customer.cart.find(
      (item) => item.product.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
    }

    cartItem.quantity = quantity;
    await customer.save();
    await customer.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: customer.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  try {
    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const hasCartItem = customer.cart.some(
      (item) => item.product.toString() === productId
    );
    if (!hasCartItem) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    customer.cart = customer.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await customer.save();
    await customer.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart: customer.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart
};
