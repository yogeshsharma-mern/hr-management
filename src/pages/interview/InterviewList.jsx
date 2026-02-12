import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MdDelete,
  MdSearch,
  MdFilterList,
  MdCalendarToday,
  MdVideoCall,
  MdLocationOn,
  MdPerson,
  MdBlock,
  MdCheckCircle,
  MdWarning
} from "react-icons/md";
import { FaEye, FaBriefcase, FaUsers } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import ReusableTable from "../../components/reuseable/ReuseableTable.jsx";
import Modal from "../../components/reuseable/Modal.jsx";
import apiPath from "../../api/apiPath.js";
import { apiGet, apiDelete, apiPut } from "../../api/apiFetch.js";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce.js";
import { IoIosTimer } from "react-icons/io";
import { Link } from "react-router-dom";

export default function InterviewList() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("view"); // 'view', 'delete', 'status'
  const [selectedInterview, setSelectedInterview] = useState(null);
console.log("selectedinterview",selectedInterview);
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);


  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRound, setFilterRound] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterMode, setFilterMode] = useState("");

  // Status update states
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: "Scheduled",
    result: "Pending",
    feedback: ""
  });

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
  console.log("interviewData", data);
  // Delete mutation
  const deleteMutation =
    useMutation({
      mutationFn: (id) => apiDelete(`${apiPath.interviewList}/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries(["interviewList"]);
        toast.success("Interview deleted successfully");
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || "Failed to delete interview");
      },
    });

  // Status update mutation
  // const updateStatusMutation = useMutation({
  //   mutationFn: ({ id, payload }) =>
  //     apiPut(`${apiPath.updateInterviewStatus}/${id}`, payload),
  //   onSuccess: () => {
  //     toast.success("Interview status updated successfully");
  //     queryClient.invalidateQueries(["interviewList"]);
  //     setOpenModal(false);
  //   },
  //   onError: (err) => {
  //     toast.error(err?.response?.data?.message || "Failed to update status");
  //   },
  // });


  const updateStatusMutation = useMutation({
    mutationFn: ({ id, payload }) => apiPut(`${apiPath.updateInterviewStatus}/${id}`, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Interview Status updated suceessfully");
      queryClient.invalidateQueries(["interviewList"]);
      setOpenModal(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  });

  const interviews = data?.data?.data || [];
  const totalCount = data?.data?.pagination?.totalPages || 0;
  console.log("totalcount", totalCount);

  // Check if a round is completed and passed
  const isRoundCompletedPassed = (interview) => {
    return interview.status === "Completed" && interview.result === "Passed";
  };

  // Check if interview can be updated based on round
  const canUpdateInterview = (interview) => {
    const { round, status, result } = interview;

    // If cancelled, can always update
    if (status === "Cancelled") return false;

    // If not completed, can update
    if (status !== "Completed") return true;

    // If completed but failed, can update
    if (result === "Failed") return false;

    // If completed and passed, check round-specific rules
    if (result === "Passed") {
      switch (round) {
        case "HR":
          // HR round completed & passed → Cannot update (Technical auto-created)
          return false;
        case "Technical":
          // Technical round completed & passed → Cannot update (Managerial auto-created)
          return false;
        case "Managerial":
          // Managerial round completed & passed → Can update (no further rounds)
          return true;
        default:
          return true;
      }
    }

    return true;
  };

  // Check if interview can be deleted
  const canDeleteInterview = (interview) => {
    const { round, status, result } = interview;

    // If completed and passed, check round-specific rules
    if (status === "Completed" && result === "Passed") {
      switch (round) {
        case "HR":
        case "Technical":
          // Cannot delete because next round was auto-created
          return false;
        case "Managerial":
          // Can delete Managerial round (no further rounds)
          return true;
        default:
          return true;
      }
    }

    return true;
  };

  // Check if a next round exists for this candidate
  const hasNextRound = (interview) => {
    if (!interview.candidateName || !interview.jobId?._id) return false;

    const candidateInterviews = interviews.filter(i =>
      i.candidateName === interview.candidateName &&
      i.jobId?._id === interview.jobId?._id
    );

    const roundOrder = ["HR", "Technical", "Managerial"];
    const currentRoundIndex = roundOrder.indexOf(interview.round);

    if (currentRoundIndex === -1 || currentRoundIndex === roundOrder.length - 1) {
      return false; // No next round
    }

    const nextRound = roundOrder[currentRoundIndex + 1];
    return candidateInterviews.some(i => i.round === nextRound);
  };

  const handleView = (interview) => {
    setSelectedInterview(interview);
    setModalType("view");
    setOpenModal(true);
  };

  const handleDelete = (interview) => {
    if (!canDeleteInterview(interview)) {
      const message = `${interview.round} round cannot be deleted once completed and passed`;
      toast.error(message);
      return;
    }

    setSelectedInterview(interview);
    setModalType("delete");
    setOpenModal(true);
  };

  const handleStatusUpdate = (interview) => {
    if (!canUpdateInterview(interview)) {
      let message = "";
      switch (interview.round) {
        case "HR":
          message = "HR round cannot be updated once completed and passed (Technical round auto-created)";
          break;
        case "Technical":
          message = "Technical round cannot be updated once completed and passed (Managerial round auto-created)";
          break;
        default:
          message = "This round cannot be updated once completed and passed";
      }
      toast.error(message);
      return;
    }

    setSelectedInterview(interview);
    setStatusUpdateData({
      status: interview.status || "Scheduled",
      result: interview.result || "Pending",
      feedback: interview.feedback || ""
    });
    setModalType("status");
    setOpenModal(true);
  };

  const confirmDelete = () => {
    if (selectedInterview) {
      if (!canDeleteInterview(selectedInterview)) {
        toast.error(`Cannot delete ${selectedInterview.round} round once completed and passed`);
        setOpenModal(false);
        return;
      }

      deleteMutation.mutate(selectedInterview._id);
      setOpenModal(false);
    }
  };

  const confirmStatusUpdate = () => {
    if (selectedInterview) {
      // Check if trying to change a completed & passed round
      const isCurrentlyCompletedPassed = isRoundCompletedPassed(selectedInterview);
      const isChangingToCompletedPassed =
        statusUpdateData.status === "Completed" &&
        statusUpdateData.result === "Passed";

      // If currently completed & passed and trying to change status
      if (isCurrentlyCompletedPassed && selectedInterview.round !== "Managerial") {
        if (statusUpdateData.status !== "Completed" || statusUpdateData.result !== "Passed") {
          let message = "";
          switch (selectedInterview.round) {
            case "HR":
              message = "HR round cannot be changed once completed and passed";
              break;
            case "Technical":
              message = "Technical round cannot be changed once completed and passed";
              break;
          }
          toast.error(message);
          return;
        }
      }

      const payload = {
        status: statusUpdateData.status,
        result: statusUpdateData.result,
        feedback: statusUpdateData.feedback
      };

      // Auto-generate feedback if not provided
      if (!payload.feedback.trim()) {
        if (payload.status === "Completed" && payload.result === "Passed") {
          payload.feedback = "Good communication and confidence";
        } else if (payload.status === "Completed" && payload.result === "Failed") {
          payload.feedback = "Did not clear this round";
        } else if (payload.status === "Cancelled") {
          payload.feedback = "Interview cancelled";
        }
      }

      updateStatusMutation.mutate({
        id: selectedInterview._id,
        payload
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  };


  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata", // ✅ CRITICAL
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
                <div className="font-semibold text-[var(--text-primary)]">
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
            <span className="font-medium text-[var(--text-primary)]">{row.original.interviewerName || "N/A"}</span>
          </div>
        ),
      },
      {
        header: "DATE & TIME",
        cell: ({ row }) => {
          const interviewDate = row.original.createdAt; // ✅ FIXED

          return (
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MdCalendarToday className="text-gray-400 text-sm" />
                <span className="font-medium text-[var(--text-primary)]">
                  {formatDate(interviewDate)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(interviewDate)}
              </div>
            </div>
          );
        },
      }
      ,
      {
        header: "ROUND",
        accessorKey: "round",
        cell: ({ row }) => {
          const interview = row.original;
          const round = interview.round;
          const roundColors = {
            'HR': 'bg-purple-100 text-purple-800',
            'Technical': 'bg-blue-100 text-blue-800',
            'Managerial': 'bg-green-100 text-green-800',
            'Final': 'bg-amber-100 text-amber-800',
            'Screening': 'bg-gray-100 text-gray-800'
          };

          // Check if round is completed and passed
          const isCompletedPassed = isRoundCompletedPassed(interview);
          const hasNext = hasNextRound(interview);

          return (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${roundColors[round] || 'bg-gray-100 text-gray-800'}`}>
                {round}
              </span>
              {isCompletedPassed && hasNext && round !== "Managerial" && (
                <MdCheckCircle className="text-green-500" title={`${round} completed - Next round created`} />
              )}
              {isCompletedPassed && round === "Managerial" && (
                <MdCheckCircle className="text-green-500" title="Final round completed" />
              )}
            </div>
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
              <span className="font-medium text-[var(--text-primary)]">{mode || "N/A"}</span>
            </div>
          );
        },
      },
      {
        header: "STATUS",
        accessorKey: "status",
        cell: ({ row }) => {
          const interview = row.original;
          return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${interview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
              interview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                interview.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
              }`}>
              {interview.status}
            </span>
          );
        },
      },
      {
        header: "RESULT",
        accessorKey: "result",
        cell: ({ row }) => {
          const interview = row.original;
          return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${interview.result === 'Passed' ? 'bg-green-100 text-green-800' :
              interview.result === 'Failed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
              {interview.result || "Pending"}
            </span>
          );
        },
      },
      {
        header: "ACTIONS",
        cell: ({ row }) => {
          const interview = row.original;
          const canUpdate = canUpdateInterview(interview);
          const canDelete = canDeleteInterview(interview);

          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleView(interview)}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                title="View"
              >
                <FaEye size={16} />
              </button>
              <Link to={`/hr/interview/schedule/${interview._id}`}
                state={{ data: interview }}>
                <button>
                  <IoIosTimer size={18} className="text-green-700 cursor-pointer" />
                </button>
              </Link>
              <button
                onClick={() => handleStatusUpdate(interview)}
                className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1 ${canUpdate
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                title={
                  canUpdate
                    ? "Update Status"
                    : `${interview.round} round cannot be updated once completed and passed`
                }
                disabled={!canUpdate}
              >
                {canUpdate ? (
                  <>
                    Update
                  </>
                ) : (
                  <>
                    <MdBlock size={14} />
                    Locked
                  </>
                )}
              </button>

              <button
                onClick={() => handleDelete(interview)}
                className={`p-2 rounded-lg ${canDelete
                  ? "bg-rose-50 hover:bg-rose-100 text-rose-600"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                title={
                  canDelete
                    ? "Delete"
                    : `${interview.round} round cannot be deleted once completed and passed`
                }
                disabled={!canDelete}
              >
                <MdDelete size={18} />
              </button>

            </div>
          );
        },
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


  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdDelete size={32} className="text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Failed to load</h3>
          <p className="text-[var(--text-primary)] mb-4">Unable to fetch interviews at the moment.</p>
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
        <div className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Interviews</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Scheduled</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {interviews.filter(i => i.status === 'Scheduled').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <MdCalendarToday className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Online Interviews</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {interviews.filter(i => i.mode === 'Online').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MdVideoCall className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
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
      <div className="bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by candidate name, interviewer, or position..."
              className="w-full text-[var(--text-primary)] pl-10 pr-4 py-2.5 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <MdFilterList className="text-gray-500" />
              <select
                className="border text-[var(--text-primary)] border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[120px]"
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
                className="border text-[var(--text-primary)] border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[120px]"
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
                className="border text-[var(--text-primary)] border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 min-w-[120px]"
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
                className="border text-[var(--text-primary)] border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="text-gray-500 hover:text-[var(--text-primary)]"
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
              className="px-4 py-2.5 border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-surface)] relative rounded-xl border border-[var(--border-color)] overflow-auto">
         {isLoading && (
    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )}
        <ReusableTable
          columns={columns}
          data={interviews}
          paginationState={pagination}
          setPagination={setPagination}
          setPaginationState={setPagination}
          totalCount={totalCount || 1}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={
          modalType === "view" ? "Interview Details" :
            modalType === "delete" ? "Confirm Delete" :
              "Update Interview Status"
        }
        type={
          modalType === "delete" ? "error" :
            modalType === "status" ? "info" :
              "info"
        }
        size={modalType === "view" ? "lg" : "md"}
        showFooter={modalType === "delete" || modalType === "status"}
        primaryAction={
          modalType === "delete" ? {
            label: deleteMutation.isPending ? "Deleting..." : "Delete",
            onClick: confirmDelete,
            loading: deleteMutation.isPending,
            variant: "danger"
          } :
            modalType === "status" ? {
              label: updateStatusMutation.isPending ? "Updating..." : "Update Status",
              onClick: confirmStatusUpdate,
              loading: updateStatusMutation.isPending,
              variant: "primary"
            } : null
        }
        secondaryAction={
          modalType === "delete" || modalType === "status" ? {
            label: "Cancel",
            onClick: () => setOpenModal(false)
          } : null
        }
      >
        {modalType === "delete" ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={32} className="text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Delete Interview?
            </h3>
            {selectedInterview &&
              selectedInterview.status === "Completed" &&
              selectedInterview.result === "Passed" &&
              selectedInterview.round !== "Managerial" ? (
              <div className="text-left">
                <p className="text-[var(--text-primary)] mb-3">
                  <strong>Warning:</strong> This is a {selectedInterview.round} round that has been completed and passed.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Cannot delete:</strong> Once a {selectedInterview.round} round is completed and passed,
                    {selectedInterview.round === "HR" ? " a Technical round" : " a Managerial round"} is automatically created in the system.
                    Deleting this {selectedInterview.round} round may cause inconsistencies.
                  </p>
                </div>
                <p className="text-[var(--text-primary)]">
                  If you need to cancel this interview, please update the status to "Cancelled" instead.
                </p>
              </div>
            ) : (
              <p className="text-[var(--text-primary)]">
                Are you sure you want to delete this interview? This action cannot be undone.
              </p>
            )}
          </div>
        ) : modalType === "view" && selectedInterview ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Candidate</p>
                <p className="font-medium">
                  {selectedInterview.candidateName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">
                  {selectedInterview?.position || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Interviewer</p>
                <p className="font-medium">{selectedInterview.interviewerName || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Round</p>
                <p className="font-medium">{selectedInterview.round}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium">
                  {selectedInterview.interviewDate
                    ? `${formatDate(selectedInterview.interviewDate)} at ${formatTime(selectedInterview.interviewDate)}`
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Mode</p>
                <p className="font-medium">{selectedInterview.mode || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedInterview.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  selectedInterview.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    selectedInterview.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedInterview.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Result</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedInterview.result === 'Passed' ? 'bg-green-100 text-green-800' :
                  selectedInterview.result === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedInterview.result || "Pending"}
                </span>
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

            {selectedInterview.location && (
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{selectedInterview.location}</p>
              </div>
            )}

            {selectedInterview.feedback && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Feedback</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-[var(--text-primary)]">{selectedInterview.feedback}</p>
                </div>
              </div>
            )}

            {isRoundCompletedPassed(selectedInterview) && selectedInterview.round !== "Managerial" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MdCheckCircle className="text-green-500" />
                  <p className="font-medium text-green-800">
                    {selectedInterview.round} Round Completed Successfully
                  </p>
                </div>
                <p className="text-sm text-green-700">
                  {selectedInterview.round === "HR" ? "Technical" : "Managerial"} round has been automatically created for the candidate.
                  This {selectedInterview.round} round cannot be modified or deleted.
                </p>
              </div>
            )}

            {isRoundCompletedPassed(selectedInterview) && selectedInterview.round === "Managerial" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MdCheckCircle className="text-blue-500" />
                  <p className="font-medium text-blue-800">
                    Final Interview Round Completed
                  </p>
                </div>
                <p className="text-sm text-blue-700">
                  All interview rounds completed for this candidate.
                  This Managerial round can still be updated or deleted if needed.
                </p>
              </div>
            )}
          </div>
        ) : modalType === "status" && selectedInterview ? (
          <div className="space-y-4 py-4">
            {/* Warning for completed rounds */}
            {isRoundCompletedPassed(selectedInterview) && selectedInterview.round !== "Managerial" ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MdWarning className="text-yellow-500" />
                  <p className="font-medium text-yellow-800">Update Restricted</p>
                </div>
                <p className="text-sm text-yellow-700">
                  This {selectedInterview.round} round has been completed and passed.
                  {selectedInterview.round === "HR" ? " A Technical" : " A Managerial"} round has been
                  automatically created. You cannot modify the status or result of this
                  completed {selectedInterview.round} round.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Only "Cancelled" {selectedInterview.round} rounds can be updated.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">Interview Details</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">{selectedInterview.candidateName || "Candidate"}</p>
                    <p className="text-sm text-gray-500">
                      {selectedInterview.jobId?.title || "Position"} • {selectedInterview.round} Round
                    </p>
                    {selectedInterview.round === "HR" && (
                      <p className="text-xs text-blue-600 mt-1">
                        Note: Completing HR round with "Passed" will auto-create Technical round
                      </p>
                    )}
                    {selectedInterview.round === "Technical" && (
                      <p className="text-xs text-blue-600 mt-1">
                        Note: Completing Technical round with "Passed" will auto-create Managerial round
                      </p>
                    )}
                    {selectedInterview.round === "Managerial" && (
                      <p className="text-xs text-green-600 mt-1">
                        Note: Managerial is the final round - no further rounds will be auto-created
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Status
                    </label>
                    <select
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      value={statusUpdateData.status}
                      onChange={(e) => setStatusUpdateData({
                        ...statusUpdateData,
                        status: e.target.value,
                        // Reset result if status is not Completed
                        result: e.target.value === "Completed" ? statusUpdateData.result : "Pending"
                      })}
                      disabled={isRoundCompletedPassed(selectedInterview) && selectedInterview.round !== "Managerial"}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {statusUpdateData.status === "Completed" && (
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Result
                      </label>
                      <select
                        className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        value={statusUpdateData.result}
                        onChange={(e) => setStatusUpdateData({
                          ...statusUpdateData,
                          result: e.target.value
                        })}
                        disabled={isRoundCompletedPassed(selectedInterview) && selectedInterview.round !== "Managerial"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Passed">Passed</option>
                        <option value="Failed">Failed</option>
                      </select>
                      {selectedInterview.round === "HR" && statusUpdateData.result === "Passed" && (
                        <p className="text-xs text-blue-600 mt-1">
                          Technical round will be auto-created when saved
                        </p>
                      )}
                      {selectedInterview.round === "Technical" && statusUpdateData.result === "Passed" && (
                        <p className="text-xs text-blue-600 mt-1">
                          Managerial round will be auto-created when saved
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Feedback (Optional)
                    </label>
                    <textarea
                      className="w-full border border-[var(--border-color)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Enter feedback..."
                      value={statusUpdateData.feedback}
                      onChange={(e) => setStatusUpdateData({
                        ...statusUpdateData,
                        feedback: e.target.value
                      })}
                      disabled={isRoundCompletedPassed(selectedInterview) && selectedInterview.round !== "Managerial"}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to auto-generate feedback based on status and result.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}