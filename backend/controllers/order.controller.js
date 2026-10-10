const mongoose = require('mongoose');
const crypto = require('crypto');
const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const razorpay = require('../config/razorpay');

const validateShippingAddress = (address) => {
  if (!address || typeof address !== 'object') {
    return 'Shipping address is required';
  }
  const { fullName, phone, addressLine1, city, state, pincode } = address;
  if (!fullName || !fullName.trim()) return 'Full Name is required';
  if (!phone || !phone.trim()) return 'Phone number is required';
  if (!/^\d{10}$/.test(phone.trim())) return 'Phone must contain a valid 10-digit number';
  if (!addressLine1 || !addressLine1.trim()) return 'Address Line is required';
  if (!city || !city.trim()) return 'City is required';
  if (!state || !state.trim()) return 'State is required';
  if (!pincode || !pincode.trim()) return 'Pincode is required';
  if (!/^\d{6}$/.test(pincode.trim())) return 'Pincode must contain 6 digits';
  return null;
};

const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const validationError = validateShippingAddress(shippingAddress);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const customer = await Customer.findById(req.user._id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart cannot be empty' });
    }

    const productIds = customer.cart.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map();
    products.forEach((p) => productMap.set(p._id.toString(), p));

    for (const item of customer.cart) {
      const product = productMap.get(item.product.toString());
      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products in your cart are no longer available'
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`
        });
      }
    }

    let totalAmount = 0;
    const orderItems = customer.cart.map((item) => {
      const product = productMap.get(item.product.toString());
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      };
    });

    const shopKartOrder = new Order({
      user: customer._id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine1: shippingAddress.addressLine1.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim()
      },
      totalAmount,
      paymentStatus: 'PENDING',
      status: 'PENDING_PAYMENT'
    });

    await shopKartOrder.save();

    const amountInPaise = Math.round(totalAmount * 100);
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: shopKartOrder._id.toString()
    });

    shopKartOrder.razorpayOrderId = razorpayOrder.id;
    await shopKartOrder.save();

    return res.status(200).json({
      success: true,
      shopKartOrderId: shopKartOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating payment order'
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!shopKartOrderId || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification details'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shopKartOrderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to order' });
    }

    const body = order.razorpayOrderId + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'FAILED';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    order.paymentStatus = 'PAID';
    order.status = 'PLACED';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    const customer = await Customer.findById(req.user._id);
    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order placed successfully',
      order
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying payment'
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching orders'
    });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this order' });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching order'
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['PENDING_PAYMENT', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating status'
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getUserOrders,
  getOrderById,
  updateOrderStatus
};
