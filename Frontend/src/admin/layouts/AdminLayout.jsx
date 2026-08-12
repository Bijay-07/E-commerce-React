import { Outlet, NavLink, Link } from 'react-router';
import { LayoutDashboard, Package, ClipboardList, Users, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
  { name: 'Catalog', path: '/admin/catalog', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ClipboardList },
  { name: 'Users', path: '/admin/users', icon: Users },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-5 py-5">
          <span className="font-serif text-lg font-semibold text-stone-900">
            Admin Panel
          </span>
          <p className="mt-0.5 text-xs text-stone-500">{user?.name}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-stone-200 px-3 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            <ArrowLeft size={18} />
            Back to Store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;