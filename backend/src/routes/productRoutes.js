const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// --------------------------------------------
// PUBLIC ROUTES
// --------------------------------------------

// Anyone can view products
router.get("/", getProducts);

// Anyone can view a single product
router.get("/:id", getProductById);


// --------------------------------------------
// ADMIN ROUTES
// --------------------------------------------

// Create product
router.post("/", protect, createProduct);

// Update product
router.put("/:id", protect, updateProduct);

// Delete product
router.delete("/:id", protect, deleteProduct);

module.exports = router;