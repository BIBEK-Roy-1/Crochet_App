const express = require("express");

const {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// --------------------------------------------
// PUBLIC ROUTES
// --------------------------------------------

// Anyone can view collections
router.get("/", getCollections);

// Anyone can view a single collection
router.get("/:id", getCollectionById);


// --------------------------------------------
// ADMIN ROUTES
// --------------------------------------------

// Create collection
router.post("/", protect, createCollection);

// Update collection
router.put("/:id", protect, updateCollection);

// Delete collection
router.delete("/:id", protect, deleteCollection);

module.exports = router;