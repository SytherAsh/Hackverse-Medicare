const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  description: String,
  image: String,
  stock: Number,
  rating: Number,
});

module.exports = mongoose.model('Product', productSchema);
