const express = require("express");

const {
  createWhatsAppOrder,
  getOrders,
  getOrderById,
} = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// ============================================
// CUSTOMER
// ============================================

// Create a WhatsApp order
router.post("/whatsapp", createWhatsAppOrder);


// ============================================
// ADMIN ONLY
// ============================================

// Get all orders
router.get("/", protect, getOrders);

// Get one order
router.get("/:id", protect, getOrderById);

module.exports = router;