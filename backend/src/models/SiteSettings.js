const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    highlightedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model(
  "SiteSettings",
  siteSettingsSchema
);

module.exports = SiteSettings;