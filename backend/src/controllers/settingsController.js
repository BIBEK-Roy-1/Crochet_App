const SiteSettings = require("../models/SiteSettings");

// ============================================
// GET SITE SETTINGS
// ============================================

const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
      .populate("highlightedProduct");

    // Create settings document if one doesn't exist
    if (!settings) {
      settings = await SiteSettings.create({
        highlightedProduct: null,
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch site settings",
      error: error.message,
    });
  }
};

// ============================================
// UPDATE HIGHLIGHTED PRODUCT
// ============================================

const updateSettings = async (req, res) => {
  try {
    const { highlightedProduct } = req.body;

    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    settings.highlightedProduct =
      highlightedProduct || null;

    await settings.save();

    settings = await SiteSettings.findById(settings._id)
      .populate("highlightedProduct");

    res.status(200).json({
      success: true,
      message: "Site settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};