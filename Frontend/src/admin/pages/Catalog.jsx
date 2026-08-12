import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import categoryService from '../../api/categoryService';
import productService from '../../api/productService';
import CategoryFormModal from '../components/CategoryFormModal';
import ProductFormModal from '../components/ProductFormModal';

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categoryModal, setCategoryModal] = useState(null); // null | {} (add) | category (edit)
  const [productModal, setProductModal] = useState(null); // null | {} (add) | product (edit)

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Category actions ---
  const handleCategorySubmit = async (payload) => {
    if (categoryModal?._id) {
      await categoryService.updateCategory(categoryModal._id, payload);
    } else {
      await categoryService.createCategory(payload);
    }
    setCategoryModal(null);
    loadData();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? This cannot be undone.')) return;
    try {
      await categoryService.deleteCategory(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Could not delete category');
    }
  };

  // --- Product actions ---
  const handleProductSubmit = async (payload) => {
    if (productModal?._id) {
      await productService.updateProduct(productModal._id, payload);
    } else {
      await productService.createProduct(payload);
    }
    setProductModal(null);
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await productService.deleteProduct(id);
      loadData();
    } catch (err) {
      alert(err.message || 'Could not delete product');
    }
  };

  const categoryName = (id) => categories.find((c) => c._id === id)?.name || '—';

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-stone-900">Catalog</h1>
      <p className="mt-1 text-sm text-stone-500">Manage categories and products.</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Categories table */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Categories</h2>
          <button
            onClick={() => setCategoryModal({})}
            className="flex items-center gap-1.5 rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Parent</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-stone-400">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-stone-400">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-stone-900">{cat.name}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {cat.parentCategory?.name ||
                        (typeof cat.parentCategory === 'string'
                          ? categoryName(cat.parentCategory)
                          : '—')}
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-stone-500">
                      {cat.description || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setCategoryModal(cat)}
                          className="text-stone-500 hover:text-teal-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="text-stone-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Products table */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Products</h2>
          <button
            onClick={() => setProductModal({})}
            className="flex items-center gap-1.5 rounded-md bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        <div className="mt-3 overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-stone-400">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-stone-400">
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-3">
                      <img
                        src={product.images?.[0] || 'https://placehold.co/60x60?text=No+Image'}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-900">{product.name}</td>
                    <td className="px-4 py-3 text-stone-500">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-stone-500">${product.price?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-stone-500">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setProductModal(product)}
                          className="text-stone-500 hover:text-teal-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-stone-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {categoryModal !== null && (
        <CategoryFormModal
          category={categoryModal._id ? categoryModal : null}
          allCategories={categories}
          onClose={() => setCategoryModal(null)}
          onSubmit={handleCategorySubmit}
        />
      )}

      {productModal !== null && (
        <ProductFormModal
          product={productModal._id ? productModal : null}
          categories={categories}
          onClose={() => setProductModal(null)}
          onSubmit={handleProductSubmit}
        />
      )}
    </div>
  );
};

export default Catalog;