# Meghla Crochet React Frontend

Complete React/Vite frontend for Meghla Crochet.

## Features
- Bengali-inspired Meghla branding
- Responsive navbar + custom logo
- Home hero with admin-controlled highlighted product
- Collection browsing and search
- Product details with multi-image gallery
- Quantity selector
- Add to Cart and Buy Now on product cards
- Cart drawer with quantity controls and Checkout
- Buy Now flow for one product or full cart
- Contact order form
- WhatsApp ordering with a pre-filled message
- Related products from the same collection
- Admin login/dashboard
- Add, edit, delete products
- Multiple product image URLs
- Product collections and collection creation/deletion
- Homepage highlighted product selection

## Run

```bash
npm install
npm run dev
```

### Demo admin
- Email: `admin@meghla.com`
- Password: `admin123`

## Backend-ready
`src/services/productService.js`, `authService.js`, and `orderService.js` are mock services. Replace their internals with Express/MongoDB/Gmail API calls later.

For WhatsApp, change `src/config/site.js` and set `whatsappNumber` to the business number with country code and no `+`, spaces, or dashes.
