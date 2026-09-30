import {
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { cart, clearCart } = useCart();

  const [ordering, setOrdering] = useState(false);

  const [deliveryType, setDeliveryType] = useState("campus");

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // ==========================================
  // BUILD ORDER ITEMS
  // ==========================================

  let orderItems = [];

  // Buy one specific product
  if (id) {
    const product = products.find(
      (item) => item.id === id
    );

    if (product) {
      const requestedQuantity = Number(
        searchParams.get("quantity")
      );

      const quantity =
        Number.isInteger(requestedQuantity) &&
        requestedQuantity > 0
          ? requestedQuantity
          : 1;

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
          quantity,
        },
      ];
    }
  }

  // Checkout cart
  else {
    orderItems = cart;
  }

  // ==========================================
  // CALCULATE SUBTOTAL
  // ==========================================

  const subtotal = orderItems.reduce(
    (sum, item) =>
      sum +
      toPriceNumber(item.price) *
        item.quantity,
    0
  );

  // ==========================================
  // DELIVERY CHARGE
  // ==========================================

  const deliveryCharge =
    deliveryType === "outside" ? 55 : 0;

  // ==========================================
  // FINAL TOTAL
  // ==========================================

  const total =
    subtotal + deliveryCharge;

  // ==========================================
  // WHATSAPP ORDER
  // ==========================================

  const handleWhatsAppOrder = async () => {
    // Full name
    if (!customerName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    // Outside-campus address
    if (
      deliveryType === "outside" &&
      !address.trim()
    ) {
      alert("Please enter your address.");
      return;
    }

    // Outside-campus PIN
    if (
      deliveryType === "outside" &&
      !/^\d{6}$/.test(pincode.trim())
    ) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    try {
      setOrdering(true);

      // ----------------------------------------
      // SAVE ORDER IN MONGODB
      // ----------------------------------------

      const response =
        await orderService.createWhatsAppOrder({
          items: orderItems,
          customerName: customerName.trim(),
          deliveryType,
          address:
            deliveryType === "outside"
              ? address.trim()
              : "",
          pincode:
            deliveryType === "outside"
              ? pincode.trim()
              : "",
        });

      const order = response.order;

      // ----------------------------------------
      // WHATSAPP MESSAGE
      // ----------------------------------------

      const crochetEmoji =
        String.fromCodePoint(0x1F9F6);

      const message = `
Hello Meghla Crochet! ${crochetEmoji}

I would like to place an order.

Order ID: ${order.id}

Customer Name: ${customerName.trim()}

Delivery Type: ${
        deliveryType === "outside"
          ? "Not from campus"
          : "On campus"
      }

${
  deliveryType === "outside"
    ? `Address: ${address.trim()}
PIN Code: ${pincode.trim()}`
    : "Delivery: On campus"
}

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

Subtotal: ₹${new Intl.NumberFormat(
        "en-IN"
      ).format(subtotal)}

Delivery Charge: ₹${new Intl.NumberFormat(
        "en-IN"
      ).format(deliveryCharge)}

Total: ₹${new Intl.NumberFormat(
        "en-IN"
      ).format(total)}

Please let me know the next steps.
      `.trim();

      const whatsappUrl =
        `https://wa.me/${siteConfig.whatsappNumber}` +
        `?text=${encodeURIComponent(message)}`;

      // ----------------------------------------
      // CLEAR CART FOR CART CHECKOUT
      // ----------------------------------------

      if (!id && clearCart) {
        clearCart();
      }

      // ----------------------------------------
      // OPEN WHATSAPP
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
            className="mt-8 inline-block rounded-full bg-[#c05640] px-7 py-3 font-medium text-white transition hover:bg-[#a64733]"
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

        {/* Back */}
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
                          toPriceNumber(item.price) *
                            item.quantity
                        )}
                      </span>
                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* Price Summary */}
            <div className="mt-6 space-y-3 border-t border-[#ded2c8] pt-6">

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Products
                </span>

                <span className="font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span
                  className={
                    deliveryType === "outside"
                      ? "font-semibold text-[#c05640]"
                      : "font-medium text-[#849b79]"
                  }
                >
                  {deliveryType === "outside"
                    ? formatPrice(deliveryCharge)
                    : "Free"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">

                <span className="text-lg font-medium text-[#334155]">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#c05640]">
                  {formatPrice(total)}
                </span>

              </div>

            </div>

          </section>

          {/* ====================================
              CHECKOUT
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
                Enter your details and continue to
                WhatsApp to place your order.
              </p>

            </div>

            {/* Customer Name */}
            <div className="mt-8">

              <label className="mb-2 block text-sm font-semibold text-[#334155]">
                Full Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-[#d7c9bd] bg-[#faf7f2] px-4 py-3 outline-none transition focus:border-[#c05640]"
              />

            </div>

            {/* Delivery Type */}
            <div className="mt-7">

              <p className="mb-3 text-sm font-semibold text-[#334155]">
                Delivery location
              </p>

              <div className="space-y-3">

                {/* On Campus */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                    deliveryType === "campus"
                      ? "border-[#849b79] bg-[#e4eee1]/50"
                      : "border-[#ded4ca] bg-[#faf7f2]"
                  }`}
                >

                  <input
                    type="radio"
                    name="deliveryType"
                    value="campus"
                    checked={deliveryType === "campus"}
                    onChange={() =>
                      setDeliveryType("campus")
                    }
                    className="accent-[#849b79]"
                  />

                  <div>
                    <p className="font-medium text-[#334155]">
                      Campus Delivery
                    </p>

                    <p className="mt-1 text-sm text-[#849b79]">
                      No delivery charge
                    </p>
                  </div>

                </label>

                {/* Not From Campus */}
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                    deliveryType === "outside"
                      ? "border-[#c05640] bg-[#fff7f3]"
                      : "border-[#ded4ca] bg-[#faf7f2]"
                  }`}
                >

                  <input
                    type="radio"
                    name="deliveryType"
                    value="outside"
                    checked={deliveryType === "outside"}
                    onChange={() =>
                      setDeliveryType("outside")
                    }
                    className="accent-[#c05640]"
                  />

                  <div>
                    <p className="font-medium text-[#334155]">
                      Home Delivery
                    </p>

                    <p className="mt-1 text-sm text-[#c05640]">
                      ₹55 delivery charge will be added
                    </p>
                  </div>

                </label>

              </div>

            </div>

            {/* Outside Campus Details */}
            {deliveryType === "outside" && (
              <div className="mt-5 space-y-4">

                {/* Warning */}
                <div className="rounded-2xl border border-[#ead4c9] bg-[#fff8f4] p-4 text-sm leading-6 text-[#9a6252]">
                  A ₹55 delivery charge is added for
                  orders outside campus.
                </div>

                {/* Address */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#334155]">
                    Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(event.target.value)
                    }
                    placeholder="Enter your full delivery address"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-[#d7c9bd] bg-[#faf7f2] px-4 py-3 outline-none transition focus:border-[#c05640]"
                  />

                </div>

                {/* PIN Code */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#334155]">
                    PIN Code
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(event) =>
                      setPincode(
                        event.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="6-digit PIN code"
                    className="w-full rounded-2xl border border-[#d7c9bd] bg-[#faf7f2] px-4 py-3 outline-none transition focus:border-[#c05640]"
                  />

                </div>

              </div>
            )}

            {/* WhatsApp Button */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={ordering}
              className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#8f6f61] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#7b5d50] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >

              <MessageCircle className="h-5 w-5" />

              {ordering
                ? "Preparing your order..."
                : "Order via WhatsApp"}

            </button>

            <p className="mt-3 text-center text-xs text-gray-400">
              Your order details will be filled in automatically.
            </p>

          </section>

        </div>
      </div>
    </main>
  );
}