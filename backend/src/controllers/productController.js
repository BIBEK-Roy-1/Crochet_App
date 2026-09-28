const Product = require("../models/Product");
const Collection = require("../models/Collection");

// ============================================
// GET ALL PRODUCTS
// ============================================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("collection", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// ============================================
// GET SINGLE PRODUCT
// ============================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("collection", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// ============================================
// CREATE PRODUCT
// ============================================
const createProduct = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      price,
      images,
      description,
      tag,
      collection,
    } = req.body;

    // -----------------------------
    // Basic validation
    // -----------------------------
    if (
      !title ||
      price === undefined ||
      !images ||
      images.length === 0 ||
      !description ||
      !collection
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, price, at least one image, description and collection are required",
      });
    }

    // -----------------------------
    // Check collection
    // -----------------------------
    const existingCollection = await Collection.findById(
      collection
    );

    if (!existingCollection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    // -----------------------------
    // Create product
    // -----------------------------
    const product = await Product.create({
      title,
      subtitle,
      price,
      images,
      description,
      tag,
      collection,
    });

    // Get collection information too
    const populatedProduct = await Product.findById(
      product._id
    ).populate("collection", "name");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE PRODUCT
// ============================================
const updateProduct = async (req, res) => {
  try {
    const { collection } = req.body;

    // -----------------------------
    // If collection is being changed,
    // verify the new collection
    // -----------------------------
    if (collection) {
      const existingCollection =
        await Collection.findById(collection);

      if (!existingCollection) {
        return res.status(404).json({
          success: false,
          message: "Collection not found",
        });
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("collection", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// ============================================
// DELETE PRODUCT
// ============================================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};