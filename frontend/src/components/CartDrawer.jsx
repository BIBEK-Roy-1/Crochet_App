import { Minus, Plus, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function CartDrawer({ open, onClose }) {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  return (
    <>
      {open && <button aria-label="Close cart" onClick={onClose} className="fixed inset-0 z-[60] bg-black/30" />}
      <aside className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="font-serif-custom text-2xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="py-20 text-center text-gray-500">Your cart is empty.</div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image || item.images?.[0]} alt={item.title} className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between gap-3">
                      <h3 className="font-semibold">{item.title}</h3>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <p className="mt-1 text-sm text-[#849b79]">{formatPrice(item.price)}</p>
                    <div className="mt-3 inline-flex items-center rounded-full border">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2"><Minus className="h-4 w-4" /></button>
                      <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2"><Plus className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t p-6">
            <div className="mb-4 flex justify-between text-lg font-semibold"><span>Total</span><span className="text-[#c05640]">{formatPrice(cartTotal)}</span></div>
            <Link onClick={onClose} to="/buy-now" className="block rounded-full bg-[#c05640] py-3 text-center font-semibold text-white hover:bg-[#a64733]">Checkout</Link>
            <Link onClick={onClose} to="/collection" className="mt-3 block py-2 text-center text-sm text-[#c05640]">Continue Shopping</Link>
          </div>
        )}
      </aside>
    </>
  );
}
