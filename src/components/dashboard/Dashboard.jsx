import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Plus,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Upload,
  UserPlus,
} from 'lucide-react';
import CreateProjectModal from './CreateProjectModal';
import AssignUserModal from './AssignUserModal';
import UploadDocumentModal from './UploadDocumentModal';

function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    fetchProjects();
  };

  const handleUserAssigned = () => {
    setShowAssignModal(false);
    fetchProjects();
  };

  const handleDocumentUploaded = () => {
    setShowUploadModal(false);
    fetchProjects();
  };

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      await api.updateProjectStatus(projectId, newStatus);
      fetchProjects();
    } catch (error) {
      setError('Failed to update project status');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <CheckCircle className="h-3 w-3" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
        <Clock className="h-3 w-3" />
        Active
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
      {/* Top bar */}
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-0.5">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}! Here are your projects.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm shadow">
          <span className="font-bold text-lg leading-none">!</span>
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center py-16 bg-white/80 rounded-2xl shadow-inner">
          <div className="h-14 w-14 text-gray-300 mb-2 flex items-center justify-center">
            <FileText className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No projects</h3>
          <p className="text-gray-500 text-sm mt-2">
            {user?.role === 'admin'
              ? 'Get started by creating a new project.'
              : "You haven't been assigned to any projects yet."}
          </p>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex items-center gap-2 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white/80 border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-6 flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate" title={project.name}>
                  {project.name}
                </h3>
                {getStatusBadge(project.status)}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 grow">
                {project.description || 'No description provided'}
              </p>

              {/* Details */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center text-xs font-medium text-gray-500">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  <span>Deadline:&nbsp;<span className="font-medium text-gray-700">{formatDate(project.deadline)}</span></span>
                </div>
                <div className="flex items-center text-xs font-medium text-gray-500">
                  <Users className="h-4 w-4 mr-1.5" />
                  <span>Team:&nbsp;<span className="font-medium text-gray-700">{project.team_size || 0} member{project.team_size !== 1 ? 's' : ''}</span></span>
                </div>
                <div className="flex items-center text-xs font-medium text-gray-500">
                  <FileText className="h-4 w-4 mr-1.5" />
                  <span>Created by:&nbsp;<span className="font-medium text-gray-700">{project.created_by_name}</span></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <Link
                  to={`/projects/${project.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-800 text-sm font-medium py-2 transition"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </Link>
                {(user?.role === 'admin' || user?.role === 'project_lead') && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowAssignModal(true);
                      }}
                      className="rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-500 hover:text-blue-800 p-2 transition"
                      title="Assign Team Member"
                    >
                      <UserPlus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowUploadModal(true);
                      }}
                      className="rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-500 hover:text-blue-800 p-2 transition"
                      title="Upload Document"
                    >
                      <Upload className="h-4 w-4" />
                    </button>
                  </>
                )}
                {user?.role === 'admin' && (
                  <button
                    onClick={() =>
                      handleStatusUpdate(
                        project.id,
                        project.status === 'active' ? 'completed' : 'active'
                      )
                    }
                    className={`rounded-lg font-medium flex items-center justify-center p-2 text-sm shadow transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                      project.status === 'active'
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                    title={project.status === 'active' ? 'Mark Complete' : 'Mark Active'}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleProjectCreated}
        />
      )}
      {showAssignModal && selectedProject && (
        <AssignUserModal
          project={selectedProject}
          onClose={() => setShowAssignModal(false)}
          onSuccess={handleUserAssigned}
        />
      )}
      {showUploadModal && selectedProject && (
        <UploadDocumentModal
          project={selectedProject}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleDocumentUploaded}
        />
      )}
    </div>
  );
}

export default Dashboard;
