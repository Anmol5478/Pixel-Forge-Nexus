import { useState, useEffect } from 'react';
import { X, Users } from 'lucide-react';
import api from '../../services/api';

function AssignUserModal({ project, onClose, onSuccess }) {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    try {
      setFetchingUsers(true);
      const users = await api.getAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      setError('Failed to load available users');
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.assignUserToProject(project.id, selectedUserId);
      onSuccess();
    } catch (error) {
      setError(error.message || 'Failed to assign user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full max-h-[92vh] overflow-y-auto border border-gray-100">
        {/* Modal header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Assign Team Member</h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 rounded transition duration-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">Select a developer to assign to this project</p>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md font-medium text-sm animate-shake shadow">
              <span className="font-bold text-base">!</span>
              {error}
            </div>
          )}
          <div>
            <label htmlFor="userId" className="block font-medium text-gray-700 mb-2">
              Select Developer <span className="text-red-500">*</span>
            </label>
            {fetchingUsers ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 border-2"></div>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No available developers found</p>
              </div>
            ) : (
              <select
                id="userId"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all px-4 py-2 bg-white text-base placeholder-gray-400"
                required
                disabled={loading}
              >
                <option value="">Select a developer...</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 font-medium text-gray-700 bg-white hover:bg-slate-100 transition text-base py-2 shadow-sm disabled:opacity-70"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedUserId || fetchingUsers}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition shadow-sm text-base disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full animate-spin border-b-2 border-white border-2"></span>
                  Assigning...
                </span>
              ) : (
                'Assign User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssignUserModal;
