const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const authRoutes = require("./routes/authRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// ============================================
// TEST ROUTE
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Meghla Crochet API is running",
  });
});

// ============================================
// API ROUTES
// ============================================

app.use("/api/products", productRoutes);

app.use(
  "/api/collections",
  collectionRoutes
);

app.use("/api/auth", authRoutes);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

module.exports = app;