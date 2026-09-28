const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");

// ============================================
// CREATE WHATSAPP ORDER
// ============================================

const createWhatsAppOrder = async (req, res) => {
  try {
    const { items } = req.body;

    // -----------------------------------------
    // Validate items
    // -----------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    // -----------------------------------------
    // Validate product IDs and quantities
    // -----------------------------------------

    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1",
        });
      }
    }

    // -----------------------------------------
    // Get products from MongoDB
    // -----------------------------------------

    const productIds = items.map(
      (item) => item.productId
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    // -----------------------------------------
    // Make sure every product exists
    // -----------------------------------------

    if (products.length !== items.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products were not found",
      });
    }

    // -----------------------------------------
    // Build order items
    // -----------------------------------------

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = products.find(
        (product) =>
          product._id.toString() ===
          item.productId.toString()
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const itemTotal =
        product.price * item.quantity;

      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // -----------------------------------------
    // Create order
    // -----------------------------------------

    const order = await Order.create({
      items: orderItems,

      totalAmount,

      orderType: "whatsapp",

      status: "pending",
    });

    // -----------------------------------------
    // Response
    // -----------------------------------------

    res.status(201).json({
      success: true,
      message: "WhatsApp order created successfully",

      order: {
        id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        orderType: order.orderType,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Create WhatsApp order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ============================================
// GET ALL ORDERS
// ============================================

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "title images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ============================================
// GET SINGLE ORDER
// ============================================

const getOrderById = async (req, res) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(
      req.params.id
    ).populate(
      "items.product",
      "title images price"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

module.exports = {
  createWhatsAppOrder,
  getOrders,
  getOrderById,
};