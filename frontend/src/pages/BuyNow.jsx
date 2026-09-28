import {
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useState } from "react";

import { useCart } from "../context/CartContext";
import { siteConfig } from "../config/site";
import { orderService } from "../services/orderService";
import {
  formatPrice,
  toPriceNumber,
} from "../utils/formatPrice";

export default function BuyNow({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();

  const [ordering, setOrdering] = useState(false);

  /*
    TWO POSSIBILITIES:

    1. /buy-now/:id
       → Buy one specific product

    2. /buy-now
       → Checkout everything in cart
  */

  let orderItems = [];

  // ==========================================
  // BUY ONE PRODUCT
  // ==========================================

  if (id) {
    const product = products.find(
      (item) => item.id === id
    );

    if (product) {
      orderItems = [
        {
          id: product.id,
          title: product.title,
          subtitle: product.subtitle,
          price: product.price,
          image:
            product.images?.[0] ||
            product.image ||
            "",
          quantity: 1,
        },
      ];
    }
  }

  // ==========================================
  // CHECKOUT CART
  // ==========================================

  else {
    orderItems = cart;
  }

  // ==========================================
  // CALCULATE TOTAL
  // ==========================================

  const total = orderItems.reduce(
    (sum, item) => {
      return (
        sum +
        toPriceNumber(item.price) *
          item.quantity
      );
    },
    0
  );

  // ==========================================
  // WHATSAPP ORDER
  // ==========================================

  const handleWhatsAppOrder = async () => {
    try {
      setOrdering(true);

      // ----------------------------------------
      // Save order in MongoDB
      // ----------------------------------------

      const response =
        await orderService.createWhatsAppOrder(
          orderItems
        );

      const order = response.order;

      // ----------------------------------------
      // Create WhatsApp message
      // ----------------------------------------

      const message = `
Hello Meghla Crochet! 🧶

I would like to place an order.

Order ID: ${order.id}

${order.items
  .map(
    (item) => `
Product: ${item.title}
Quantity: ${item.quantity}
Price: ₹${new Intl.NumberFormat(
      "en-IN"
    ).format(item.price)}
`
  )
  .join("\n")}

Total: ₹${new Intl.NumberFormat(
        "en-IN"
      ).format(order.totalAmount)}

Please let me know the next steps.
      `.trim();

      const whatsappUrl =
        `https://wa.me/${siteConfig.whatsappNumber}` +
        `?text=${encodeURIComponent(message)}`;

      // ----------------------------------------
      // Clear cart when checking out cart
      // ----------------------------------------

      if (!id && clearCart) {
        clearCart();
      }

      // ----------------------------------------
      // Open WhatsApp
      // ----------------------------------------

      window.location.href = whatsappUrl;
    } catch (error) {
      console.error(
        "WhatsApp order failed:",
        error
      );

      alert(
        error.message ||
          "Unable to create your order. Please try again."
      );
    } finally {
      setOrdering(false);
    }
  };

  // ==========================================
  // EMPTY ORDER
  // ==========================================

  if (orderItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf7f2] px-4 pb-20 pt-32">

        <div className="mx-auto max-w-xl text-center">

          <ShoppingBag className="mx-auto h-14 w-14 text-[#c05640]" />

          <h1 className="font-serif-custom mt-6 text-4xl font-bold text-[#334155]">
            Your order is empty
          </h1>

          <p className="mt-4 text-[#64748b]">
            Add something beautiful from the
            collection first.
          </p>

          <Link
            to="/collection"
            className="mt-8 inline-block bg-[#c05640] px-7 py-3 font-medium text-white transition hover:bg-[#a64733]"
          >
            Explore Collection
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="min-h-screen bg-[#faf7f2] px-4 pb-24 pt-32">

      <div className="mx-auto max-w-6xl">

        {/* ======================================
            BACK
        ======================================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-[#64748b] transition hover:text-[#c05640]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* ====================================
              ORDER SUMMARY
          ===================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c05640]">
                Your order
              </p>

              <h1 className="font-serif-custom mt-2 text-4xl font-bold text-[#334155]">
                Buy Now
              </h1>
            </div>

            {/* Products */}

            <div className="mt-8 space-y-6">

              {orderItems.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4 border-b border-[#eee4dc] pb-6"
                >

                  {/* Image */}

                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-24 w-24 flex-shrink-0 rounded-2xl object-cover"
                  />

                  {/* Information */}

                  <div className="min-w-0 flex-1">

                    <h2 className="font-serif-custom text-xl font-bold text-[#334155]">
                      {item.title}
                    </h2>

                    {item.subtitle && (
                      <p className="mt-1 text-sm text-[#849b79]">
                        {item.subtitle}
                      </p>
                    )}

                    <div className="mt-4 flex justify-between text-sm">

                      <span className="text-gray-500">
                        Quantity
                      </span>

                      <span className="font-medium">
                        {item.quantity}
                      </span>

                    </div>

                    <div className="mt-2 flex justify-between text-sm">

                      <span className="text-gray-500">
                        Price
                      </span>

                      <span className="font-semibold text-[#c05640]">
                        {formatPrice(item.price)}
                      </span>

                    </div>

                    <div className="mt-2 flex justify-between text-sm">

                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-medium text-[#334155]">
                        {formatPrice(
                          toPriceNumber(
                            item.price
                          ) * item.quantity
                        )}
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* Total */}

            <div className="mt-6 flex items-center justify-between border-t border-[#ded2c8] pt-6">

              <span className="text-lg font-medium text-[#334155]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#c05640]">
                {formatPrice(total)}
              </span>

            </div>

          </section>

          {/* ====================================
              WHATSAPP CHECKOUT
          ===================================== */}

          <section className="flex flex-col justify-center rounded-3xl bg-white p-8 shadow-sm sm:p-10">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c05640]">
                Almost there
              </p>

              <h2 className="font-serif-custom mt-2 text-4xl font-bold text-[#334155]">
                Complete your order
              </h2>

              <p className="mt-4 leading-7 text-[#64748b]">
                Continue to WhatsApp and send your
                order directly to Meghla Crochet.
                We'll confirm availability, delivery,
                and payment details with you there.
              </p>

            </div>

            {/* WhatsApp Card */}

            <div className="mt-8 rounded-2xl border border-[#ddd4ca] bg-[#faf7f2] p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e4eee1] text-[#5b7f51]">
                  <MessageCircle className="h-6 w-6" />
                </div>

                <div>

                  <h3 className="font-semibold text-[#334155]">
                    Order via WhatsApp
                  </h3>

                  <p className="mt-1 text-sm text-[#64748b]">
                    Your order details will be
                    automatically filled in.
                  </p>

                </div>

              </div>

            </div>

            {/* WhatsApp Button */}

            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={ordering}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#5b7f51] px-8 py-4 font-medium text-white transition hover:bg-[#496941] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <MessageCircle className="h-5 w-5" />

              {ordering
                ? "Preparing your order..."
                : "Continue to WhatsApp"}

            </button>

            <p className="mt-4 text-center text-xs leading-5 text-gray-400">
              Your order will be saved before
              WhatsApp opens.
            </p>

          </section>

        </div>

      </div>

    </main>
  );
}