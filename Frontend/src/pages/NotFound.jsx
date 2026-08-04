import { Link } from 'react-router';

const NotFound = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-serif text-5xl font-semibold text-stone-900">404</h1>
      <p className="mt-3 text-stone-600">Page not found.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-teal-700 px-5 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;