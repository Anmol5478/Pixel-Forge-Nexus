import { useState } from 'react';
import { X, User, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

function CreateUserModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'developer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createUser(formData);
      onSuccess();
    } catch (error) {
      setError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin':
        return 'Full system access, can manage all projects and users';
      case 'project_lead':
        return 'Can create projects, assign team members, and upload documents';
      case 'developer':
        return 'Can view assigned projects and access project documents';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full max-h-[92vh] overflow-y-auto border border-gray-100">
        {/* Modal header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5" autoComplete="off">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md font-medium text-sm animate-shake shadow-sm">
              <span className="font-bold text-base">!</span>
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition px-10 py-2 text-base placeholder-gray-400 bg-white"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition px-10 py-2 text-base placeholder-gray-400 bg-white"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition px-4 py-2 pr-10 text-base placeholder-gray-400 bg-white"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block font-medium text-gray-700 mb-2">
              Role <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition px-10 py-2 text-base bg-white"
              >
                <option value="developer">Developer</option>
                <option value="project_lead">Project Lead</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <p className="mt-1 text-xs text-gray-500">{getRoleDescription(formData.role)}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-200 font-medium text-gray-700 bg-white hover:bg-slate-100 transition text-base py-2 shadow-sm disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition shadow-sm text-base disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full animate-spin border-b-2 border-white border-2"></span>
                  Creating...
                </span>
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;
