import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import MarkusLogo from '../assets/Markus_Logo.jpeg'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Orders', path: '/orders' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = 0; // TODO: wire up to CartContext once it's built

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const linkClasses = ({ isActive }) =>
    `relative text-sm font-medium tracking-wide transition-colors ${
      isActive ? 'text-teal-700' : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo placeholder */}
        <Link to="/" className="flex items-center gap-2">
          <img src={MarkusLogo} alt='M' className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-700 font-serif text-lg font-bold text-white"/>
          <span className="font-serif text-xl font-semibold text-stone-900">
            Markus
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={linkClasses}>
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Right side actions */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            to="/cart"
            className="relative text-stone-600 transition-colors hover:text-stone-900"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-teal-700 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  <LayoutDashboard size={16} />
                  Admin Panel
                </Link>
              )}
              <span className="flex items-center gap-1.5 text-sm font-medium text-stone-700">
                <User size={16} />
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-stone-900"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="text-stone-700 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-stone-200 bg-stone-50 px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={linkClasses}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-sm font-medium text-stone-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm font-medium text-teal-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={18} /> Admin Panel
                  </Link>
                )}
                <span className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <User size={18} /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-stone-500"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-medium text-stone-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} /> Login
                </Link>
                <Link
                  to="/register"
                  className="w-fit rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;