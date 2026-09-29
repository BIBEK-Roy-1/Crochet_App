import { ArrowLeft, Minus, Plus, ShoppingBag, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function ProductDetails({ products, collections }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((item) => item.id === id);

  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <main className="min-h-screen pt-32 text-center">
        Product not found.
      </main>
    );
  }

  const images = product.images?.length ? product.images : [product.image];

  const collection = collections?.find(
    (c) => c.id === product.collectionId
  );

  const related = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.collectionId === product.collectionId
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#faf7f2] pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-[#64748b] hover:text-[#c05640]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Product Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Product Images */}
          <div>
            <div className="overflow-hidden rounded-3xl bg-white">
              <img
                src={images[selected]}
                alt={product.title}
                className="aspect-square w-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelected(index)}
                  className={`overflow-hidden rounded-2xl border-2 ${
                    index === selected
                      ? 'border-[#c05640]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">

            <p className="text-sm uppercase tracking-[0.2em] text-[#849b79]">
              {collection?.name || 'Meghla Collection'}
            </p>

            <h1 className="font-serif-custom mt-2 text-5xl font-bold">
              {product.title}
            </h1>

            <p className="mt-3 text-lg text-[#849b79]">
              {product.subtitle}
            </p>

            <p className="mt-6 text-3xl font-semibold text-[#c05640]">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <div className="mt-8 border-t border-[#ded2c8] pt-8">
              <h2 className="font-serif-custom text-2xl font-bold">
                About this piece
              </h2>

              <p className="mt-4 leading-8 text-[#64748b]">
                {product.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider">
                Quantity
              </p>

              <div className="inline-flex items-center rounded-full border border-[#d7c9bd] bg-white">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="p-3"
                >
                  <Minus className="h-4 w-4" />
                </button>

                <span className="min-w-10 text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex items-center justify-center gap-2 rounded-full border border-[#c05640] bg-white px-7 py-4 font-medium text-[#c05640] hover:bg-[#c05640] hover:text-white"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/buy-now/${product.id}?quantity=${quantity}`
                  )
                }
                className="flex items-center justify-center gap-2 rounded-full bg-[#c05640] px-7 py-4 font-medium text-white hover:bg-[#a64733]"
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </button>

            </div>

            {/*
              HEART / SAVE FOR LATER
              ---------------------
              Temporarily disabled.

              We can add this back later when
              user-specific login and wishlist
              functionality are implemented.

              <button
                className="mt-4 flex items-center gap-2 text-sm text-[#64748b] hover:text-[#c05640]"
              >
                <Heart className="h-4 w-4" />
                Save for later
              </button>
            */}

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-24 border-t border-[#ded2c8] pt-16">

            <h2 className="font-serif-custom text-4xl font-bold">
              Related Pieces
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="overflow-hidden rounded-3xl bg-white"
                >
                  <img
                    src={p.images?.[0]}
                    alt={p.title}
                    className="aspect-square w-full object-cover"
                  />

                  <div className="p-5">
                    <h3 className="font-serif-custom text-2xl font-bold">
                      {p.title}
                    </h3>

                    <p className="mt-1 text-sm text-[#849b79]">
                      {p.subtitle}
                    </p>

                    <p className="mt-3 font-semibold text-[#c05640]">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}