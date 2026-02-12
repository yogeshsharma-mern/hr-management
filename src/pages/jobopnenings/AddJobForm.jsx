// AddJobForm.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaBriefcase, FaBuilding, FaMapMarkerAlt, FaUsers, FaFileAlt } from 'react-icons/fa';
import apiPath from '../../api/apiPath';
import { apiPost, apiPut } from '../../api/apiFetch';
import toast from 'react-hot-toast';
import { validateJobForm } from '../../validations/jobvalidation';
export default function AddJobForm({ onClose, jobData, mode = 'add', onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    noOfOpenings: "",
    description: "",
    status: "open"
  });
  const [errors, setErrors] = useState({});
  console.log("errrors",errors);

  const queryClient = useQueryClient();

  // Initialize form with job data for edit mode
  useEffect(() => {
    if (jobData && mode === 'edit') {
      setFormData({
        title: jobData.title || "",
        department: jobData.department || "",
        location: jobData.location || "",
        noOfOpenings: jobData.noOfOpenings || "",
        description: jobData.description || "",
        status: jobData.status || "open"
      });
    }
  }, [jobData, mode]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => apiPost(apiPath.JobOpenings, data),
    onSuccess: (data) => {
      console.log("data", data);
      toast.success(data?.message || "Job created successfully");
      queryClient.invalidateQueries(["jobOpenings"]);
      onSuccess?.();

    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data) => apiPut(`${apiPath.JobOpenings}/${jobData._id}`, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Job updated successfully");
      queryClient.invalidateQueries(["jobOpenings"]);
      onSuccess?.();
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "title" && value) {
      newValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    setErrors(prev => ({
  ...prev,
  [name]: ""
}));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hey");
    const validationErrors = validateJobForm(formData);
    console.log("validationErrors",validationErrors);
    // console.log("validationerrors",validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    if (mode === 'edit') {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <FaBriefcase className="text-blue-500" />
            Job Title *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Senior Frontend Developer"
            className={`w-full ${
    errors.title ? "border-red-500" : "border-[var(--border-color)]"
  } px-4 py-3 border placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            
          />
          {errors.title && (
  <p className="text-red-500 text-sm">{errors.title}</p>
)}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <FaBuilding className="text-purple-500" />
            Department *
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-4 py-3 ${
    errors.department ? "border-red-500" : "border-[var(--border-color)]"
  } border placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}

          >
            <option value="">Select Department</option>
            {/* <option value="Engineering">Engineering</option> */}
            <option value="It">It</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            {/* <option value="Operations">Operations</option> */}
            <option value="Design">Design</option>
          </select>
            {errors.department && (
  <p className="text-red-500 text-sm">{errors.department}</p>
)}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <FaMapMarkerAlt className="text-amber-500" />
            Location *
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-4 ${
    errors.location ? "border-red-500" : "border-[var(--border-color)]"
  } py-3 border placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}

          >
            <option value="">Select Location</option>
            <option value="Remote">Remote</option>
            <option value="Jaipur">Jaipur (on-site)</option>
            {/* <option value="London, UK">London, UK</option> */}
            {/* <option value="Bangalore, India">Bangalore, India</option> */}
            {/* <option value="Sydney, Australia">Sydney, Australia</option> */}
            {/* <option value="Berlin, Germany">Berlin, Germany</option> */}
          </select>
                      {errors.location && (
  <p className="text-red-500  text-sm">{errors.location}</p>
)}
        </div>

        <div className="space-y-2">
          <label className={`block text-sm ${
    errors.noOfOpenings ? "border-red-500" : "border-gray-300"
  } font-medium text-[var(--text-secondary)] flex items-center gap-2`}>
            <FaUsers className="text-emerald-500" />
            Number of Openings *
          </label>
          <input
            name="noOfOpenings"
            type="number"
            min="1"
            value={formData.noOfOpenings}
            onChange={handleChange}
            placeholder="e.g., 5"
            className={`w-full px-4 py-3  ${
    errors.noOfOpenings ? "border-red-500" : "border-[var(--border-color)]"
  }  border border-[var(--border-color)] rounded-xl placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}

          />
           {errors.noOfOpenings && (
  <p className="text-red-500 text-sm">{errors.noOfOpenings}</p>
)}
        </div>

        {/* {mode === 'edit' && (
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        )} */}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
          <FaFileAlt className="text-cyan-500" />
          Job Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe the role, responsibilities, and requirements..."
          className={`w-full  ${
    errors.description ? "border-red-500" : "border-[var(--border-color)]"
  }  px-4 py-3 border border-[var(--border-color)] placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
        />
                   {errors.description && (
  <p className="text-red-500 text-sm">{errors.description}</p>
)}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 cursor-pointer border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white  border-t-transparent rounded-full animate-spin"></div>
              {mode === 'edit' ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {mode === 'edit' ? 'Update Job' : 'Create Job'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}