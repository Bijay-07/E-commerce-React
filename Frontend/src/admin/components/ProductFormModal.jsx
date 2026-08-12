import { useState } from 'react';
import Modal from './Modal';

const inputClasses =
  'mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700';

const ProductFormModal = ({ product, categories, onClose, onSubmit }) => {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price ?? '',
    discountPrice: product?.discountPrice ?? '',
    category: product?.category?._id || product?.category || '',
    stock: product?.stock ?? '',
    brand: product?.brand || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing) {
        // No multer middleware on update — send plain JSON, numbers coerced
        await onSubmit({
          ...formData,
          price: Number(formData.price),
          discountPrice: Number(formData.discountPrice) || 0,
          stock: Number(formData.stock),
        });
      } else {
        // Creation expects multipart/form-data — the backend reads the file
        // from the field name "images" (singular field, despite the name)
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => fd.append(key, value));
        if (imageFile) fd.append('images', imageFile);
        await onSubmit(fd);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? 'Edit Product' : 'Add Product'} onClose={onClose}>
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-stone-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-stone-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700">Discount Price</label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-stone-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className={inputClasses}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={inputClasses}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {isEditing ? (
          <p className="rounded-md bg-stone-50 p-3 text-xs text-stone-500">
            Product images can't be changed here yet — the backend's update
            endpoint doesn't support file uploads. Delete and recreate the
            product to change its image, or ask to have image updates added
            to the backend.
          </p>
        ) : (
          <div>
            <label className="text-sm font-medium text-stone-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="mt-1 w-full text-sm text-stone-600 file:mr-3 file:rounded-md file:border-0 file:bg-teal-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-teal-800"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;