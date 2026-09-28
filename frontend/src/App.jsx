import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
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

function AppContent(){
  const [products,setProducts]=useState([]);const [collections,setCollections]=useState([]);const [highlightedProductId,setHighlightedProductId]=useState(null);const [cartOpen,setCartOpen]=useState(false);
  const fetchAll=async()=>{const [p,c,s]=await Promise.all([productService.getProducts(),productService.getCollections(),productService.getSettings()]);setProducts(p);setCollections(c);setHighlightedProductId(s.highlightedProductId)};
  useEffect(()=>{fetchAll()},[]);
  const addProduct=async(d)=>{await productService.addProduct(d);await fetchAll()};const updateProduct=async(id,d)=>{await productService.updateProduct(id,d);await fetchAll()};const deleteProduct=async(id)=>{await productService.deleteProduct(id);await fetchAll()};const addCollection=async(n)=>{await productService.addCollection(n);await fetchAll()};const deleteCollection=async(id)=>{await productService.deleteCollection(id);await fetchAll()};const setHighlightedProduct=async(id)=>{await productService.updateSettings({highlightedProductId:id});await fetchAll()};
  const highlightedProduct=products.find((p)=>p.id===highlightedProductId);
  return <div className="min-h-screen overflow-x-hidden bg-[#faf7f2] text-[#334155]"><Navbar onCartClick={()=>setCartOpen(true)}/><Routes><Route path="/" element={<Home products={products} highlightedProduct={highlightedProduct}/>}/><Route path="/collection" element={<Collection products={products} collections={collections}/>}/><Route path="/product/:id" element={<ProductDetails products={products} collections={collections}/>}/><Route path="/buy-now" element={<BuyNow products={products}/>}/><Route path="/buy-now/:id" element={<BuyNow products={products}/>}/><Route path="/about" element={<About/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard products={products} collections={collections} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} onAddCollection={addCollection} onDeleteCollection={deleteCollection} highlightedProductId={highlightedProductId} onSetHighlightedProduct={setHighlightedProduct}/></ProtectedRoute>}/><Route path="/404" element={<NotFound/>}/><Route path="*" element={<Navigate to="/404" replace/>}/></Routes><Footer/><CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)}/></div>;
}
export default function App(){return <BrowserRouter><AuthProvider><CartProvider><AppContent/></CartProvider></AuthProvider></BrowserRouter>}
