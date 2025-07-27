import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Calendar, 
  CheckCircle, 
  Clock,
  Download,
  Trash2,
  UserPlus,
  Upload,
  Mail,
  User
} from 'lucide-react';
import AssignUserModal from '../dashboard/AssignUserModal';
import UploadDocumentModal from '../dashboard/UploadDocumentModal';

function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, assignmentsData, documentsData] = await Promise.all([
        api.getProject(projectId),
        api.getProjectAssignments(projectId),
        api.getProjectDocuments(projectId)
      ]);
      
      setProject(projectData);
      setAssignments(assignmentsData);
      setDocuments(documentsData);
    } catch (error) {
      setError('Failed to load project data');
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAssigned = () => {
    setShowAssignModal(false);
    fetchProjectData();
  };

  const handleDocumentUploaded = () => {
    setShowUploadModal(false);
    fetchProjectData();
  };

  const handleRemoveUser = async (userId) => {
    if (!confirm('Are you sure you want to remove this user from the project?')) {
      return;
    }

    try {
      await api.removeUserFromProject(projectId, userId);
      fetchProjectData();
    } catch (error) {
      setError('Failed to remove user from project');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.deleteDocument(documentId);
      fetchProjectData();
    } catch (error) {
      setError('Failed to delete document');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
          <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
        Active
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600 border-4"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
          <p className="mt-2 text-gray-600">The project you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="inline-block mt-4 rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:justify-between md:items-start mt-4 gap-4 md:gap-0">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">{project.name}</h1>
              {getStatusBadge(project.status)}
            </div>
            <p className="text-gray-600 whitespace-pre-line">{project.description || 'No description provided'}</p>
          </div>
          {(user?.role === 'admin' || user?.role === 'project_lead') && (
            <div className="flex space-x-2 flex-shrink-0">
              <button
                onClick={() => setShowAssignModal(true)}
                className="btn-secondary flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 hover:bg-primary-100 transition"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                <span>Assign User</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-600 hover:bg-primary-700 transition"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                <span>Upload Document</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm shadow-md">
          <span className="font-bold text-lg">!</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Project Info */}
        <section className="card bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Information</h2>
          <div className="space-y-4 text-gray-700 text-sm">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
              <span>Deadline:</span>
              <span className="ml-2 font-medium">{formatDate(project.deadline)}</span>
            </div>
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
              <span>Created by:</span>
              <span className="ml-2 font-medium">{project.created_by_name}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-3 text-gray-400" aria-hidden="true" />
              <span>Team size:</span>
              <span className="ml-2 font-medium">{assignments.length} member{assignments.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </section>

        {/* Team Members */}
        <section className="card bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h2>
          {assignments.length === 0 ? (
            <p className="text-gray-500 text-sm">No team members assigned yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[40vh] overflow-y-auto">
              {assignments.map((assignment) => (
                <li 
                  key={assignment.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{assignment.username}</p>
                      <p className="text-sm text-gray-500 truncate">{assignment.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700 select-none">{assignment.role}</span>
                    {(user?.role === 'admin' || user?.role === 'project_lead') && (
                      <button
                        onClick={() => handleRemoveUser(assignment.id)}
                        className="text-red-600 hover:text-red-700 rounded p-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition"
                        title="Remove from project"
                        aria-label={`Remove ${assignment.username} from project`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Project Documents */}
        <section className="card bg-white rounded-2xl shadow p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Documents</h2>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
          ) : (
            <ul className="space-y-3 max-h-[40vh] overflow-y-auto">
              {documents.map((document) => (
                <li 
                  key={document.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <FileText className="h-5 w-5 text-primary-600" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{document.original_name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {formatFileSize(document.file_size)} &bull; Uploaded by {document.uploaded_by_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <a
                      href={api.getFileUrl(document.filename)}
                      download={document.original_name}
                      className="text-primary-600 hover:text-primary-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                      title="Download document"
                      aria-label={`Download document ${document.original_name}`}
                    >
                      <Download className="h-5 w-5" aria-hidden="true" />
                    </a>
                    {(user?.role === 'admin' || user?.role === 'project_lead') && (
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-700 rounded p-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition"
                        title="Delete document"
                        aria-label={`Delete document ${document.original_name}`}
                      >
                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Modals */}
      {showAssignModal && (
        <AssignUserModal
          project={project}
          onClose={() => setShowAssignModal(false)}
          onSuccess={handleUserAssigned}
        />
      )}
      
      {showUploadModal && (
        <UploadDocumentModal
          project={project}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleDocumentUploaded}
        />
      )}
    </div>
  );
}

export default ProjectDetails;
