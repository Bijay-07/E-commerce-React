import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import productService from '../api/productService';
import categoryService from '../api/categoryService';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 9;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories once — only show child categories, since products
  // are assigned to children, not parent categories (parents would show
  // an empty product list if selected).
  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => {
        const childCategories = res.data.filter((cat) => cat.parentCategory);
        setCategories(childCategories);
      })
      .catch(() => setCategories([]));
  }, []);

  // Debounce search input so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch products whenever the category filter or search term changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1); // reset to page 1 on filter/search change

    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;

    productService
      .getProducts(params)
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message || 'Failed to load products'))
      .finally(() => setIsLoading(false));
  }, [selectedCategory, debouncedSearch]);

  // Client-side pagination slice
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-stone-900">Products</h1>

      <div className="relative mt-4 w-full">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-stone-300 bg-white py-2 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
        />
      </div>

      <p className="mt-3 text-sm text-stone-500">
        {isLoading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
      </p>

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <div className="flex-1">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-lg bg-stone-200"
                />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="rounded-md border border-stone-200 bg-white p-10 text-center text-stone-500">
              {debouncedSearch
                ? `No products found for "${debouncedSearch}".`
                : 'No products found in this category.'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;