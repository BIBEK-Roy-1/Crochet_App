import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { Flower2, Heart, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetails from './pages/ProductDetails';
import BuyNow from './pages/BuyNow';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import { productService } from './services/productService';
import logo from './assets/logo.png';

function AppContent() {
  const { pathname } = useLocation();

  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [highlightedProductId, setHighlightedProductId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Loading intro states
  const [showIntro, setShowIntro] = useState(true);
  const [introExiting, setIntroExiting] = useState(false);
  const [appRevealing, setAppRevealing] = useState(false);

  // Scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const fetchAll = async () => {
    const [p, c, s] = await Promise.all([
      productService.getProducts(),
      productService.getCollections(),
      productService.getSettings(),
    ]);

    setProducts(p);
    setCollections(c);
    setHighlightedProductId(s.highlightedProductId);
  };

  // Smoothly transition from loading screen to website
  const startIntroExit = () => {
    setLoading(false);
    setAppRevealing(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIntroExiting(true);
      });
    });

    setTimeout(() => {
      setShowIntro(false);
    }, 1400);
  };

  // Load backend with automatic retry
  const loadInitialData = async () => {
    setLoading(true);
    setLoadError(false);

    const maxAttempts = 6;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await fetchAll();

        startIntroExit();
        return;
      } catch (error) {
        console.error(
          `Backend connection attempt ${attempt} failed:`,
          error
        );

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }

    setLoading(false);
    setLoadError(true);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const addProduct = async (data) => {
    await productService.addProduct(data);
    await fetchAll();
  };

  const updateProduct = async (id, data) => {
    await productService.updateProduct(id, data);
    await fetchAll();
  };

  const deleteProduct = async (id) => {
    await productService.deleteProduct(id);
    await fetchAll();
  };

  const addCollection = async (name) => {
    await productService.addCollection(name);
    await fetchAll();
  };

  const deleteCollection = async (id) => {
    await productService.deleteCollection(id);
    await fetchAll();
  };

  const setHighlightedProduct = async (id) => {
    await productService.updateSettings({
      highlightedProductId: id,
    });

    await fetchAll();
  };

  const highlightedProduct = products.find(
    (product) => product.id === highlightedProductId
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#faf7f2] text-[#334155]">

      {/* ==========================================================
          MAIN WEBSITE
          Rendered underneath the loading screen for a smoother
          transition when the backend becomes ready.
      ========================================================== */}

      <div
        className={appRevealing ? 'page-reveal' : ''}
      >
        <Navbar onCartClick={() => setCartOpen(true)} />

        <Routes>
          <Route
            path="/"
            element={
              <Home
                products={products}
                highlightedProduct={highlightedProduct}
              />
            }
          />

          <Route
            path="/collection"
            element={
              <Collection
                products={products}
                collections={collections}
              />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetails
                products={products}
                collections={collections}
              />
            }
          />

          <Route
            path="/buy-now"
            element={<BuyNow products={products} />}
          />

          <Route
            path="/buy-now/:id"
            element={<BuyNow products={products} />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard
                  products={products}
                  collections={collections}
                  onAddProduct={addProduct}
                  onUpdateProduct={updateProduct}
                  onDeleteProduct={deleteProduct}
                  onAddCollection={addCollection}
                  onDeleteCollection={deleteCollection}
                  highlightedProductId={highlightedProductId}
                  onSetHighlightedProduct={setHighlightedProduct}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/404"
            element={<NotFound />}
          />

          <Route
            path="*"
            element={<Navigate to="/404" replace />}
          />
        </Routes>

        <Footer />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
        />
      </div>

      {/* ==========================================================
          LOADING / INTRO OVERLAY
      ========================================================== */}

      {showIntro && !loadError && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#faf7f2] ${
            introExiting ? 'intro-exit' : ''
          }`}
        >
          <div className="relative flex h-full w-full items-center justify-center">

            {/* Soft decorative background */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#eadfd5]/50 blur-3xl" />

            <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#dfe8da]/50 blur-3xl" />

            {/* Floating flower */}
            <div
              className="absolute left-[10%] top-[18%] text-[#caa99d]"
              style={{
                animation: 'floatA 5s ease-in-out infinite',
              }}
            >
              <Flower2 className="h-9 w-9" strokeWidth={1.5} />
            </div>

            {/* Floating heart */}
            <div
              className="absolute right-[12%] top-[18%] text-[#c05640]"
              style={{
                animation: 'floatB 6s ease-in-out infinite',
              }}
            >
              <Heart
                className="h-8 w-8"
                strokeWidth={1.5}
                fill="currentColor"
              />
            </div>

            {/* Small heart */}
            <div
              className="absolute left-[15%] bottom-[20%] text-[#849b79]"
              style={{
                animation: 'floatC 7s ease-in-out infinite',
              }}
            >
              <Heart
                className="h-6 w-6"
                strokeWidth={1.5}
                fill="currentColor"
              />
            </div>

            {/* Small flower */}
            <div
              className="absolute right-[18%] bottom-[22%] text-[#c9a79b]"
              style={{
                animation: 'floatA 6s ease-in-out infinite',
              }}
            >
              <Flower2 className="h-7 w-7" strokeWidth={1.5} />
            </div>

            {/* Sparkle */}
            <div
              className="absolute left-[25%] top-[27%] text-[#b99b8f]"
              style={{
                animation: 'sparkleFloat 3s ease-in-out infinite',
              }}
            >
              <Sparkles className="h-5 w-5" />
            </div>

            {/* Sparkle */}
            <div
              className="absolute right-[26%] bottom-[29%] text-[#849b79]"
              style={{
                animation: 'sparkleFloat 3.5s ease-in-out infinite',
              }}
            >
              <Sparkles className="h-4 w-4" />
            </div>

            {/* Tiny floating dots */}
            <span
              className="absolute left-[22%] top-[45%] h-2 w-2 rounded-full bg-[#c9a79b]"
              style={{
                animation: 'floatDot 4s ease-in-out infinite',
              }}
            />

            <span
              className="absolute right-[23%] top-[42%] h-2 w-2 rounded-full bg-[#849b79]"
              style={{
                animation: 'floatDot 5s ease-in-out infinite',
              }}
            />

            {/* ====================================================
                MAIN LOGO
            ==================================================== */}

            <div className="relative z-10 flex flex-col items-center">

              <div
                className="relative h-[270px] w-[270px] sm:h-[320px] sm:w-[320px]"
                style={{
                  animation: 'logoFloat 4s ease-in-out infinite',
                }}
              >

                {/* Rotating text */}
                <svg
                  viewBox="0 0 300 300"
                  className="absolute inset-0 h-full w-full"
                  style={{
                    animation: 'rotateText 18s linear infinite',
                  }}
                >
                  <defs>
                    <path
                      id="textCircle"
                      d="M 150,150 m -112,0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0"
                      fill="none"
                    />
                  </defs>

                  <text
                    fill="#9a7c70"
                    fontSize="11"
                    fontWeight="500"
                    letterSpacing="3"
                  >
                    <textPath
                      href="#textCircle"
                      startOffset="0%"
                    >
                      A LITTLE HANDMADE WARMTH • IS ON ITS WAY •
                    </textPath>
                  </text>
                </svg>

                {/* Orbit flower */}
                <div className="absolute left-[5px] top-1/2 -translate-y-1/2 text-[#c05640]">
                  <Flower2
                    className="h-7 w-7"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Orbit heart */}
                <div className="absolute right-[5px] top-1/2 -translate-y-1/2 text-[#849b79]">
                  <Heart
                    className="h-6 w-6"
                    strokeWidth={1.5}
                    fill="currentColor"
                  />
                </div>

                {/* Logo */}
                <div className="absolute inset-[38px] overflow-hidden rounded-full">
                  <img
                    src={logo}
                    alt="Meghla Crochet"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>

              {/* Brand name */}
              <h1 className="mt-4 font-serif-custom text-4xl font-bold tracking-wide text-[#334155]">
                মেঘলা
              </h1>

              <p className="mt-2 text-[11px] font-medium tracking-[0.35em] text-[#849b79]">
                CROCHET & HANDCRAFTS
              </p>

              {/* Warm message */}
              <p className="mt-6 font-serif-custom text-lg text-[#5c6470]">
                Handmade warmth is on its way.
              </p>

              <p className="mt-2 text-sm italic text-[#9a7c70]">
                A little handmade warmth is on its way.
              </p>

              {/* Loading dots */}
              <div className="mt-6 flex items-center gap-2">

                <span
                  className="h-2 w-2 rounded-full bg-[#c05640]"
                  style={{
                    animation: 'loadingDot 1.4s infinite',
                  }}
                />

                <span
                  className="h-2 w-2 rounded-full bg-[#c05640]"
                  style={{
                    animation: 'loadingDot 1.4s 0.2s infinite',
                  }}
                />

                <span
                  className="h-2 w-2 rounded-full bg-[#c05640]"
                  style={{
                    animation: 'loadingDot 1.4s 0.4s infinite',
                  }}
                />

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          ERROR SCREEN
      ========================================================== */}

      {loadError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#faf7f2] px-6">

          <div className="text-center">

            <img
              src={logo}
              alt="Meghla Crochet"
              className="mx-auto h-28 w-28 object-contain"
            />

            <h1 className="mt-5 font-serif-custom text-3xl font-bold text-[#334155]">
              মেঘলা
            </h1>

            <p className="mt-4 font-serif-custom text-lg text-[#5c6470]">
              It’s taking a little longer...
            </p>

            <p className="mt-2 text-sm leading-7 text-[#7b8490]">
              Our little handcrafted corner
              <br />
              is getting ready.
            </p>

            <button
              onClick={loadInitialData}
              className="mt-7 rounded-full bg-[#c05640] px-7 py-3 font-medium text-white transition hover:bg-[#a64733]"
            >
              Try Again
            </button>

          </div>
        </div>
      )}

      {/* ==========================================================
          ANIMATIONS
      ========================================================== */}

      <style>
        {`

          @keyframes rotateText {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes logoFloat {
            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }

          @keyframes floatA {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-22px) rotate(10deg);
            }
          }

          @keyframes floatB {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }

            50% {
              transform: translateY(-26px) rotate(-10deg);
            }
          }

          @keyframes floatC {
            0%, 100% {
              transform: translateY(0) scale(1);
            }

            50% {
              transform: translateY(-18px) scale(1.1);
            }
          }

          @keyframes sparkleFloat {
            0%, 100% {
              opacity: 0.25;
              transform: translateY(0) scale(0.8);
            }

            50% {
              opacity: 1;
              transform: translateY(-12px) scale(1.15);
            }
          }

          @keyframes floatDot {
            0%, 100% {
              transform: translateY(0);
              opacity: 0.35;
            }

            50% {
              transform: translateY(-16px);
              opacity: 1;
            }
          }

          @keyframes loadingDot {
            0%, 100% {
              transform: scale(0.7);
              opacity: 0.3;
            }

            50% {
              transform: scale(1.15);
              opacity: 1;
            }
          }

          .intro-exit {
            animation: introFadeOut 1.25s cubic-bezier(.22, 1, .36, 1) forwards;
          }

          .intro-exit > div {
            animation: introZoom 1.25s cubic-bezier(.22, 1, .36, 1) forwards;
          }

          @keyframes introFadeOut {
            0% {
              opacity: 1;
            }

            45% {
              opacity: 1;
            }

            100% {
              opacity: 0;
              pointer-events: none;
            }
          }

          @keyframes introZoom {
            0% {
              transform: scale(1);
            }

            55% {
              transform: scale(1.05);
            }

            100% {
              transform: scale(1.16);
            }
          }

          .page-reveal {
            animation: pageReveal 1.35s cubic-bezier(.22, 1, .36, 1) both;
          }

          @keyframes pageReveal {
            0% {
              opacity: 0;
              transform: scale(1.025);
            }

            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

        `}
      </style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}