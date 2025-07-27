import { useState } from 'react';
import { X, Upload, File } from 'lucide-react';
import api from '../../services/api';

function UploadDocumentModal({ project, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed'
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.zip', '.rar'];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      setSelectedFile(null);
      return;
    }
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setError('Invalid file type. Allowed: Images, PDF, DOC, TXT, ZIP, RAR');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.uploadDocument(project.id, selectedFile);
      onSuccess();
    } catch (error) {
      setError(error.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full max-h-[92vh] overflow-y-auto border border-gray-100">
        {/* Modal header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Upload Document
          </h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600 rounded transition duration-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {/* Modal body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">Upload a document for this project</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md font-medium text-sm animate-shake shadow">
              <span className="font-bold text-base">!</span>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="file-upload" className="block font-medium text-gray-700 mb-2 cursor-pointer">
              Select File <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-center justify-center px-6 py-7 border-2 border-dashed border-gray-300 rounded-xl bg-slate-50 hover:border-blue-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mb-1" />
              <label htmlFor="file-upload" className="block text-blue-600 cursor-pointer font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">
                Upload a file
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileSelect}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
                  disabled={loading}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF, PDF, DOC, TXT, ZIP, RAR up to 10MB</p>
              <span className="text-xs text-gray-400">or drag and drop</span>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3 mt-2">
              <File className="h-7 w-7 text-blue-600" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</div>
                <div className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</div>
              </div>
              <button
                type="button"
                aria-label="Remove file"
                disabled={loading}
                onClick={() => setSelectedFile(null)}
                className="text-gray-400 hover:text-red-500 rounded p-1 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

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
              disabled={loading || !selectedFile}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 transition shadow-sm text-base disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full animate-spin border-b-2 border-white border-2"></span>
                  Uploading...
                </span>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadDocumentModal;
