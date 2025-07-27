import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../services/api';

function CreateProjectModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deadline: '',
  });
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
      await api.createProject(formData);
      onSuccess();
    } catch (error) {
      setError(error.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full max-h-[92vh] overflow-y-auto border border-gray-100">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 rounded transition duration-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md font-medium text-sm animate-shake shadow">
              <span className="font-bold text-base">!</span>
              {error}
            </div>
          )}
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all px-4 py-2 bg-white text-base placeholder-gray-400"
              placeholder="Enter project name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all px-4 py-2 bg-white text-base placeholder-gray-400 resize-none"
              placeholder="Enter project description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all px-4 py-2 bg-white text-base placeholder-gray-400"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 pt-3">
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
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition shadow-sm text-base disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full animate-spin border-b-2 border-white border-2"></span>
                  Creating...
                </span>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
