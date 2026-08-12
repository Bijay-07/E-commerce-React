import { useState } from 'react';
import Modal from './Modal';

const inputClasses =
  'mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700';

const CategoryFormModal = ({ category, allCategories, onClose, onSubmit }) => {
  const isEditing = Boolean(category);

  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    parentCategory: category?.parentCategory?._id || category?.parentCategory || '',
    image: category?.image || '',
  });
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
      const payload = {
        ...formData,
        parentCategory: formData.parentCategory || null,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  // A category can't be its own parent, and shouldn't list itself
  const parentOptions = allCategories.filter((c) => c._id !== category?._id);

  return (
    <Modal title={isEditing ? 'Edit Category' : 'Add Category'} onClose={onClose}>
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
        <div>
          <label className="text-sm font-medium text-stone-700">Parent Category</label>
          <select
            name="parentCategory"
            value={formData.parentCategory}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="">None (top-level)</option>
            {parentOptions.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">Image URL (optional)</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://..."
            className={inputClasses}
          />
        </div>

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
            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;