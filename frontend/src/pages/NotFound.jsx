import { Link } from 'react-router-dom';
export default function NotFound(){return <main className="min-h-screen bg-[#faf7f2] px-4 pt-40 text-center"><h1 className="font-serif-custom text-6xl font-bold">404</h1><p className="mt-3 text-gray-500">This page wandered off.</p><Link to="/" className="mt-8 inline-block rounded-full bg-[#c05640] px-6 py-3 text-white">Back Home</Link></main>}
