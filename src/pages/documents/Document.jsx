import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '../../api/apiFetch';
import apiPath from '../../api/apiPath';
import toast from 'react-hot-toast';
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileExcel,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaEye,
  FaDownload,
  FaSpinner,
  FaCheck,
  FaPaperclip,
  FaEdit
} from 'react-icons/fa';
import { FiEdit, FiUploadCloud } from 'react-icons/fi';
import { MdOutlineDragIndicator } from 'react-icons/md';

export default function DocumentUploadSection({ candidateId, candidateName }) {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  console.log("selectedfile", selectedFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [editingFileId, setEditingFileId] = useState(null);

  const documentTypes = [
    { id: 'resume', name: 'Resume', icon: <FaFilePdf />, required: true, accept: '.pdf,.doc,.docx' },
    { id: 'aadhar', name: 'Aadhar Card', icon: <FaFileImage />, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
    { id: 'pan', name: 'PAN Card', icon: <FaFileImage />, required: true, accept: '.jpg,.jpeg,.png,.pdf' },
    { id: 'passport', name: 'Passport', icon: <FaFileImage />, required: false, accept: '.jpg,.jpeg,.png,.pdf' },
    { id: 'experience', name: 'Experience Letter', icon: <FaFileWord />, required: true, accept: '.pdf,.doc,.docx' },
    { id: 'education', name: 'Education Certificate', icon: <FaFileWord />, required: true, accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png' },
    { id: 'salary', name: 'Salary Slips', icon: <FaFileExcel />, required: true, accept: '.pdf,.xlsx,.xls' },
    { id: 'photo', name: 'Passport Photo', icon: <FaFileImage />, required: true, accept: '.jpg,.jpeg,.png' },
    { id: 'bank', name: 'Bank Details', icon: <FaFilePdf />, required: true, accept: '.pdf,.jpg,.jpeg,.png' },
    { id: 'offer', name: 'Offer Letter', icon: <FaFileWord />, required: false, accept: '.pdf,.doc,.docx' },
  ];

  const onDrop = useCallback((acceptedFiles) => {
    const filesWithPreview = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending',
      uploaded: false,
      error: null,
      documentType: '', // Each file will have its own document type
      documentTypeName: ''
    }));
    setSelectedFiles(prev => [...prev, ...filesWithPreview]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: true
  });

  const updateFileDocumentType = (fileId, typeId) => {
    console.log("filedid", fileId);
    console.log("typeid", typeId);
    const documentType = documentTypes.find(t => t.id === typeId);
    console.log("documenttype", documentType);
    setSelectedFiles(prev => prev.map(f =>
      f.id === fileId
        ? {
          ...f,
          documentType: typeId,
          documentTypeName: documentType?.name || ''
        }
        : f
    ));
    setEditingFileId(null);
  };

  // Single mutation for batch upload
  const uploadMutation = useMutation({
    mutationFn: async (files) => {
      console.log("files", files);
      const formData = new FormData();

      // Append all files to FormData with their types
      files.forEach((fileItem, index) => {
        formData.append(`documents[${index}][file]`, fileItem.file);
        formData.append(`documents[${index}][type]`, fileItem.documentType);
        formData.append(`documents[${index}][filename]`, fileItem.file.name);
      });

      // Append metadata
      formData.append('candidateId', candidateId);
      formData.append('fileCount', files.length.toString());

      // Track progress for all files
      const totalSize = files.reduce((sum, fileItem) => sum + fileItem.file.size, 0);
      let loaded = 0;

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            loaded = event.loaded;
            const overallProgress = Math.round((loaded * 100) / totalSize);

            // Update individual file progress proportionally
            const newProgress = {};
            files.forEach((fileItem) => {
              // Calculate proportional progress for each file
              const fileProgress = Math.min(
                Math.round((loaded * (fileItem.file.size / totalSize) * 100) / fileItem.file.size),
                100
              );
              newProgress[fileItem.id] = fileProgress;
            });

            setUploadProgress(newProgress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve({ response, files });
          } else {
            reject(new Error('Upload failed'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Upload failed')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', apiPath.uploadDocument);
        const token = localStorage.getItem('token');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    onSuccess: (data) => {
      // Update all files status
      setSelectedFiles(prev => prev.map(f => {
        const wasInUpload = data.files.some(uploadFile => uploadFile.id === f.id);
        return wasInUpload ? { ...f, status: 'success', uploaded: true, error: null } : f;
      }));

      toast.success(`${data.files.length} documents uploaded successfully`);
      queryClient.invalidateQueries(['candidateDocuments', candidateId]);
      setIsUploading(false);
    },
    onError: (error, variables) => {
      // Mark all files as error
      setSelectedFiles(prev => prev.map(f => {
        const wasInUpload = variables.some(uploadFile => uploadFile.id === f.id);
        return wasInUpload ? { ...f, status: 'error', error: error.message } : f;
      }));

      toast.error(error.message || 'Failed to upload documents');
      setIsUploading(false);
    },
    onMutate: (variables) => {
      setIsUploading(true);
      // Set initial status for all files being uploaded
      setSelectedFiles(prev => prev.map(f => {
        const isUploading = variables.some(uploadFile => uploadFile.id === f.id);
        return isUploading && !f.uploaded ? { ...f, status: 'uploading' } : f;
      }));
    }
  });

  const handleUpload = () => {
    // Filter files that are ready for upload
    const filesToUpload = selectedFiles.filter(fileItem =>
      !fileItem.uploaded && fileItem.documentType
    );

    const filesMissingType = selectedFiles.filter(fileItem =>
      !fileItem.uploaded && !fileItem.documentType
    );

    if (filesToUpload.length === 0) {
      if (filesMissingType.length > 0) {
        toast.error(`Please select document type for ${filesMissingType.length} file(s)`);
      } else {
        toast.error('No new files to upload');
      }
      return;
    }

    // Start batch upload
    uploadMutation.mutate(filesToUpload);
  };

  const retrySingleFile = (fileItem) => {
    // Create a new array with just this file
    uploadMutation.mutate([fileItem]);
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    if (editingFileId === fileId) {
      setEditingFileId(null);
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setUploadProgress({});
    setEditingFileId(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    console.log(
      "filename", fileName
    );
    const ext = fileName.split('.').pop().toLowerCase();

    if (['pdf'].includes(ext)) return <FaFilePdf className="text-red-500" />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord className="text-blue-500" />;
    if (['xls', 'xlsx'].includes(ext)) return <FaFileExcel className="text-green-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <FaFileImage className="text-purple-500" />;
    return <FaFilePdf className="text-gray-500" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <FaCheckCircle className="text-green-500" />;
      case 'error': return <FaTimesCircle className="text-red-500" />;
      case 'uploading': return <FaSpinner className="text-blue-500 animate-spin" />;
      default: return null;
    }
  };

  // Calculate overall progress
  const overallProgress = selectedFiles.length > 0
    ? Math.round(
      (selectedFiles.filter(f => f.uploaded).length / selectedFiles.length) * 100
    )
    : 0;

  const filesReadyForUpload = selectedFiles.filter(f => !f.uploaded && f.documentType).length;
  const filesMissingType = selectedFiles.filter(f => !f.uploaded && !f.documentType).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
            <p className="text-gray-600 mt-1">
              Upload documents for <span className="font-semibold text-blue-600">{candidateName}</span>
            </p>
          </div>
          {selectedFiles.length > 0 && (
            <button
              onClick={clearAll}
              disabled={isUploading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTrash /> Clear All
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Upload Progress
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {selectedFiles.filter(f => f.uploaded).length} of {selectedFiles.length} uploaded
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload Area */}
        <div className="lg:col-span-2">
          {/* Document Type Selection (Reference only) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Available Document Types
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {documentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-3 rounded-lg border transition-all duration-200 ${'border-gray-200 bg-gray-50'
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <div className="text-gray-600">
                        {type.icon}
                      </div>
                    </div>
                    <span className="font-medium text-sm text-gray-900 text-center">{type.name}</span>
                    {type.required && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div className="mb-6">
            <div
              {...getRootProps()}
              className={`border-1 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                ? 'border-blue-500 bg-blue-50/30 border-blue-500/50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/20'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} disabled={isUploading} />
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100">
                  {isDragActive ? (
                    <FaCloudUploadAlt className="text-3xl text-blue-600" />
                  ) : (
                    <FiUploadCloud className="text-3xl text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload PDF, DOC, Images, or Excel files. Max file size 5MB.
                  </p>
                  <button
                    type="button"
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiUploadCloud /> Browse Files
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  or drag and drop files here
                </p>
              </div>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Selected Files ({selectedFiles.length})</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MdOutlineDragIndicator className="text-lg" />
                  <span>Select document type for each file</span>
                </div>
              </div>

              <div className="space-y-4">
                {selectedFiles.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-gray-100 rounded-lg mt-1">
                          {getFileIcon(fileItem.file.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {fileItem.file.name}
                            </h4>
                            {fileItem.status === 'success' && (
                              <FaCheck className="text-green-500 text-sm" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>{formatFileSize(fileItem.file.size)}</span>
                            <span>•</span>
                            <span className="capitalize">{fileItem.file.type.split('/')[1] || 'File'}</span>
                          </div>

                          {/* Document Type Selection */}
                          <div className="mt-3">
                            {editingFileId === fileItem.id ? (
                              <div className="space-y-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Select Document Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {documentTypes.map((type) => (
                                    <button
                                      key={type.id}
                                      onClick={() => updateFileDocumentType(fileItem.id, type.id)}
                                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${fileItem.documentType === type.id
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                      {type.name}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  onClick={() => setEditingFileId(null)}
                                  className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                {fileItem.documentType ? (
                                  <>
                                    <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${documentTypes.find(t => t.id === fileItem.documentType)?.required
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-blue-100 text-blue-800'
                                      }`}>
                                      {fileItem.documentTypeName}
                                    </span>
                                    <button
                                      onClick={() => setEditingFileId(fileItem.id)}
                                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    >
                                      <FaEdit className="text-xs" /> Change
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <span className="px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-lg">
                                      Type not selected
                                    </span>
                                    <button
                                      onClick={() => setEditingFileId(fileItem.id)}
                                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                    >
                                      <FaEdit className="text-xs" /> Select Type
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {!fileItem.uploaded && uploadProgress[fileItem.id] !== undefined && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium text-blue-600">
                                  {uploadProgress[fileItem.id]}% uploaded
                                </span>
                                <span className="text-xs text-gray-500">
                                  {getStatusIcon(fileItem.status)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[fileItem.id] || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Error message */}
                          {fileItem.error && (
                            <p className="text-xs text-red-500 mt-1">
                              {fileItem.error}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!fileItem.uploaded ? (
                          <>
                            {fileItem.status === 'error' && (
                              <button
                                onClick={() => retrySingleFile(fileItem)}
                                disabled={isUploading || !fileItem.documentType}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Retry upload"
                              >
                                <FiUploadCloud />
                              </button>
                            )}
                            <button
                              onClick={() => removeFile(fileItem.id)}
                              disabled={isUploading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                              title="Remove file"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Download"
                            >
                              <FaDownload />
                            </button>
                            <button
                              onClick={() => removeFile(fileItem.id)}
                              disabled={isUploading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Upload Actions & Info */}
        <div className="space-y-6">
          {/* Upload Button */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Upload Status</h3>
                  <span className="text-sm text-gray-500">
                    {filesReadyForUpload} ready
                  </span>
                </div>
                {filesMissingType > 0 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                    <FaTimesCircle />
                    <span>{filesMissingType} file(s) need type selection</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={
                  filesReadyForUpload === 0 ||
                  isUploading
                }
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUploadCloud className="text-lg" />
                    Upload {filesReadyForUpload} Document(s)
                  </>
                )}
              </button>

              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500 text-xs" />
                  <span>Each file will be tagged with its document type</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheck className="text-green-500 text-xs" />
                  <span>Files without type selection won't be uploaded</span>
                </div>
              </div>
            </div>
          </div>

          {/* Document Requirements Summary */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Requirements Summary</h3>
            <div className="space-y-3">
              {documentTypes.filter(type => type.required).map((type) => {
                const uploadedCount = selectedFiles.filter(f =>
                  f.uploaded && f.documentType === type.id
                ).length;
                return (
                  <div
                    key={type.id}
                    className="p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-gray-200">
                          {type.icon}
                        </div>
                        <div>
                          <span className="font-medium text-sm text-gray-900">{type.name}</span>
                          <p className="text-xs text-gray-500">Required</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${uploadedCount > 0 ? 'text-green-600' : 'text-gray-500'
                          }`}>
                          {uploadedCount} uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upload Tips */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FaPaperclip /> Upload Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Select document type for each file before uploading</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>You can upload multiple files of different types at once</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>Files without type selection will not be uploaded</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                <span>All required documents must be uploaded for complete verification</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaCloudUploadAlt className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{selectedFiles.length}</p>
                <p className="text-sm text-gray-500">Total Files</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheck className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedFiles.filter(f => f.uploaded).length}
                </p>
                <p className="text-sm text-gray-500">Uploaded</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUploadCloud className="text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filesReadyForUpload}
                </p>
                <p className="text-sm text-gray-500">Ready to Upload</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaEdit className="text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filesMissingType}
                </p>
                <p className="text-sm text-gray-500">Need Type</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}