import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  Users, 
  Plus, 
  User, 
  Mail, 
  Shield,
  Calendar,
  Trash2,
  Edit
} from 'lucide-react';
import CreateUserModal from './CreateUserModal';

function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      setError('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    setShowCreateModal(false);
    fetchUsers();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'project_lead': return 'Project Lead';
      case 'developer': return 'Developer';
      default: return role;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      project_lead: 'bg-blue-100 text-blue-800',
      developer: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role] || 'bg-gray-100 text-gray-800'}`}>
        <Shield className="h-3 w-3 mr-1" />
        {getRoleDisplayName(role)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 border-4"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage team members and their roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
        >
          <Plus className="h-5 w-5" />
          <span>New User</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm shadow-sm">
          <span className="font-bold text-lg leading-none">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Empty state */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center py-16 rounded-2xl bg-white/80 shadow-inner">
          <Users className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-800">No users</h3>
          <p className="text-gray-500 text-sm mt-2">
            Get started by creating a new user account.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            New User
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-2xl border border-gray-200 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((userItem) => (
                <tr key={userItem.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600" aria-hidden="true" />
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{userItem.username}</div>
                        <div className="text-sm text-gray-500 flex items-center truncate">
                          <Mail className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                          <span className="truncate">{userItem.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(userItem.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" aria-hidden="true" />
                      <span>{formatDate(userItem.created_at)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="text-primary-600 hover:text-primary-900 rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Edit user {userItem.username}</span>
                      </button>
                      {userItem.id !== user?.id && (
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-900 rounded p-1 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">Delete user {userItem.username}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleUserCreated}
        />
      )}
    </div>
  );
}

export default UserManagement;
