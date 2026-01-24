// InterviewList.jsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MdDelete, 
  MdEdit, 
  MdSearch, 
  MdFilterList, 
  MdCalendarToday,
  MdVideoCall,
  MdLocationOn,
  MdPerson
} from "react-icons/md";
import { FaEye, FaBriefcase, FaBuilding, FaUsers, FaPhoneAlt, FaLaptop } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import ReusableTable from "../../components/reuseable/ReuseableTable.jsx";
import Modal from "../../components/reuseable/Modal.jsx";
import apiPath from "../../api/apiPath.js";
import { apiGet, apiDelete } from "../../api/apiFetch.js";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce.js";
import ToggleButton from "../../components/reuseable/ToggleButton.jsx";

export default function InterviewList() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // 'view', 'delete'
  const [selectedInterview, setSelectedInterview] = useState(null);
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRound, setFilterRound] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMode, setFilterMode] = useState("");
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const queryClient = useQueryClient();

  // Fetch interviews with filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["interviewList", debouncedSearch, pagination.pageIndex, 
                pagination.pageSize, filterRound, filterStatus, filterDate, filterMode],
    queryFn: () => apiGet(apiPath.interviewList, {
      search: debouncedSearch,
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      round: filterRound,
      status: filterStatus,
      interviewDate: filterDate,
      mode: filterMode
    }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.interviewList}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["interviewList"]);
      toast.success("Interview deleted successfully");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete interview");
    },
  });

  const interviews = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handleView = (interview) => {
    setSelectedInterview(interview);
    setModalType("view");
    setOpenModal(true);
  };

  const handleDelete = (interview) => {
    setSelectedInterview(interview);
    setModalType("delete");
    setOpenModal(true);
  };

  const confirmDelete = () => {
    if (selectedInterview) {
      deleteMutation.mutate(selectedInterview._id);
      setOpenModal(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        header: "CANDIDATE & POSITION",
        cell: ({ row }) => {
          const interview = row.original;
          return (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <MdPerson className="text-white text-sm" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {interview.candidateName || "Candidate Name"}
                </div>
                <div className="text-xs text-gray-500">
                  {interview.jobId?.title || "Position Title"}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        header: "INTERVIEWER",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <FaUsers className="text-gray-400" />
            <span className="font-medium text-gray-700">{row.original.interviewerName}</span>
          </div>
        ),
      },
      {
        header: "DATE & TIME",
        cell: ({ row }) => {
          const interviewDate = row.original.interviewDate;
          return (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MdCalendarToday className="text-gray-400 text-sm" />
                <span className="font-medium text-gray-900">{formatDate(interviewDate)}</span>
              </div>
              <div className="text-xs text-gray-500">{formatTime(interviewDate)}</div>
            </div>
          );
        },
      },
      {
        header: "ROUND",
        accessorKey: "round",
        cell: ({ row }) => {
          const round = row.original.round;
          const roundColors = {
            'HR': 'bg-purple-100 text-purple-800',
            'Technical': 'bg-blue-100 text-blue-800',
            'Managerial': 'bg-green-100 text-green-800',
            'Final': 'bg-amber-100 text-amber-800',
            'Screening': 'bg-gray-100 text-gray-800'
          };
          
          return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${roundColors[round] || 'bg-gray-100 text-gray-800'}`}>
              {round}
            </span>
          );
        },
      },
      {
        header: "MODE",
        accessorKey: "mode",
        cell: ({ row }) => {
          const mode = row.original.mode;
          const isOnline = mode === 'Online';
          
          return (
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <MdVideoCall className="text-blue-500" />
              ) : (
                <MdLocationOn className="text-green-500" />
              )}
              <span className="font-medium text-gray-700">{mode}</span>
            </div>
          );
        },
      },
      {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          const statusConfig = {
            'Scheduled': { color: 'bg-blue-100 text-blue-800', icon: '⏰' },
            'Completed': { color: 'bg-green-100 text-green-800', icon: '✓' },
            'Cancelled': { color: 'bg-red-100 text-red-800', icon: '✗' },
            'Rescheduled': { color: 'bg-yellow-100 text-yellow-800', icon: '↻' },
            'No Show': { color: 'bg-gray-100 text-gray-800', icon: '❌' },
            'Selected': { color: 'bg-emerald-100 text-emerald-800', icon: '⭐' },
            'Rejected': { color: 'bg-rose-100 text-rose-800', icon: '✘' }
          };
          const config = statusConfig[status] || statusConfig.Scheduled;
          
          return (
            <div className="flex items-center space-x-2">
              <span className="text-sm">{config.icon}</span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
                {status}
              </span>
            </div>
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
              onClick={() => handleDelete(row.original)}
              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all duration-300 hover:scale-110"
              title="Delete"
              disabled={deleteMutation.isPending}
            >
              <MdDelete size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Get unique values for filters
  const uniqueRounds = useMemo(() => {
    const rounds = interviews.map(i => i.round).filter(Boolean);
    return [...new Set(rounds)];
  }, [interviews]);

  const uniqueModes = useMemo(() => {
    const modes = interviews.map(i => i.mode).filter(Boolean);
    return [...new Set(modes)];
  }, [interviews]);

  const uniqueStatuses = useMemo(() => {
    const statuses = interviews.map(i => i.status).filter(Boolean);
    return [...new Set(statuses)];
  }, [interviews]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interviews...</p>
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
          <p className="text-gray-600 mb-4">Unable to fetch interviews at the moment.</p>
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
    <div className={`space-y-6 ${collapsed ? "w-[92vw]" : "md:w-[78vw]"}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Interviews</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === 'Scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MdCalendarToday className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Online Interviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.mode === 'Online').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MdVideoCall className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {interviews.filter(i => i.status === 'Completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <HiOutlineDocumentText className="text-green-600 text-xl" />
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
              placeholder="Search by candidate name, interviewer, or position..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <MdFilterList className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterRound}
                onChange={(e) => setFilterRound(e.target.value)}
              >
                <option value="">All Rounds</option>
                {uniqueRounds.map(round => (
                  <option key={round} value={round}>{round}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[120px]"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value="">All Modes</option>
                {uniqueModes.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
            
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterRound("");
                setFilterStatus("");
                setFilterDate("");
                setFilterMode("");
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
        <ReusableTable
          columns={columns}
          data={interviews}
          paginationState={pagination}
          setPagination={setPagination}
          setPaginationState={setPagination}
          totalCount={data?.totalPages || 1}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={modalType === "view" ? "Interview Details" : "Confirm Delete"}
        type={modalType === "delete" ? "error" : "info"}
        size={modalType === "view" ? "lg" : "md"}
        showFooter={modalType === "delete"}
        primaryAction={modalType === "delete" ? {
          label: deleteMutation.isPending ? "Deleting..." : "Delete",
          onClick: confirmDelete,
          loading: deleteMutation.isPending,
          variant: "danger"
        } : null}
        secondaryAction={modalType === "delete" ? {
          label: "Cancel",
          onClick: () => setOpenModal(false)
        } : null}
      >
        {modalType === "delete" ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={32} className="text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Interview?
            </h3>
            <p className="text-gray-600">
              Are you sure you want to delete this interview? This action cannot be undone.
            </p>
          </div>
        ) : modalType === "view" && selectedInterview ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Candidate</p>
                <p className="font-medium">
                  {selectedInterview.candidateId?.name || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">
                  {selectedInterview.jobId?.title || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Interviewer</p>
                <p className="font-medium">{selectedInterview.interviewerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Round</p>
                <p className="font-medium">{selectedInterview.round}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {formatDate(selectedInterview.interviewDate)} at {formatTime(selectedInterview.interviewDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mode</p>
                <p className="font-medium">{selectedInterview.mode}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedInterview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  selectedInterview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  selectedInterview.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedInterview.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedInterview.location || "N/A"}</p>
              </div>
            </div>
            
            {selectedInterview.meetingLink && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Meeting Link</p>
                <a 
                  href={selectedInterview.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {selectedInterview.meetingLink}
                </a>
              </div>
            )}
            
            {selectedInterview.remarks && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Remarks</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedInterview.remarks}</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}