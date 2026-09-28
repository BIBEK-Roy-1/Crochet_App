import { ArrowRight, Flower2, Heart, ShoppingBag, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function FeaturedCreations({ products }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/buy-now/${product.id}?quantity=1`);
  };

  return (
    <section id="collection" className="relative bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <Flower2 className="mx-auto mb-4 h-10 w-10 text-[#c05640]" strokeWidth={1.5} />
          <p className="font-bengali text-lg font-medium text-[#849b79]">মেঘলার পছন্দ</p>
          <h2 className="font-serif-custom mt-2 text-4xl font-bold md:text-5xl">
            Featured Creations
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#64748b]">
            Little pieces of comfort, crocheted one stitch at a time.
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#c05640] to-transparent" />
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#d7c8bb] bg-[#faf7f2] py-20 text-center text-[#849b79]">
            Our collection is being updated. Please check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <article
                key={product.id}
                className="group rounded-3xl bg-[#faf7f2] p-3 transition hover:shadow-lg"
              >
                <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-2xl">
                  <div className="relative">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    {product.tag && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#c05640]">
                        {product.tag}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="px-2 pb-2 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="font-serif-custom text-2xl font-bold hover:text-[#c05640]"
                      >
                        {product.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#849b79]">{product.subtitle}</p>
                      <p className="mt-3 font-semibold text-[#c05640]">{formatPrice(product.price)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      aria-label={`Like ${product.title}`}
                      className="rounded-full border border-[#e0d4ca] p-2 text-gray-400 hover:text-[#c05640]"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={(event) => handleAddToCart(event, product)}
                      className="flex items-center gap-2 rounded-full border border-[#c05640] px-4 py-2 text-sm font-medium text-[#c05640] hover:bg-[#c05640] hover:text-white"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={(event) => handleBuyNow(event, product)}
                      className="flex items-center gap-2 rounded-full bg-[#c05640] px-4 py-2 text-sm font-medium text-white hover:bg-[#a64733]"
                    >
                      <Zap className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#c05640] hover:text-[#a64733]"
          >
            View all creations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
