import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const baseItem =
    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors';
  const activeItem = 'bg-teal-700 text-white';
  const inactiveItem = 'text-stone-600 hover:bg-stone-100';

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 md:block">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
          Categories
        </h2>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onSelect('')}
            className={`${baseItem} ${selectedCategory === '' ? activeItem : inactiveItem}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelect(cat._id)}
              className={`${baseItem} ${
                selectedCategory === cat._id ? activeItem : inactiveItem
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile dropdown */}
      <div className="relative mb-4 md:hidden">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700"
        >
          {selectedCategory
            ? categories.find((c) => c._id === selectedCategory)?.name || 'Category'
            : 'All Products'}
          <ChevronDown size={18} className={isOpen ? 'rotate-180' : ''} />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-stone-200 bg-white p-1 shadow-lg">
            <button
              onClick={() => {
                onSelect('');
                setIsOpen(false);
              }}
              className={`${baseItem} ${selectedCategory === '' ? activeItem : inactiveItem}`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  onSelect(cat._id);
                  setIsOpen(false);
                }}
                className={`${baseItem} ${
                  selectedCategory === cat._id ? activeItem : inactiveItem
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryFilter;