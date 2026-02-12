// JobOpenings.jsx
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdAdd, MdDelete, MdEdit, MdSearch, MdFilterList } from "react-icons/md";
import { FaEye, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { HiOutlineDocumentText } from "react-icons/hi";
import ReusableTable from "../../components/reuseable/ReuseableTable.jsx";
import Modal from "../../components/reuseable/Modal.jsx";
import apiPath from "../../api/apiPath.js";
import { apiGet, apiPost, apiPut, apiDelete } from "../../api/apiFetch.js";
import AddJobForm from "./AddJobForm.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce.js";
import { se } from "date-fns/locale";
import ToggleButton from "../../components/reuseable/ToggleButton.jsx";

export default function JobOpenings() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add', 'edit', 'view', 'delete'
  const [selectedJob, setSelectedJob] = useState(null);
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  console.log(
    "selectedJob", selectedJob
  )
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const queryClient = useQueryClient();

  // Fetch job openings
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobOpenings", debouncedSearch, pagination.pageIndex,
      pagination.pageSize,filterStatus],
    queryFn: () => apiGet(apiPath.JobOpenings, {
      title: debouncedSearch,
      limit: pagination.pageSize,
      page: pagination.pageIndex + 1,
      isActive:filterStatus
    }),
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
console.log("data",data);
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.JobOpenings}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobOpenings"]);
    },
  });

  const jobOpenings = data?.data || [];
  console.log("jobopenings", jobOpenings);

  // Filter and search
  // const filteredJobs = useMemo(() => {
  //   return jobOpenings.filter(job => {
  //     const matchesSearch = 
  //       job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       job.location?.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesFilter = filterStatus === "all" || job.status === filterStatus;

  //     return matchesSearch && matchesFilter;
  //   });
  // }, [jobOpenings, searchTerm, filterStatus]);

  const handleView = (job) => {
    setSelectedJob(job);
    setModalType("view");
    setOpenModal(true);
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setModalType("edit");
    setOpenModal(true);
  };

  const handleDelete = (job) => {
    setSelectedJob(job);
    setModalType("delete");
    setOpenModal(true);
  };

  const confirmDelete = () => {
    if (selectedJob) {
      deleteMutation.mutate(selectedJob._id);
      setOpenModal(false);
    }
  };

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        header: "POSITION",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-white text-sm" />
            </div>
            <div>
              <div className="font-semibold text-[var(--text-primary)]">{row.original.title}</div>
              <div className="text-xs text-[var(--text-secondary)]
">ID: {row.original.id || "N/A"}</div>
            </div>
          </div>
        ),
      },
      {
        header: "DEPARTMENT",
        accessorKey: "department",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <FaBuilding className="text-gray-400" />
            <span className="font-medium text-[var(--text-secondary)]">{row.original.department}</span>
          </div>
        ),
      },
      {
        header: "LOCATION",
        accessorKey: "location",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <span className="text-[var(--text-primary)]">{row.original.location}</span>
          </div>
        ),
      },
      {
        header: "OPENINGS",
        accessorKey: "noOfOpenings",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <FaUsers className="text-blue-500" />
            <span className="font-semibold text-[var(--text-primary)]">{row.original.noOfOpenings}</span>
          </div>
        ),
      },
      // {
      //   header: "STATUS",
      //   accessorKey: "status",
      //   cell: ({ row }) => {
      //     const status = row.original.status || "open";
      //     const statusConfig = {
      //       open: { color: "bg-emerald-100 text-emerald-800", label: "Open" },
      //       closed: { color: "bg-rose-100 text-rose-800", label: "Closed" },
      //       draft: { color: "bg-amber-100 text-amber-800", label: "Draft" },
      //       upcoming: { color: "bg-blue-100 text-blue-800", label: "Upcoming" },
      //     };
      //     const config = statusConfig[status.toLowerCase()] || statusConfig.open;

      //     return (
      //       <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
      //         {config.label}
      //       </span>
      //     );
      //   },
      // },
        {
        header: "Status",
        accessorKey: "isActive", // backend field
        cell: ({ row }) => {
          const item = row.original;
console.log("itme",item.isActive);
          // mutation for toggling active/inactive
          const toggleMutation = useMutation({
            mutationFn: (newStatus) =>
              apiPut(`${apiPath.jobopeningToggleStatus}/${item._id}/status`, { isActive: newStatus }),
            onSuccess: (data) => {
              queryClient.invalidateQueries({ queryKey: ["jobOpenings"] });
              toast.success(data.message || "Status updated successfully ✅");
            },
            onError: (err) => {
              toast.error(err?.response?.data?.message || "Failed to update status ❌");
            },
          });

          const handleToggle = () => {
            const newStatus = item.isActive === true ? false : true;
            toggleMutation.mutate(newStatus);
          }

          return (
            <ToggleButton
              isActive={item.isActive}
              onToggle={handleToggle}
              disabled={toggleMutation.isLoading}
            />
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
          <div className="w-10 h-10 border-3 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-primary)]">Loading job openings...</p>
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
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Failed to load</h3>
          <p className="text-[var(--text-primary)] mb-4">Unable to fetch job openings at the moment.</p>
          <button
            onClick={() => queryClient.refetchQueries(["jobOpenings"])}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${collapsed ? "w-[92vw]" : "md:w-[78vw]"} `}>
      {/* Header */}
      {/* <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Job Openings</h1>
            <p className="text-blue-100">Manage and track all job positions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-[var(--bg-surface)]
/10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-3xl font-bold">{jobOpenings.length}</div>
              <div className="text-sm text-blue-200">Total Positions</div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="hidden grid grid-cols-1  md:grid md:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-primary)]
">Open Positions</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {jobOpenings.filter(j => j.status === "open").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FaBriefcase className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-primary)]
">Total Openings</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {jobOpenings.reduce((sum, job) => sum + (parseInt(job.noOfOpenings) || 0), 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-primary)]
">Active Departments</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {new Set(jobOpenings.map(j => j.department)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaBuilding className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-primary)]
">Locations</p>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {new Set(jobOpenings.map(j => j.location)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaMapMarkerAlt className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-[var(--border-color)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, department or location..."
              className="w-full pl-10 placeholder:text-[var(--text-secondary)] text-[var(--text-primary)] pr-4 py-2.5 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MdFilterList className="text-[var(--text-secondary)]
" />
              <select
                className="border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
                {/* <option value="draft">Draft</option> */}
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedJob(null);
                setModalType("add");
                setOpenModal(true);
              }}
              className="flex bg-[var(--bg-surface)] items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              <MdAdd size={20} />
              <span>Add New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-surface)]
 rounded-xl border border-[var(--border-color)] overflow-auto">
        <ReusableTable
          columns={columns}
          data={jobOpenings}
          paginationState={pagination}
          setPagination={setPagination}
          setPaginationState={setPagination}
          totalCount={data?.totalPages}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={modalType === "add" ? "Add New Job" :
          modalType === "edit" ? "Edit Job" :
            modalType === "view" ? "Job Details" :
              "Confirm Delete"}
        type={modalType === "delete" ? "error" :
          modalType === "view" ? "info" : "default"}
        size={modalType === "view" ? "lg" : "xl"}
        showFooter={modalType === "delete"}
        primaryAction={modalType === "delete" ? {
          label: deleteMutation.isPending ? "Deleting..." : "Delete",
          onClick: confirmDelete,
          loading: deleteMutation.isPending
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
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Delete {selectedJob?.title}?
            </h3>
            <p className="text-[var(--text-primary)]">
              This action cannot be undone. All applications for this position will also be removed.
            </p>
          </div>
        ) : modalType === "view" && selectedJob ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[var(--text-primary)]
">Position</p>
                <p className="font-medium">{selectedJob.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[var(--text-primary)]
">Department</p>
                <p className="font-medium">{selectedJob.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[var(--text-primary)]
">Location</p>
                <p className="font-medium">{selectedJob.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[var(--text-primary)]
">Openings</p>
                <p className="font-medium">{selectedJob.noOfOpenings}</p>
              </div>
            </div>
            <div>
              <p className="text-[var(--text-primary)]
 mb-2">Description</p>
              <div className="bg-[var(--bg-surface)] p-4 rounded-lg">
                <p className="text-[var(--text-primary)]">{selectedJob.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <AddJobForm
            onClose={() => setOpenModal(false)}
            jobData={selectedJob}
            mode={modalType}
            onSuccess={() => {
              queryClient.invalidateQueries(["jobOpenings"]);
              setOpenModal(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
}