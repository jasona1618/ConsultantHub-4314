import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiPlus, FiEdit2, FiTrash2, FiPaperclip } from 'react-icons/fi';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      client: 'Acme Corp',
      status: 'In Progress',
      deadline: '2024-04-15',
      description: 'Complete website overhaul with modern design',
      files: []
    },
    {
      id: 2,
      name: 'Mobile App Development',
      client: 'Tech Solutions',
      status: 'Planning',
      deadline: '2024-05-01',
      description: 'Native mobile app for iOS and Android',
      files: []
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showUpload, setShowUpload] = useState(null);

  const ProjectModal = () => {
    const [formData, setFormData] = useState(editingProject || {
      name: '',
      client: '',
      status: 'Planning',
      deadline: '',
      description: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (editingProject) {
        setProjects(projects.map(p => 
          p.id === editingProject.id ? { ...formData, id: p.id } : p
        ));
      } else {
        setProjects([...projects, { ...formData, id: Date.now(), files: [] }]);
      }
      setShowModal(false);
      setEditingProject(null);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 w-full max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'New Project'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>On Hold</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                rows="3"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingProject(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
              >
                {editingProject ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleUploadComplete = (projectId, uploadedFiles) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          files: [...(p.files || []), ...uploadedFiles]
        };
      }
      return p;
    }));
    setShowUpload(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        {user.role === 'admin' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <FiPlus className="mr-2" />
            New Project
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <p className="text-sm text-gray-500">{project.client}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowUpload(project.id)}
                  className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100"
                >
                  <FiPaperclip className="w-5 h-5" />
                </button>
                {user.role === 'admin' && (
                  <>
                    <button
                      onClick={() => {
                        setEditingProject(project);
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-600 hover:text-primary-600 rounded-full hover:bg-gray-100"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                    >
                      <FiTrash2 />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Deadline</p>
                <p className="mt-1 text-sm text-gray-900">{project.deadline}</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-600">{project.description}</p>

            {/* File Upload Section */}
            {showUpload === project.id && (
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-medium text-gray-900">Upload Files</h4>
                  <button
                    onClick={() => setShowUpload(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX />
                  </button>
                </div>
                <FileUpload
                  projectId={project.id}
                  onUploadComplete={(files) => handleUploadComplete(project.id, files)}
                />
              </div>
            )}

            {/* Display Files */}
            {project.files && project.files.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Files</h4>
                <div className="space-y-2">
                  {project.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center p-2 bg-gray-50 rounded-md"
                    >
                      <FiFile className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {showModal && <ProjectModal />}
    </div>
  );
};

export default Projects;