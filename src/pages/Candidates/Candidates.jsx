import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdAdd, MdDelete, MdEdit, MdSearch, MdFilterList, MdClose } from "react-icons/md";
import { FaEye, FaUser, FaGraduationCap, FaBriefcase, FaPhone } from "react-icons/fa";
import ReusableTable from "../../components/reuseable/ReuseableTable.jsx";
import Modal from "../../components/reuseable/Modal.jsx";
import apiPath from "../../api/apiPath.js";
import { apiGet, apiPost, apiPut, apiDelete } from "../../api/apiFetch.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce.js";
import dayjs from "dayjs";

export default function Candidates() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("delete");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    appliedFor: "",
    min: "",
    max: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryClient = useQueryClient();

  // Fetch candidates with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["candidates", debouncedSearch, pagination.pageIndex, pagination.pageSize, filters],
    queryFn: () => apiGet(apiPath.CANDIDATES, {
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      appliedFor: filters.appliedFor || undefined,
      min: filters.min || undefined,
      max: filters.max || undefined
    }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.CANDIDATES}/${id}`),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["candidates"]);
      toast.success(data?.message || "Candidate deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete candidate");
    },
  });

  const candidates = data?.data || [];
  const totalCount = data?.totalPages || 0;
  console.log("data",data);

  // Helper function to calculate total experience from experience array
  const calculateTotalExperience = (experienceArray) => {
    if (!experienceArray || !Array.isArray(experienceArray)) return 0;
    
    let totalYears = 0;
    experienceArray.forEach(exp => {
      if (exp.from && exp.to) {
        const fromYear = new Date(exp.from).getFullYear();
        const toYear = new Date(exp.to).getFullYear();
        totalYears += (toYear - fromYear);
      }
    });
    return totalYears;
  };

  const handleView = (candidate) => {
    navigate(`/candidates/view/${candidate._id}`);
  };

  const handleEdit = (candidate) => {
    navigate(`/candidates/edit/${candidate._id}`);
  };

  const handleAdd = () => {
    navigate("/hr/candidates/add");
  };

  const handleDelete = (candidate) => {
    setSelectedCandidate(candidate);
    setModalType("delete");
    setOpenModal(true);
  };

  const confirmDelete = () => {
    if (selectedCandidate) {
      deleteMutation.mutate(selectedCandidate._id);
      setOpenModal(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      appliedFor: "",
      min: "",
      max: ""
    });
    setSearchTerm("");
    setShowFilters(false);
  };

  // Apply filters
  const handleApplyFilters = () => {
    setShowFilters(false);
    refetch();
  };

  // Check if any filter is active
  const hasActiveFilters = filters.appliedFor || filters.min || filters.max;

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        header: "CANDIDATE",
        accessorKey: "name",
        cell: ({ row }) => {
          const candidate = row.original;
          const initials = candidate.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'NA';
          
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{initials}</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{candidate.name}</div>
                <div className="text-xs text-gray-500">{candidate.email}</div>
              </div>
            </div>
          );
        },
      },
      {
        header: "APPLIED FOR",
        accessorKey: "title",
        cell: ({ row }) => {
            console.log("row",row.original);
        return(
            
          <div className="flex items-center space-x-2">
            <FaBriefcase className="text-gray-400" />
            <span className="font-medium text-gray-700">
              {typeof row.original.jobId.title === 'string' 
                ? row.original.jobId.title 
                : JSON.stringify(row.original.jobId.title)}
            </span>
          </div>)
        }
      },
      {
        header: "EXPERIENCE",
        accessorKey: "totalExperienceInYears",
      },
      {
        header: "PHONE",
        accessorKey: "phone",
        cell: ({ row }) => {
          const phoneValue = row.original.phone;
          return (
            <div className="flex items-center space-x-2">
              <FaPhone className="text-gray-400" />
              <span className="text-gray-600">
                {typeof phoneValue === 'string' || typeof phoneValue === 'number'
                  ? phoneValue 
                  : "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        header: "APPLIED DATE",
        accessorKey: "createdAt",
        cell: ({ row }) => {
          const date = row.original.createdAt || row.original.appliedDate;
          return (
            <div className="text-gray-600">
              {date ? dayjs(date).format("DD MMM YYYY") : "N/A"}
            </div>
          );
        },
      },
      {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status || "applied";
          const statusConfig = {
            applied: { color: "bg-blue-100 text-blue-800", label: "Applied" },
            shortlisted: { color: "bg-emerald-100 text-emerald-800", label: "Shortlisted" },
            rejected: { color: "bg-rose-100 text-rose-800", label: "Rejected" },
            hired: { color: "bg-purple-100 text-purple-800", label: "Hired" },
            interview: { color: "bg-amber-100 text-amber-800", label: "Interview" },
          };
          const config = statusConfig[status.toLowerCase()] || statusConfig.applied;

          return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        header: "ACTIONS",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleView(row.original)}
              className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-300 hover:scale-110"
              title="View Details"
            >
              <FaEye size={16} />
            </button>
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-all duration-300 hover:scale-110"
              title="Edit"
            >
              <MdEdit size={18} />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all duration-300 hover:scale-110"
              title="Delete"
            >
              <MdDelete size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdDelete size={32} className="text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load</h3>
          <p className="text-gray-600 mb-4">Unable to fetch candidates at the moment.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${collapsed ? "w-[92vw]" : "w-[78vw]"}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Applicants</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === "applied").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === "shortlisted").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaGraduationCap className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Interview</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === "interview").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hired</p>
              <p className="text-2xl font-bold text-gray-900">
                {candidates.filter(c => c.status === "hired").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates by name, email or position..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            {/* Active Filters Badge */}
            {hasActiveFilters && (
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">
                  Filters Active
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-blue-500 hover:text-blue-700"
                  title="Clear all filters"
                >
                  <MdClose size={16} />
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                hasActiveFilters 
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <MdFilterList size={18} />
              <span>Filters</span>
            </button>
            
            <button
              onClick={handleAdd}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <MdAdd size={20} />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Inline Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filter Candidates</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applied Position
                </label>
                <input
                  type="text"
                  placeholder="e.g., NodeJs Developer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={filters.appliedFor}
                  onChange={(e) => setFilters(prev => ({ ...prev, appliedFor: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Experience Range (years)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={filters.min}
                    onChange={(e) => setFilters(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={filters.max}
                    onChange={(e) => setFilters(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex items-end space-x-3">
                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-sm hover:shadow"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">Active filters:</span>
                {filters.appliedFor && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    Position: {filters.appliedFor}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, appliedFor: "" }))}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <MdClose size={14} />
                    </button>
                  </span>
                )}
                {(filters.min || filters.max) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                    Experience: {filters.min || "0"} - {filters.max || "∞"} years
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, min: "", max: "" }))}
                      className="ml-2 text-emerald-600 hover:text-emerald-800"
                    >
                      <MdClose size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-auto shadow-sm">
        <ReusableTable
          columns={columns}
          data={candidates}
          paginationState={pagination}
          setPagination={setPagination}
          setPaginationState={setPagination}
          totalCount={totalCount}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Confirm Delete"
        type="error"
        size="md"
        showFooter={true}
        primaryAction={{
          label: deleteMutation.isPending ? "Deleting..." : "Delete",
          onClick: confirmDelete,
          loading: deleteMutation.isPending,
          variant: "danger"
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setOpenModal(false)
        }}
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdDelete size={32} className="text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete {selectedCandidate?.name}?
          </h3>
          <p className="text-gray-600">
            This action cannot be undone. All data for this candidate will be permanently removed.
          </p>
        </div>
      </Modal>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}