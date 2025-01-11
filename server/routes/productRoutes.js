const express = require('express');
const Product = require('../models/productModel');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a new product
router.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

module.exports = router;
