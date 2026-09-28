const Collection = require("../models/Collection");

// ============================================
// GET ALL COLLECTIONS
// ============================================
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: collections.length,
      collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch collections",
      error: error.message,
    });
  }
};

// ============================================
// GET SINGLE COLLECTION
// ============================================
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(
      req.params.id
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch collection",
      error: error.message,
    });
  }
};

// ============================================
// CREATE COLLECTION
// ============================================
const createCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required",
      });
    }

    const existingCollection = await Collection.findOne({
      name: name.trim(),
    });

    if (existingCollection) {
      return res.status(409).json({
        success: false,
        message: "Collection already exists",
      });
    }

    const collection = await Collection.create({
      name: name.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    // MongoDB duplicate key protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Collection already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create collection",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE COLLECTION
// ============================================
const updateCollection = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Collection name is required",
      });
    }

    const existingCollection = await Collection.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });

    if (existingCollection) {
      return res.status(409).json({
        success: false,
        message: "Collection already exists",
      });
    }

    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update collection",
      error: error.message,
    });
  }
};

// ============================================
// DELETE COLLECTION
// ============================================
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(
      req.params.id
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete collection",
      error: error.message,
    });
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};