const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// ============================================
// PUBLIC
// ============================================

// Get homepage settings
router.get("/", getSettings);

// ============================================
// ADMIN ONLY
// ============================================

// Update homepage highlighted product
router.put("/", protect, updateSettings);

module.exports = router;