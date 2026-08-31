const Customer = require('../models/customer.model');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');

// @desc    Register a new customer
// @route   POST /customers/register
// @access  Public
const registerCustomer = async (req, res) => {
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: 'Please provide all required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  try {
    const customerExists = await Customer.findOne({ email });

    if (customerExists) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const customer = await Customer.create({
      fullName,
      email,
      password: hashedPassword,
      phone
    });

    if (customer) {
      res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
        customer: {
          _id: customer._id,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid customer data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Auth customer & get token
// @route   POST /customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });

    if (customer && bcrypt.compareSync(password, customer.password)) {
      const token = generateToken(customer._id);
      
      // Store the JWT inside an HttpOnly cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        success: true,
        message: 'Login successful'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get customer profile
// @route   GET /customers/me
// @access  Private
const getCustomerProfile = async (req, res) => {
  const customer = req.user; // attached by protect middleware

  if (customer) {
    res.json({
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone
    });
  } else {
    res.status(404).json({ success: false, message: 'Customer not found' });
  }
};

// @desc    Logout customer / clear cookie
// @route   POST /customers/logout
// @access  Private
const logoutCustomer = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Change Password
// @route   PATCH /customers/change-password
// @access  Private
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const customer = req.user;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide old and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const currentCustomer = await Customer.findById(customer._id);

    if (currentCustomer && bcrypt.compareSync(oldPassword, currentCustomer.password)) {
      currentCustomer.password = bcrypt.hashSync(newPassword, 10);
      await currentCustomer.save();
      
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid old password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  logoutCustomer,
  changePassword
};
