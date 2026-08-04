import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../components/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await register(payload);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-stone-900">Create account</h1>
      <p className="mt-2 text-stone-500">Sign up to start shopping.</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-stone-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-700">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-teal-700 hover:text-teal-800">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;