import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function CartDrawer({ open, onClose }) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  // Prevent the page behind the cart from scrolling
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Background Overlay */}
      {open && (
        <button
          aria-label="Close cart"
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-[1px]"
        />
      )}

      {/* Cart Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[70] grid w-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } md:right-4 md:top-4 md:h-[calc(100svh-2rem)] md:w-[28rem] md:rounded-3xl`}
        style={{
          height: '100svh',
          maxHeight: '100svh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6 sm:py-5">
          <h2 className="font-serif-custom text-2xl font-bold text-[#334155]">
            Your Cart
          </h2>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 text-[#334155] transition hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="min-h-0 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
          {cart.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              <div>
                <p className="text-lg font-medium">
                  Your cart is empty.
                </p>

                <p className="mt-2 text-sm">
                  Add something lovely to your cart.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-[#eee4dc] pb-5 last:border-b-0"
                >
                  {/* Product Image */}
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.title}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
                  />

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 pr-1 text-sm font-semibold text-[#334155] sm:text-base">
                        {item.title}
                      </h3>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="shrink-0 p-1 text-gray-400 transition hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-[#849b79]">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity + Item Total */}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-[#d7c9bd] bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="p-2 transition hover:bg-[#faf7f2]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>

                        <span className="min-w-8 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="p-2 transition hover:bg-[#faf7f2]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-[#c05640]">
                        {formatPrice(
                          Number(item.price) * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Footer */}
        {cart.length > 0 && (
          <div className="border-t bg-white px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-5 md:rounded-b-3xl">
            <div className="mb-4 flex items-center justify-between text-lg font-semibold">
              <span className="text-[#334155]">
                Total
              </span>

              <span className="text-[#c05640]">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <Link
              to="/buy-now"
              onClick={onClose}
              className="block rounded-full bg-[#c05640] py-3 text-center font-semibold text-white transition hover:bg-[#a64733]"
            >
              Checkout
            </Link>

            <Link
              to="/collection"
              onClick={onClose}
              className="mt-2 block py-2 text-center text-sm text-[#c05640]"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}