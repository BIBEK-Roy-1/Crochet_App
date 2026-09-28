import { authService } from "./authService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ============================================
// GENERIC API REQUEST
// ============================================

const request = async (endpoint, options = {}) => {
  const token = authService.getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add JWT when available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

// ============================================
// NORMALIZE PRODUCT
// ============================================

const normalizeProduct = (product) => ({
  ...product,

  id: product._id || product.id,

  collectionId:
    typeof product.collection === "object"
      ? product.collection?._id
      : product.collection ||
        product.collectionId,

  images: product.images || [],

  price: Number(product.price) || 0,
});

// ============================================
// NORMALIZE COLLECTION
// ============================================

const normalizeCollection = (collection) => ({
  ...collection,
  id: collection._id || collection.id,
});

// ============================================
// PRODUCT SERVICE
// ============================================

export const productService = {

  // ------------------------------------------
  // GET ALL PRODUCTS
  // ------------------------------------------

  async getProducts() {
    const data = await request("/products");

    return data.products.map(normalizeProduct);
  },

  // ------------------------------------------
  // GET SINGLE PRODUCT
  // ------------------------------------------

  async getProductById(id) {
    const data = await request(
      `/products/${id}`
    );

    return normalizeProduct(data.product);
  },

  // ------------------------------------------
  // ADD PRODUCT
  // ------------------------------------------

  async addProduct(productData) {
    const payload = {
      title: productData.title,

      subtitle:
        productData.subtitle || "",

      price: Number(
        String(productData.price).replace(
          /[^\d.-]/g,
          ""
        )
      ),

      images: productData.images || [],

      description:
        productData.description || "",

      tag: productData.tag || "",

      collection:
        productData.collectionId ||
        productData.collection,
    };

    const data = await request(
      "/products",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    return normalizeProduct(data.product);
  },

  // ------------------------------------------
  // UPDATE PRODUCT
  // ------------------------------------------

  async updateProduct(id, productData) {
    const payload = {
      title: productData.title,

      subtitle:
        productData.subtitle || "",

      price: Number(
        String(productData.price).replace(
          /[^\d.-]/g,
          ""
        )
      ),

      images: productData.images || [],

      description:
        productData.description || "",

      tag: productData.tag || "",

      collection:
        productData.collectionId ||
        productData.collection,
    };

    const data = await request(
      `/products/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );

    return normalizeProduct(data.product);
  },

  // ------------------------------------------
  // DELETE PRODUCT
  // ------------------------------------------

  async deleteProduct(id) {
    return request(
      `/products/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // ==========================================
  // COLLECTIONS
  // ==========================================

  // GET COLLECTIONS

  async getCollections() {
    const data = await request(
      "/collections"
    );

    return data.collections.map(
      normalizeCollection
    );
  },

  // ADD COLLECTION

  async addCollection(name) {
    const data = await request(
      "/collections",
      {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
      }
    );

    return normalizeCollection(
      data.collection
    );
  },

  // UPDATE COLLECTION

  async updateCollection(id, name) {
    const data = await request(
      `/collections/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name,
        }),
      }
    );

    return normalizeCollection(
      data.collection
    );
  },

  // DELETE COLLECTION

  async deleteCollection(id) {
    return request(
      `/collections/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // ==========================================
// SITE SETTINGS
// ==========================================

// GET SETTINGS
async getSettings() {
  const data = await request("/settings");

  return {
    highlightedProductId:
      data.settings.highlightedProduct?._id || null,
  };
},

// UPDATE SETTINGS
async updateSettings(data) {
  const response = await request("/settings", {
    method: "PUT",

    body: JSON.stringify({
      highlightedProduct:
        data.highlightedProductId || null,
    }),
  });

  return {
    highlightedProductId:
      response.settings.highlightedProduct?._id ||
      null,
  };
},
};