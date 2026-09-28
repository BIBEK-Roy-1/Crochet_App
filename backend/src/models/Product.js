const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (images) {
          return images.length > 0;
        },
        message: "At least one product image is required",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    tag: {
      type: String,
      trim: true,
      default: "",
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;