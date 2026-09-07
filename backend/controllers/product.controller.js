const Product = require('../models/product.model');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get All Products (with search, category, and sort)
exports.getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    
    // Build query
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }
    if (category) {
      query.category = category;
    }

    // Build sort options
    let sortOptions = {};
    if (sort === 'price_asc') {
      sortOptions.price = 1;
    } else if (sort === 'price_desc') {
      sortOptions.price = -1;
    } else {
      sortOptions.createdAt = -1; // Default to newest
    }

    const products = await Product.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    // If the ID is invalid, it throws a CastError
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
