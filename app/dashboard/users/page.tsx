'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl: string;
  publicMetadata: {
    role?: string;
  };
  createdAt: number;
  lastSignInAt: number | null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, publicMetadata: { ...user.publicMetadata, role: newRole } }
            : user
        ));
      } else {
        alert('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const email = user.emailAddresses[0]?.emailAddress || '';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return email.toLowerCase().includes(search) || fullName.includes(search);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-gray-400 mt-2">Manage user accounts and permissions</p>
      </div>

      {/* Search and Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
        </div>
        <div className="glass-dark rounded-xl border border-gray-700/50 p-4">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-2xl font-bold text-white mt-1">{users.length}</p>
        </div>
        <div className="glass-dark rounded-xl border border-gray-700/50 p-4">
          <p className="text-sm text-gray-400">Admins</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">
            {users.filter(u => ['admin', 'super_admin'].includes(u.publicMetadata?.role || '')).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-dark rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700/50">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={user.imageUrl} 
                        alt={user.firstName || 'User'}
                        className="h-10 w-10 rounded-full border-2 border-gray-700/50"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {user.emailAddresses[0]?.emailAddress}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.publicMetadata?.role || 'viewer'}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      disabled={updatingUserId === user.id}
                      className="px-3 py-1 bg-gray-800/50 border border-gray-700/50 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-700/30 disabled:cursor-not-allowed"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {user.lastSignInAt 
                      ? new Date(user.lastSignInAt).toLocaleDateString()
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
