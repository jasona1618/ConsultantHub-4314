import { useState } from 'react';
import { FiUpload, FiFile, FiImage, FiVideo, FiX, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { encryptData } from '../utils/encryption';
import { logHIPAAEvent } from '../utils/hipaaLogger';

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB in bytes
const MAX_TOTAL_SIZE = 10 * 1024 * 1024 * 1024; // 10GB total

const FileUpload = ({ projectId, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const validateFiles = (newFiles) => {
    const currentTotalSize = files.reduce((sum, file) => sum + file.size, 0);
    const newTotalSize = newFiles.reduce((sum, file) => sum + file.size, 0);

    if (currentTotalSize + newTotalSize > MAX_TOTAL_SIZE) {
      setError('Total file size exceeds 10GB limit');
      return false;
    }

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 10GB size limit`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = [...e.dataTransfer.files];
    if (validateFiles(droppedFiles)) {
      processFiles(droppedFiles);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files];
    if (validateFiles(selectedFiles)) {
      processFiles(selectedFiles);
    }
  };

  const processFiles = (newFiles) => {
    const processed = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0
    }));
    setFiles(prev => [...prev, ...processed]);
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
    setError(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    setUploading(true);
    
    for (const file of files) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target.result;
          
          const isSensitive = file.name.toLowerCase().includes('hipaa') || 
                            file.name.toLowerCase().includes('medical') ||
                            file.name.toLowerCase().includes('patient');
          
          const fileData = isSensitive ? encryptData(content) : content;
          
          for (let progress = 0; progress <= 100; progress += 10) {
            setFiles(prev => 
              prev.map(f => 
                f.id === file.id ? { ...f, progress } : f
              )
            );
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          if (isSensitive) {
            logHIPAAEvent({
              user: 'current_user',
              action: 'file_upload',
              resourceType: 'sensitive_document',
              resourceId: file.id,
              accessType: 'write',
              status: 'completed'
            });
          }
        };
        reader.readAsDataURL(file.file);
      } catch (error) {
        console.error('Upload failed:', error);
        setError(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    onUploadComplete && onUploadComplete(files);
    setFiles([]);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return FiImage;
    if (type.startsWith('video/')) return FiVideo;
    return FiFile;
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <FiUpload className="w-8 h-8 text-gray-400" />
          <p className="text-gray-600">
            Drag and drop files here, or{' '}
            <label className="text-primary-600 hover:text-primary-700 cursor-pointer">
              browse
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Maximum file size: 10GB (Total: 10GB)
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center"
          >
            <FiAlertCircle className="w-5 h-5 mr-2" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="text-sm text-gray-600">
            Total size: {formatFileSize(totalSize)}
          </div>
          {files.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-lg p-3 shadow-sm flex items-center"
              >
                <FileIcon className="w-5 h-5 text-gray-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  {file.progress > 0 && (
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                      <div
                        className="h-1 bg-primary-500 rounded-full"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-100 rounded-full ml-3"
                >
                  <FiX className="w-4 h-4 text-gray-500" />
                </button>
              </motion.div>
            );
          })}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;