import { useEffect, useState } from 'react';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import userService from '../../api/userService';
import { useAuth } from '../../components/AuthContext';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = () => {
    setIsLoading(true);
    userService
      .getUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    const verb = newRole === 'admin' ? 'promote' : 'demote';

    if (!window.confirm(`Are you sure you want to ${verb} ${targetUser.name} to ${newRole}?`)) {
      return;
    }

    setUpdatingId(targetUser._id);
    setError(null);
    try {
      await userService.updateUser(targetUser._id, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError(err.message || `Could not ${verb} user`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-stone-900">Users</h1>
      <p className="mt-1 text-sm text-stone-500">
        Promote a customer to admin, or demote an admin back to customer.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-400">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-400">
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u._id === currentUser?._id;
                const isAdmin = u.role === 'admin';

                return (
                  <tr key={u._id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {u.name} {isSelf && <span className="text-xs text-stone-400">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{u.email}</td>
                    <td className="px-4 py-3 text-stone-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          isAdmin ? 'bg-teal-100 text-teal-700' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isSelf ? (
                        <span className="text-xs text-stone-400">Can't change your own role</span>
                      ) : (
                        <button
                          onClick={() => handleToggleRole(u)}
                          disabled={updatingId === u._id}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium disabled:opacity-50 ${
                            isAdmin
                              ? 'border border-stone-300 text-stone-600 hover:bg-stone-50'
                              : 'bg-teal-700 text-white hover:bg-teal-800'
                          }`}
                        >
                          {isAdmin ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                          {isAdmin ? 'Demote to Customer' : 'Promote to Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;