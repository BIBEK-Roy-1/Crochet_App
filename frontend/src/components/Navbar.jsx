import { ShoppingBag, Lock, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onCartClick }) {
  const [open, setOpen] = useState(false);

  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const go = (href) => {
    setOpen(false);
    navigate(href);
  };

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed left-0 top-0 z-50 w-full border-b ${
        isHome
          ? 'bg-transparent'
          : 'bg-[#faf7f2]/95 shadow-sm backdrop-blur'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/m3d5hd1r/image/upload/v1790621171/logo.png"
            alt="Meghla Crochet"
            className="h-20 w-20 object-contain"
          />

          <div>
            <span className="font-serif-custom text-2xl font-bold">
              Meghla
            </span>

            <p>মেঘলা</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            className={`font-medium hover:text-[#c05640] ${
              location.pathname === '/' ? 'text-[#c05640]' : ''
            }`}
            to="/"
          >
            Home
          </Link>

          <Link
            className={`font-medium hover:text-[#c05640] ${
              location.pathname === '/collection' ? 'text-[#c05640]' : ''
            }`}
            to="/collection"
          >
            Collection
          </Link>

          <Link
            className={`font-medium hover:text-[#c05640] ${
              location.pathname === '/about' ? 'text-[#c05640]' : ''
            }`}
            to="/about"
          >
            About
          </Link>

          <Link
            className="relative rounded-full border border-[#c05640] px-4 py-2 text-[#c05640] hover:bg-[#c05640] hover:text-white"
            to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
          >
            <Lock className="mr-1 inline h-4 w-4" />
            {isAuthenticated ? 'Dashboard' : 'Admin'}
          </Link>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative flex items-center gap-2 rounded-full bg-[#c05640] px-5 py-2.5 font-medium text-white hover:bg-[#a64733]"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#334155] px-1 text-xs text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">

          {/* Mobile Cart */}
          <button
            onClick={onCartClick}
            className="relative rounded-full p-2 text-[#334155]"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-6 w-6" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c05640] px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-[#334155]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t bg-[#faf7f2] px-4 pb-6 pt-2 md:hidden">

          <button
            onClick={() => go('/')}
            className={`block w-full border-b border-dashed px-2 py-3 text-left ${
              location.pathname === '/'
                ? 'font-semibold text-[#c05640]'
                : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => go('/collection')}
            className={`block w-full border-b border-dashed px-2 py-3 text-left ${
              location.pathname === '/collection'
                ? 'font-semibold text-[#c05640]'
                : ''
            }`}
          >
            Collection
          </button>

          <button
            onClick={() => go('/about')}
            className={`block w-full border-b border-dashed px-2 py-3 text-left ${
              location.pathname === '/about'
                ? 'font-semibold text-[#c05640]'
                : ''
            }`}
          >
            About
          </button>

          <button
            onClick={() =>
              go(isAuthenticated ? '/admin/dashboard' : '/admin/login')
            }
            className="block w-full px-2 py-3 text-left"
          >
            {isAuthenticated ? 'Dashboard' : 'Admin'}
          </button>

        </div>
      )}
    </nav>
  );
}