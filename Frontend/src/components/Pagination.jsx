import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-300 text-stone-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-teal-700 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-stone-300 text-stone-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-stone-100"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;