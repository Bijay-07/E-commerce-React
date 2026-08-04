import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import productService from '../api/productService';
import ProductCard from '../components/ProductCard';
import Logo from "../assets/MarkusHubLogo.png"

const FEATURED_COUNT = 8;

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .getProducts()
      .then((res) => {
        // No "featured" flag on the backend yet — approximate it by
        // sorting by rating, falling back to the first N products.
        const sorted = [...res.data].sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
        setFeatured(sorted.slice(0, FEATURED_COUNT));
      })
      .catch(() => setFeatured([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-stone-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-teal-700">
              New Season Arrivals
            </span>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
              Everyday essentials,
              <br />
              thoughtfully made.
            </h1>
            <p className="mt-4 max-w-md text-stone-600">
              Discover a curated selection of products built to last — quality
              you can feel, prices you'll appreciate.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
            >
              Shop All Products
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Abstract signature graphic instead of a stock photo placeholder */}
          <div className="relative hidden aspect-square items-center justify-center md:flex">
            <div className="absolute h-64 w-64 rounded-full bg-teal-700/10" />
            <div className="absolute h-44 w-44 translate-x-8 -translate-y-6 rounded-full bg-teal-700/20" />
            <div className="relative flex h-72 w-72 items-center justify-center rounded-2xl bg-white shadow-sm">
              <img src={Logo} alt='LOGO' className="flex h-72 w-72 items-center justify-center rounded-2xl shadow-sm"/>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-stone-900">
              Featured Products
            </h2>
            <p className="mt-1 text-sm text-stone-500">Handpicked favorites, just for you.</p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1 text-sm font-medium text-teal-700 hover:text-teal-800 sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-200" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-md border border-stone-200 bg-white p-10 text-center text-stone-500">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;