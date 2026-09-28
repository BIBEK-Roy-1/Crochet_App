import Hero from '../components/Hero';
import FeaturedCreations from '../components/FeaturedCreations';

export default function Home({ products, highlightedProduct }) {
  return <><Hero highlightedProduct={highlightedProduct} /><FeaturedCreations products={products} /></>;
}
