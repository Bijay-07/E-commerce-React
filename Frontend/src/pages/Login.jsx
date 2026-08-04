import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../components/AuthContext';
import { toast, ToastContainer } from "react-toastify";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(formData);
      toast("Login Successfully");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-semibold text-stone-900">Welcome back</h1>
      <p className="mt-2 text-stone-500">Log in to your account to continue.</p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-teal-700 px-6 py-3 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-teal-700 hover:text-teal-800">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;