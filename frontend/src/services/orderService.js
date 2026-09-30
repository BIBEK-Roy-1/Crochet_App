const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const createWhatsAppOrder = async ({
  items,
  customerName,
  deliveryType,
  address,
  pincode,
}) => {
  const response = await fetch(
    `${API_BASE_URL}/orders/whatsapp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
        })),

        customerName,
        deliveryType,
        address,
        pincode,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create your order."
    );
  }

  return data;
};

export const orderService = {
  createWhatsAppOrder,
};