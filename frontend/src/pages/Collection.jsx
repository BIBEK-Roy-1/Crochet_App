import { Flower2, Heart, ShoppingBag, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function Collection({ products, collections }) {
  const [selected, setSelected] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          (selected === 'all' || product.collectionId === selected) &&
          `${product.title} ${product.subtitle}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [products, selected, search],
  );

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
    <main className="min-h-screen bg-[#faf7f2] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Flower2 className="mx-auto mb-4 h-11 w-11 text-[#c05640]" strokeWidth={1.5} />
          <p className="font-bengali text-lg font-medium text-[#849b79]">মেঘলার সংগ্রহ</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#c05640]">
            Shop Meghla
          </p>
          <h1 className="font-serif-custom mt-2 text-5xl font-bold text-[#334155]">
            The Collection
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[#64748b]">
            Browse handmade pieces by collection.
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-[#c05640] to-transparent" />
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search crochet pieces..."
            className="w-full rounded-full border border-[#d7c9bd] bg-white px-5 py-3 outline-none focus:border-[#c05640] md:max-w-sm"
          />

          <div className="flex flex-wrap gap-2">
            {[['all', 'All'], ...collections.map((collection) => [collection.id, collection.name])].map(
              ([id, name]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selected === id
                      ? 'bg-[#c05640] text-white'
                      : 'border border-[#d7c9bd] bg-white text-[#334155]'
                  }`}
                >
                  {name}
                </button>
              ),
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/product/${product.id}`} className="block overflow-hidden">
                  <div className="relative">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {product.tag && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#c05640] shadow-sm">
                        {product.tag}
                      </span>
                    )}
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="font-serif-custom text-2xl font-bold text-[#334155] hover:text-[#c05640]"
                      >
                        {product.title}
                      </Link>
                      <p className="mt-1 text-sm text-[#849b79]">{product.subtitle}</p>
                      <p className="mt-4 font-semibold text-[#c05640]">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Like ${product.title}`}
                      onClick={(event) => event.stopPropagation()}
                      className="rounded-full border border-[#e0d4ca] p-2 text-gray-400 hover:text-[#c05640]"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Actions added to Collection cards */}
                  <div className="mt-5 flex justify-end gap-2 border-t border-[#eee4dc] pt-4">
                    <button
                      type="button"
                      onClick={(event) => handleAddToCart(event, product)}
                      className="flex items-center gap-2 rounded-full border border-[#c05640] px-4 py-2 text-sm font-medium text-[#c05640] transition hover:bg-[#c05640] hover:text-white"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={(event) => handleBuyNow(event, product)}
                      className="flex items-center gap-2 rounded-full bg-[#c05640] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a64733]"
                    >
                      <Zap className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            No products match your search.
          </div>
        )}
      </div>
    </main>
  );
}
