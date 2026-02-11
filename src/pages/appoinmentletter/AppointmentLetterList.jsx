import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MdAdd, MdDelete, MdEdit, MdSearch, MdFilterList, MdClose } from "react-icons/md";
import { FaEye, FaUser, FaGraduationCap, FaBriefcase, FaPhone, FaBuilding } from "react-icons/fa";
import ReusableTable from "../../components/reuseable/ReuseableTable.jsx";
import Modal from "../../components/reuseable/Modal.jsx";
import apiPath from "../../api/apiPath.js";
import { apiGet, apiPost, apiPut, apiDelete } from "../../api/apiFetch.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useDebounce from "../../hooks/useDebounce.js";
import { apiGetPdf } from "../../api/apiFetch.js";
import { RiAiGenerate } from "react-icons/ri";
import { AiOutlineFileText } from "react-icons/ai";
// import { apiPut } from "../../api/apiFetch.js";

import dayjs from "dayjs";
import { m } from "framer-motion";

export default function AppointmentLetterList() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState("delete");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editStatus, setEditStatus] = useState("");
    const [pdfId, setPdfId] = useState(false);
    const token = useSelector((state) => state.auth.token);

    console.log("token", token);

    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        appliedFor: "",
        experienceRange: ""
    });
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 500);

    const queryClient = useQueryClient();

    // Fetch positions from job openings
    const { data: positionData } = useQuery({
        queryKey: ["positions"],
        queryFn: () => apiGet(apiPath.JobOpenings, { limit: 100 }),
    });

    const positions = positionData?.data?.map((job) => ({
        value: job._id,
        label: job.title,
    })) || [];

    // Helper function to parse experience range to min/max
    const parseExperienceRange = (range) => {
        switch (range) {
            case "0-1": return { min: 0, max: 1 };
            case "1-2": return { min: 1, max: 2 };
            case "2-3": return { min: 2, max: 3 };
            case "3-4": return { min: 3, max: 4 };
            case "4+": return { min: 4, max: undefined }; // For "4+" we only need min
            default: return { min: undefined, max: undefined };
        }
    };

    // Fetch candidates with filters
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["appointmentLettersData", debouncedSearch, pagination.pageIndex, pagination.pageSize, filters],
        queryFn: () => {
            const { min, max } = parseExperienceRange(filters.experienceRange);

            const params = {
                limit: pagination.pageSize,
                page: pagination.pageIndex + 1,
                title: debouncedSearch
            };

            if (filters.appliedFor) {
                // Find the position title from the selected ID
                const selectedPosition = positions.find(pos => pos.value === filters.appliedFor);
                if (selectedPosition) {
                    params.appliedFor = selectedPosition.label;
                }
            }

            if (min !== undefined) params.min = min;
            if (max !== undefined) params.max = max;

            return apiGet(apiPath.appointmentLetterList, params);
        },
        enabled: true, // Ensure this runs even when positions are loading
    });
    // const { data: pdfBlob, isLoading: isViewLoading, error: viewError } = useQuery({


    //   queryKey: ["offerLetterPdf", pdfId],

    //   queryFn: async () => {

    //     const res = await apiGet(`${apiPath.offerLetterPdf}/${pdfId}`, {

    //       responseType: "blob", // <-- important

    //     });

    //     return res.data; // this is already a Blob

    //   },

    //   enabled: !!pdfId,

    // });
    // const pdfBlob=async(pdfId)=>
    // {
    //     const res = await fetch(`${apiPath.offerLetterPdf}/${pdfId}`);
    // const pdfBlob = await res.blob();
    // console.log("pdfBlob", pdfBlob);
    //     const pdfUrl = URL.createObjectURL(pdfBlob);
    //     console.log("[pdfurl]",pdfUrl);

    // return pdfBlob;
    // }
    // useEffect(()=>
    // {
    // // pdfBlob(pdfId).then(blob => {

    // //   const pdfUrl = URL.createObjectURL(blob);

    // //   window.open(pdfUrl, "_blank");
    // pdfBlob(pdfId);
    // },[pdfId])


    //  console.log("pdfBlod",pdfBlob);
    // useEffect(() => {

    //   if (pdfBlob) {

    //     // const pdfUrl = URL.createObjectURL(pdfBlob);

    //     window.open(pdfUrl, "_blank");

    //     // cleanup after a delay so browser can load it

    //     setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

    //     setPdfId(null);

    //   }

    // }, [pdfBlob]);



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
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) =>
            apiPut(`${apiPath.updateAppointmentStatus}/${id}`, { status }),

        onSuccess: (res) => {
            toast.success(res?.message || "Status updated successfully");

            // 🔄 Refresh list
            queryClient.invalidateQueries(["appointmentLettersData"]);

            setEditModalOpen(false);
            setSelectedCandidate(null);
            setEditStatus("");
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to update status"
            );
        },
    });

    const generateAppointmentLetterMutation = useMutation({
        mutationFn: ({ id }) => apiPost(`${apiPath.generateAppointmentLetter}/${id}`),
        onSuccess: (res) => {
            toast.success(res?.message || "Appointment letter generated successfully");
            queryClient.invalidateQueries(["appointmentLettersData"]);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to generate appointment letter");
        }
    })
    const handleGenerateAppointmentLetter = (id) => {
        generateAppointmentLetterMutation.mutate({ id });
    }
    const handleUpdateStatus = () => {
        if (!editStatus) {
            toast.error("Please select a status");
            return;
        }

        updateStatusMutation.mutate({
            id: selectedCandidate._id,
            status: editStatus,
        });
    };


    const appointmentLetterData = data?.data || [];
    console.log("appointmentLetterData", appointmentLetterData);
    const totalCount = data?.totalPages || 0;

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



    //     const handleView = async (pdfId) => {
    //   try {
    //     const res = await apiGetPdf(
    //       `${apiPath.offerLetterPdf}/${pdfId}`
    //     );

    //     console.log("status:", res.status); // ✅ works

    //     const blob = res.data; // ✅ already a Blob

    //     console.log("Blob type:", blob.type);

    //     const pdfUrl = URL.createObjectURL(blob);
    //     window.open(pdfUrl,"_blank");

    //     setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
    //   } catch (err) {
    //     console.error(err);
    //     toast.error("Unauthorized or failed to fetch PDF");
    //   }
    // };
    const handleView = async (pdfId) => {
        try {
            const res = await apiGetPdf(`${apiPath.appointmentLetterPdf}/${pdfId}`);
            const blob = res.data;
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, "_blank");
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
        } catch (error) {
            console.error("Error fetching PDF:", error);
            toast.error("Unauthorized or failed to fetch PDF");
        }
    }




    const handleEdit = (candidate) => {
        setSelectedCandidate(candidate); // 🔴 important
        setEditStatus(candidate.status || "");
        setEditModalOpen(true);
    };


    const handleAdd = () => {
        navigate("/hr/offer-letter/add");
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
            experienceRange: ""
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
    const hasActiveFilters = filters.appliedFor || filters.experienceRange;

    // Experience range options
    const experienceRanges = [
        { label: "0-1 year", value: "0-1" },
        { label: "1-2 years", value: "1-2" },
        { label: "2-3 years", value: "2-3" },
        { label: "3-4 years", value: "3-4" },
        { label: "4+ years", value: "4+" }
    ];

    // Memoized columns
    const columns = useMemo(
        () => [
            {
                header: "CANDIDATE",
                accessorKey: "candidateName",
                cell: ({ row }) => {
                    const candidate = row.original;
                    console.log("candidate", candidate);
                    const initials = candidate.candidateName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'NA';

                    return (
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">{initials}</span>
                            </div>
                            <div>
                                <div className="font-semibold text-[var(--text-primary)]">{candidate.candidateName}</div>
                                {/* <div className="text-xs text-gray-500">{candidate.email}</div> */}
                            </div>
                        </div>
                    );
                },
            },
            {
                header: "APPLIED FOR",
                accessorKey: "title",
                cell: ({ row }) => (
                    <div className="flex items-center space-x-2">
                        <FaBriefcase className="text-[var(--text-primary)]" />
                        <span className="font-medium text-[var(--text-primary)]">
                            {typeof row?.original?.position === 'string'
                                ? row?.original?.position
                                : JSON.stringify(row?.original?.position)}
                        </span>
                    </div>
                )
            },
            {
                header: "Annual CTC",
                accessorKey: "totalAnnualCTC",
            },
            {
                header: "Joining Date",
                accessorKey: "joiningDate",

            },
            //   {
            //     header: "APPLIED DATE",
            //     accessorKey: "createdAt",
            //     cell: ({ row }) => {
            //       const date = row.original.createdAt || row.original.appliedDate;
            //       return (
            //         <div className="text-gray-600">
            //           {date ? dayjs(date).format("DD MMM YYYY") : "N/A"}
            //         </div>
            //       );
            //     },
            //   },
            {
                header: "Location",
                accessorKey: "location",
            },
            {
                header: "STATUS",
                accessorKey: "status",
                cell: ({ row }) => {
                    const status = (row.original.status || "").toLowerCase();

                    const statusConfig = {
                        generated: {
                            color: "bg-blue-100 text-blue-800",
                            label: "Generated",
                        },
                        accepted: {
                            color: "bg-green-100 text-green-800",
                            label: "Accepted",
                        },
                        rejected: {
                            color: "bg-red-100 text-red-800",
                            label: "Rejected",
                        },
                    };

                    const config = statusConfig[status] || {
                        color: "bg-gray-100 text-gray-800",
                        label: row.original.status || "Unknown",
                    };

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
                            onClick={() => handleView(row.original._id)}
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

                        {
                            (row.original.isAppointmentLetter === false && row.original.status === "accepted") &&
                            (
                                <button
                                    onClick={() => handleGenerateAppointmentLetter(row.original._id)}
                                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all duration-300 hover:scale-110"
                                    title="Generate Appoinment Letter"
                                >
                                    <RiAiGenerate size={18} />
                                </button>
                            )
                        }
                        {/* {
                            row.original.isAppointmentLetter === true &&
                            (
                                <button
                                    onClick={""}
                                    className="p-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg transition-all duration-300 hover:scale-110"
                                    title="View Appoinment Letter"
                                >
                                    <AiOutlineFileText size={18} />
                                </button>
                            )
                        } */}
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
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Failed to load</h3>
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

    // Get selected position label for display
    const getSelectedPositionLabel = () => {
        if (!filters.appliedFor) return "";
        const selected = positions.find(pos => pos.value === filters.appliedFor);
        return selected ? selected.label : "";
    };

    // Get selected experience label for display
    const getSelectedExperienceLabel = () => {
        if (!filters.experienceRange) return "";
        const selected = experienceRanges.find(range => range.value === filters.experienceRange);
        return selected ? selected.label : "";
    };

    return (
        <div className={`space-y-6 ${collapsed ? "w-[92vw]" : "md:w-[78vw]"}`}>
            {/* Stats Cards */}
            <div className="hidden  grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">New Applicants</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {/* {offerLetterData.filter(c => c.status === "applied").length} */}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaUser className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Shortlisted</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {/* {offerLetterData?.filter(c => c.status === "shortlisted").length} */}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <FaGraduationCap className="text-emerald-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">In Interview</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {/* {offerLetterData?.filter(c => c.status === "interview").length} */}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                            <FaBriefcase className="text-amber-600 text-xl" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Hired</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {/* {appointmentLetterData?.filter(c => c.status === "hired").length} */}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaUser className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[var(--bg-surface)]
 rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search appointment letter by name, email or position"
                            className="w-full pl-10 placeholder:text-[var(--text-secondary)] text-[var(--text-primary)]  pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg transition-all duration-300 ${hasActiveFilters
                                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <MdFilterList size={18} />
                            <span>Filters</span>
                        </button>

                        {/* <button
                            onClick={handleAdd}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                            <MdAdd size={20} />
                            <span>Add New</span>
                        </button> */}
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
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={filters.appliedFor}
                                    onChange={(e) => setFilters(prev => ({ ...prev, appliedFor: e.target.value }))}
                                >
                                    <option value="">All Positions</option>
                                    {positions.map((position) => (
                                        <option key={position.value} value={position.value}>
                                            {position.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Experience Range
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={filters.experienceRange}
                                    onChange={(e) => setFilters(prev => ({ ...prev, experienceRange: e.target.value }))}
                                >
                                    <option value="">All Experience Levels</option>
                                    {experienceRanges.map((range) => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
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
                                        Position: {getSelectedPositionLabel()}
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, appliedFor: "" }))}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <MdClose size={14} />
                                        </button>
                                    </span>
                                )}
                                {filters.experienceRange && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
                                        Experience: {getSelectedExperienceLabel()}
                                        <button
                                            onClick={() => setFilters(prev => ({ ...prev, experienceRange: "" }))}
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
            <div className="bg-[var(--bg-surface)]
 rounded-xl border border-gray-200 overflow-auto shadow-sm">
                <ReusableTable
                    columns={columns}
                    data={appointmentLetterData}
                    paginationState={pagination}
                    setPagination={setPagination}
                    setPaginationState={setPagination}
                    totalCount={totalCount}
                    searchTerm={searchTerm}
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
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        Delete {selectedCandidate?.name}?
                    </h3>
                    <p className="text-gray-600">
                        This action cannot be undone. All data for this candidate will be permanently removed.
                    </p>
                </div>
            </Modal>
            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Appointment Letter Actions">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FaBuilding className="text-purple-500" />
                        Status *
                    </label>
                    <select
                        name="status"
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className={`w-full px-4 py-3 
         
  border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}

                    >
                        <option value="">Select Status</option>
                        {/* <option value="Engineering">Engineering</option> */}
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>

                    </select>
                    {/* {errors.department && (
  <p className="text-red-500 text-sm">{errors.department}</p>
)} */}
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleUpdateStatus}
                        disabled={updateStatusMutation.isPending}
                        className="px-5 py-2.5 bg-gradient-to-r cursor-pointer from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-70 flex items-center gap-2"
                    >
                        {updateStatusMutation.isPending ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            "Update Status"
                        )}
                    </button>

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