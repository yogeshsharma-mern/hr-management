// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import {
//     FaUser,
//     FaEnvelope,
//     FaPhone,
//     FaBriefcase,
//     FaGraduationCap,
//     FaBuilding,
//     FaCalendarAlt,
//     FaClock,
//     FaArrowLeft,
//     FaStar,
//     FaCode,
//     FaCalendarPlus,
//     FaDownload,
//     FaEye,
//     FaTimes,
//     FaFileAlt,
//     FaHandshake,
//     FaFileSignature,
//     FaHistory,
//     FaCalendarCheck,
//     FaCheckCircle
// } from 'react-icons/fa';
// import { MdWork, MdSchool, MdTimeline } from 'react-icons/md';
// import apiPath from '../../api/apiPath';
// import { apiGet } from '../../api/apiFetch';
// import './ViewCandidate.css';
// import { TiTick } from "react-icons/ti";

// export default function ViewCandidate() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [showResume, setShowResume] = useState(false);
//     const [activeTab, setActiveTab] = useState('details');


//     const { data, isLoading, error } = useQuery({
//         queryKey: ["candidateDetails", id],
//         queryFn: () => apiGet(`${apiPath.candidateDetails}/${id}`)
//     });

//     const candidate = data?.data?.candidate;
//     const interviews = data?.data?.interviews || [];

//     const downloadResume = async () => {
//         if (!candidate?.resume) {
//             alert('Resume URL not available');
//             return;
//         }

//         try {
//             const response = await fetch(candidate.resume);
//             const blob = await response.blob();
//             const urlParts = candidate.resume.split('/');
//             const originalFilename = urlParts[urlParts.length - 1];
//             const filename = `${candidate.fullName.replace(/\s+/g, '_')}_Resume_${originalFilename}`;
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a');
//             a.href = url;
//             a.download = filename;
//             document.body.appendChild(a);
//             a.click();
//             window.URL.revokeObjectURL(url);
//             document.body.removeChild(a);
//         } catch (error) {
//             console.error('Error downloading resume:', error);
//             alert('Failed to download resume. Please try again.');
//         }
//     };



// // Add this function to get PDF URL

//     const viewResume = () => {
//         if (!candidate?.resume) {
//             alert('Resume URL not available');
//             return;
//         }
//         setShowResume(true);
//     };

//     if (isLoading) {
//         return (
//             <div className="loading-container">
//                 <div className="loading-spinner"></div>
//                 <p>Loading candidate details...</p>
//             </div>
//         );
//     }

//     if (error || !candidate) {
//         return (
//             <div className="error-container">
//                 <div className="error-icon">⚠️</div>
//                 <h2>Failed to load candidate details</h2>
//                 <p>Please try again later</p>
//                 <button
//                     className="btn-primary"
//                     onClick={() => navigate(-1)}
//                 >
//                     <FaArrowLeft /> Go Back
//                 </button>
//             </div>
//         );
//     }

//     const totalYears = Math.floor(candidate.totalExperienceInYears || 0);
//     const totalMonths = Math.round((candidate.totalExperienceInYears % 1) * 12);

//     const formatDate = (dateString) => {
//         if (!dateString) return 'Present';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             year: 'numeric'
//         });
//     };

//     const calculateDuration = (from, to) => {
//         const start = new Date(from);
//         const end = to ? new Date(to) : new Date();
//         let months = (end.getFullYear() - start.getFullYear()) * 12;
//         months += end.getMonth() - start.getMonth();
//         const years = Math.floor(months / 12);
//         const remainingMonths = months % 12;
//         return { years, months: remainingMonths };
//     };
//     const formatInterviewDate = (dateString) => {
//         if (!dateString) return 'Not scheduled';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'short',
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };
//     const formatInterviewTime = (dateString) => {
//         if (!dateString) return '';
//         const date = new Date(dateString);
//         return date.toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const getStatusColor = (status) => {
//         switch (status?.toLowerCase()) {
//             case 'scheduled': return '#3b82f6';
//             case 'completed': return '#10b981';
//             case 'cancelled': return '#ef4444';
//             case 'rescheduled': return '#f59e0b';
//             default: return '#6b7280';
//         }
//     };

//     const getResultColor = (result) => {
//         switch (result?.toLowerCase()) {
//             case 'passed': return '#10b981';
//             case 'failed': return '#ef4444';
//             case 'pending': return '#f59e0b';
//             case 'on hold': return '#6b7280';
//             default: return '#6b7280';
//         }
//     };
//     // Enhanced renderInterviewDetails with light theme and grid layout
//     const renderInterviewDetails = () => {
//         if (!interviews || interviews.length === 0) {
//             return (
//                 <div className="tab-content">
//                     <div className="empty-state-light">
//                         <div className="empty-illustration-light">
//                             <div className="empty-icon-circle-light">
//                                 <FaHistory className="empty-icon-light" />
//                             </div>
//                             <div className="empty-glow-light"></div>
//                         </div>
//                         <h3 className="empty-title-light">No Interviews Scheduled</h3>
//                         <p className="empty-description-light">Start the interview process by scheduling the first round</p>
//                         <button className="schedule-btn-light" onClick={() => navigate(`/hr/interview/schedule/${id}`)}>
//                             <FaCalendarPlus className="btn-icon-light" />
//                             <span>Schedule First Interview</span>
//                         </button>
//                     </div>
//                 </div>
//             );
//         }

//         // Calculate stats
//         const totalInterviews = interviews.length;
//         const completedInterviews = interviews.filter(i => i.status?.toLowerCase() === 'completed').length;
//         const upcomingInterviews = interviews.filter(i =>
//             i.status?.toLowerCase() === 'scheduled' && new Date(i.interviewDate) > new Date()
//         ).length;
//         const passedInterviews = interviews.filter(i => i.result?.toLowerCase() === 'passed').length;

//         return (
//             <div className="tab-content-light">
//                 {/* Modern Stats Cards - Grid Layout */}
//                 <div className="stats-grid-light">
//                     <div className="stat-card-light total">
//                         <div className="stat-icon-wrapper-light">
//                             <FaHistory className="stat-icon-light" />
//                         </div>
//                         <div className="stat-content-light">
//                             <span className="stat-value-light">{totalInterviews}</span>
//                             <span className="stat-label-light">Total Interviews</span>
//                         </div>
//                         <div className="stat-trend-light">
//                             <span className="trend-badge-light">All rounds</span>
//                         </div>
//                     </div>

//                     <div className="stat-card-light completed">
//                         <div className="stat-icon-wrapper-light">
//                             <FaCheckCircle className="stat-icon-light" />
//                         </div>
//                         <div className="stat-content-light">
//                             <span className="stat-value-light">{completedInterviews}</span>
//                             <span className="stat-label-light">Completed</span>
//                         </div>
//                         <div className="stat-percentage-light">
//                             <span className="percentage-text-light">{Math.round((completedInterviews / totalInterviews) * 100)}%</span>
//                         </div>
//                     </div>

//                     <div className="stat-card-light upcoming">
//                         <div className="stat-icon-wrapper-light">
//                             <FaCalendarAlt className="stat-icon-light" />
//                         </div>
//                         <div className="stat-content-light">
//                             <span className="stat-value-light">{upcomingInterviews}</span>
//                             <span className="stat-label-light">Upcoming</span>
//                         </div>
//                         <div className="stat-footer-light">
//                             <span className="footer-text-light">
//                                 {upcomingInterviews > 0 ? '⏳ Pending' : '✓ No pending'}
//                             </span>
//                         </div>
//                     </div>

//                     <div className="stat-card-light passed">
//                         <div className="stat-icon-wrapper-light">
//                             <TiTick className="stat-icon-light" />
//                         </div>
//                         <div className="stat-content-light">
//                             <span className="stat-value-light">{passedInterviews}</span>
//                             <span className="stat-label-light">Passed</span>
//                         </div>
//                         <div className="stat-footer-light">
//                             <span className="footer-text-light">
//                                 {completedInterviews > 0 ? `${Math.round((passedInterviews / completedInterviews) * 100)}% success` : '0% success'}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Header Section */}
//                 <div className="interviews-header-light">
//                     <div className="header-left-light">
//                         <h3 className="header-title-light">Interview Rounds</h3>
//                         <p className="header-subtitle-light">Comprehensive view of all interview stages</p>
//                     </div>
//                     {/* <button
//                         className="schedule-btn-light primary"
//                         onClick={() => navigate(`/hr/interview/schedule/${id}`)}
//                     >
//                         <FaCalendarPlus className="btn-icon-light" />
//                         <span>Schedule New Interview</span>
//                     </button> */}
//                 </div>

//                 {/* Interview Cards Grid - Responsive: 3 columns on large, 2 on medium, 1 on small */}
//                 <div className="interviews-grid-light">
//                     {interviews.map((interview, index) => {
//                         console.log("interview", interview);
//                         const interviewDate = new Date(interview.interviewDate);
//                         const isPast = interviewDate < new Date();
//                         const isUpcoming = !isPast && interview.status?.toLowerCase() === 'scheduled';
//                         const isCompleted = interview.status?.toLowerCase() === 'completed';
//                         const isPassed = interview.result?.toLowerCase() === 'passed';

//                         return (
//                             <div
//                                 key={interview._id}
//                                 className={`interview-card-light ${isUpcoming ? 'upcoming' : ''} ${isCompleted ? 'completed' : ''}`}
//                             >
//                                 {/* Card Header with Status */}
//                                 <div className="card-header-light">
//                                     <div className="card-header-top">
//                                         <div className={`round-badge-light ${isCompleted ? (isPassed ? 'passed' : 'failed') : 'pending'}`}>
//                                             {isCompleted ? (
//                                                 isPassed ? <TiTick className="badge-icon-light" /> : <FaTimes className="badge-icon-light" />
//                                             ) : (
//                                                 <span className="round-number-light">{index + 1}</span>
//                                             )}
//                                         </div>
//                                         {interview.result && (
//                                             <div className={`result-chip-light ${interview.result.toLowerCase()}`}>
//                                                 <FaCheckCircle className="result-icon-light" />
//                                                 <span>{interview.result}</span>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="round-info-light">
//                                         <h4 className="round-title-light">{interview.round || 'Interview'} Round</h4>
//                                         <div className="date-info-light">
//                                             <div className="date-item-light">
//                                                 <FaCalendarAlt className="date-icon-light" />
//                                                 <span>{formatInterviewDate(interview.interviewDate)}</span>
//                                             </div>
//                                             <div className="date-item-light">
//                                                 <FaClock className="date-icon-light" />
//                                                 <span>{formatInterviewTime(interview.interviewDate)}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Card Body */}
//                                 <div className="card-body-light ">
//                                     {/* Interviewer Section */}
//                                     <div className='flex justify-between items-center'>
//                                         <div className="detail-section-light">
//                                             <span className="detail-label-light">Interviewer</span>
//                                             <div className="interviewer-info-light">
//                                                 <div className="interviewer-avatar-light">
//                                                     {interview.interviewerName?.charAt(0)?.toUpperCase() || '?'}
//                                                 </div>
//                                                 <span className="interviewer-name-light">
//                                                     {interview.interviewerName || 'Not assigned'}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         {/* Mode Section */}
//                                         <div className="detail-section-light">
//                                             <span className="detail-label-light">Mode</span>
//                                             <div className={`mode-badge-light ${interview.mode?.toLowerCase() || 'offline'}`}>
//                                                 {interview.mode?.toLowerCase() === 'online' ? '🌐' : '📍'}
//                                                 <span>{interview.mode || 'Offline'}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="detail-section-light">
//                                         <span className="detail-label-light">Position</span>
//                                         <div className="interviewer-info-light">
//                                             {/* <div className="interviewer-avatar-light">
//                                             {interview.interviewerName?.charAt(0)?.toUpperCase() || '?'}
//                                         </div> */}
//                                             <span className="interviewer-name-light">
//                                                 {interview?.jobId?.title || 'Not assigned'}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Location/Link Section - Compact */}
//                                     <div className="location-section-light">
//                                         <div className="location-header-light">
//                                             <span className="location-icon-light">
//                                                 {interview.mode?.toLowerCase() === 'online' ? '🔗' : '📍'}
//                                             </span>
//                                             <span className="location-label-light">
//                                                 {interview.mode?.toLowerCase() === 'online' ? 'Link' : 'Venue'}
//                                             </span>
//                                         </div>
//                                         <div className="location-value-light">
//                                             {interview.mode?.toLowerCase() === 'online'
//                                                 ? interview.meetingLink?.substring(0, 25) + (interview.meetingLink?.length > 25 ? '...' : '') || 'Not provided'
//                                                 : interview.location?.substring(0, 25) + (interview.location?.length > 25 ? '...' : '') || 'Not specified'
//                                             }
//                                         </div>
//                                     </div>

//                                     {/* Result Badge - If available */}


//                                     {/* Feedback Preview - If available */}
//                                     {/* {interview.feedback && (
//                                     <div className="feedback-preview-light">
//                                         <div className="feedback-header-light">
//                                             <FaFileAlt className="feedback-icon-light" />
//                                             <span className="feedback-label-light">Feedback</span>
//                                         </div>
//                                         <p className="feedback-text-light">
//                                             {interview.feedback.substring(0, 40)}
//                                             {interview.feedback.length > 40 ? '...' : ''}
//                                         </p>
//                                     </div>
//                                 )} */}
//                                 </div>

//                                 {/* Card Footer */}
//                                 {/* <div className="card-footer-light">
//                                 <div className="footer-meta-light">
//                                     <div className="meta-item-light">
//                                         <FaClock className="meta-icon-light" />
//                                         <span>{new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
//                                     </div>
//                                     {interview.updatedAt !== interview.createdAt && (
//                                         <div className="meta-item-light updated">
//                                             <span>Updated</span>
//                                         </div>
//                                     )}
//                                 </div>
//                                 <button
//                                     className="view-btn-light"
//                                     onClick={() => navigate(`/hr/interviews/${interview._id}`)}
//                                 >
//                                     Details
//                                     <span className="btn-arrow-light">→</span>
//                                 </button>
//                             </div> */}

//                                 {/* Subtle accent line */}
//                                 <div className="card-accent-light"></div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         );
//     };

//     const renderOfferDetails = () => {
//         const offers = data?.data?.offers || [];

//         if (!offers || offers.length === 0) {
//             return (
//                 <div className="tab-content-light">
//                     <div className="empty-state-light offer-empty-state">
//                         <div className="empty-illustration-light">
//                             <div className="empty-icon-circle-light offer-icon-circle">
//                                 <FaHandshake className="empty-icon-light offer-icon" />
//                             </div>
//                             <div className="empty-glow-light blue-glow"></div>
//                         </div>
//                         <h3 className="empty-title-light">No Offer Letters</h3>
//                         <p className="empty-description-light">
//                             This candidate hasn't received any offer letters yet.
//                         </p>
//                     </div>
//                 </div>
//             );
//         }

//         const formatCurrency = (amount) => {
//             return new Intl.NumberFormat('en-IN', {
//                 style: 'currency',
//                 currency: 'INR',
//                 minimumFractionDigits: 0,
//                 maximumFractionDigits: 0
//             }).format(amount);
//         };

//         const formatDate = (dateString) => {
//             const date = new Date(dateString);
//             return date.toLocaleDateString('en-US', {
//                 day: 'numeric',
//                 month: 'short',
//                 year: 'numeric'
//             });
//         };

//         const getStatusColor = (status) => {
//             switch (status?.toLowerCase()) {
//                 case 'accepted': return { bg: '#f0fdf9', color: '#0d9488', dot: '#0d9488' };
//                 case 'pending': return { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' };
//                 case 'rejected': return { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' };
//                 case 'negotiation': return { bg: '#eff6ff', color: '#1e40af', dot: '#3b82f6' };
//                 default: return { bg: '#f8fafc', color: '#475569', dot: '#94a3b8' };
//             }
//         };

//         return (
//             <div className="tab-content-light offer-tab-content">
//                 {/* Header */}
//                 <div className="offer-list-header">
//                     <div className="header-left">
//                         <h3 className="offer-list-title">Offer Letters</h3>
//                         <p className="offer-list-subtitle">
//                             {offers.length} {offers.length === 1 ? 'offer' : 'offers'} extended
//                         </p>
//                     </div>
//                     <div className="offer-count-badge">
//                         <FaHandshake className="count-icon" />
//                         <span>{offers.length}</span>
//                     </div>
//                 </div>

//                 {/* Offer List - Row Wise */}
//                 <div className="offer-list-container">
//                     {offers.map((offer, index) => {
//                         const statusStyle = getStatusColor(offer.status);

//                         return (
//                             <div key={offer._id} className="offer-row-card">
//                                 {/* Row Header with Status */}
//                                 <div className="offer-row-header">
//                                     <div className="offer-type-section">
//                                         <div className="offer-type-icon-wrapper">
//                                             <FaFileSignature className="offer-type-icon" />
//                                         </div>
//                                         <div className="offer-basic-info">
//                                             <div className="offer-title-row">
//                                                 <h4 className="offer-position">{offer.position}</h4>
//                                                 <span
//                                                     className="offer-status-badge"
//                                                     style={{
//                                                         backgroundColor: statusStyle.bg,
//                                                         color: statusStyle.color,
//                                                         borderColor: statusStyle.bg
//                                                     }}
//                                                 >
//                                                     <span
//                                                         className="status-dot"
//                                                         style={{ backgroundColor: statusStyle.dot }}
//                                                     ></span>
//                                                     {offer.status?.charAt(0).toUpperCase() + offer.status?.slice(1)}
//                                                 </span>
//                                             </div>
//                                             <div className="offer-meta">
//                                                 <span className="offer-meta-item">
//                                                     <FaBuilding className="meta-icon" />
//                                                     {offer.department || 'IT'}
//                                                 </span>
//                                                 <span className="offer-meta-item">
//                                                     <FaCalendarAlt className="meta-icon" />
//                                                     Joining: {formatDate(offer.joiningDate)}
//                                                 </span>
//                                                 <span className="offer-meta-item">
//                                                     <FaUser className="meta-icon" />
//                                                     {offer.reportingManager}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="offer-date">
//                                         <FaClock className="date-icon" />
//                                         <span>{formatDate(offer.createdAt)}</span>
//                                     </div>
//                                 </div>

//                                 {/* Row Content - Key Offer Details */}
//                                 <div className="offer-row-content">
//                                     {/* CTC Section - Most Important */}
//                                     <div className="offer-highlight-section">
//                                         <div className="ctc-highlight">
//                                             <span className="ctc-label">Annual CTC</span>
//                                             <div className="ctc-value">
//                                                 <span className="ctc-currency">₹</span>
//                                                 <span className="ctc-amount">{offer.totalAnnualCTC?.toLocaleString('en-IN')}</span>
//                                             </div>
//                                         </div>
//                                         <div className="ctc-divider"></div>
//                                         <div className="monthly-ctc">
//                                             <span className="monthly-label">Monthly Gross</span>
//                                             <span className="monthly-value">{formatCurrency(offer.monthlyGrossSalary)}</span>
//                                         </div>
//                                     </div>

//                                     {/* Key Details Grid */}
//                                     <div className="offer-key-details">
//                                         <div className="key-detail-item">
//                                             <span className="key-label">Basic + HRA</span>
//                                             <span className="key-value">
//                                                 {formatCurrency(offer.basicSalary + offer.houseRentAllowance)}
//                                             </span>
//                                         </div>
//                                         <div className="key-detail-item">
//                                             <span className="key-label">Annual Bonus</span>
//                                             <span className="key-value highlight">
//                                                 {formatCurrency(offer.annualBonus)}
//                                             </span>
//                                         </div>
//                                         <div className="key-detail-item">
//                                             <span className="key-label">Probation</span>
//                                             <span className="key-value">{offer.probationPeriod} months</span>
//                                         </div>
//                                         <div className="key-detail-item">
//                                             <span className="key-label">Location</span>
//                                             <span className="key-value location">{offer.location}</span>
//                                         </div>
//                                     </div>

//                                     {/* Special Remarks - If Available */}
//                                     {offer.specialRemarks && (
//                                         <div className="offer-remarks-preview">
//                                             <FaFileAlt className="remarks-icon" />
//                                             <p className="remarks-text">{offer.specialRemarks}</p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Simple Divider for multiple offers */}
//                                 {index < offers.length - 1 && <div className="offer-row-divider"></div>}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         );
//     };

//     const renderAppointmentDetails = () => (
//         <div className="tab-content">
//             <div className="empty-state">
//                 <FaFileSignature className="empty-icon" />
//                 <h3>Appointment Details</h3>
//                 <p>No appointment scheduled</p>
//             </div>
//         </div>
//     );

// const renderDocuments = () => {
//     const offers = data?.data?.offers || [];
//     const appointmentLetters = data?.data?.offers?.filter(offer => offer.isAppointmentLetter) || [];
//     const hasResume = candidate?.resume;
//     const [previewDocument, setPreviewDocument] = useState(null);
//     const [previewType, setPreviewType] = useState('');
//     const [previewUrl, setPreviewUrl] = useState('');
    
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0
//         }).format(amount);
//     };
    
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             day: 'numeric',
//             month: 'short',
//             year: 'numeric'
//         });
//     };

//     // Function to fetch and create blob URL for offer/appointment letters
//     const fetchDocumentBlob = async (doc, type) => {
//         try {
//             let url = '';
//             if (type === 'offer') {
//                 url = `${apiPath.offerLetterPdf}/${doc._id}`;
//             } else if (type === 'appointment') {
//                 url = `${apiPath.appointmentLetterPdf}/${doc._id}`;
//             }
            
//             const response = await fetch(url, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             const blob = await response.blob();
//             return URL.createObjectURL(blob);
//         } catch (error) {
//             console.error('Error fetching document:', error);
//             return null;
//         }
//     };

//     // Handle Preview - Show inline in the page
//     const handlePreview = async (doc, type) => {
//         // Clear previous preview
//         if (previewUrl) {
//             URL.revokeObjectURL(previewUrl);
//         }
        
//         if (type === 'resume') {
//             setPreviewUrl(candidate?.resume);
//         } else {
//             const blobUrl = await fetchDocumentBlob(doc, type);
//             if (blobUrl) {
//                 setPreviewUrl(blobUrl);
//             }
//         }
//         setPreviewDocument(doc);
//         setPreviewType(type);
//     };

//     // Handle Full Screen - Open in new tab
//     const handleFullScreen = async (doc, type) => {
//         if (type === 'resume') {
//             window.open(candidate?.resume, '_blank');
//         } else {
//             try {
//                 let url = '';
//                 if (type === 'offer') {
//                     url = `${apiPath.offerLetterPdf}/${doc._id}`;
//                 } else if (type === 'appointment') {
//                     url = `${apiPath.appointmentLetterPdf}/${doc._id}`;
//                 }
                
//                 const response = await fetch(url, {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });
//                 const blob = await response.blob();
//                 const blobUrl = URL.createObjectURL(blob);
//                 window.open(blobUrl, '_blank');
//                 setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
//             } catch (error) {
//                 console.error('Error opening document:', error);
//                 alert('Failed to open document');
//             }
//         }
//     };

//     const handleClosePreview = () => {
//         if (previewUrl && previewType !== 'resume') {
//             URL.revokeObjectURL(previewUrl);
//         }
//         setPreviewDocument(null);
//         setPreviewType('');
//         setPreviewUrl('');
//     };

//     return (
//         <div className="tab-content-light documents-tab-content">
//             {/* Header Section */}
//             <div className="documents-header-section">
//                 <div className="header-left">
//                     <h3 className="documents-list-title">Documents</h3>
//                     <p className="documents-list-subtitle">
//                         All candidate documents in one place
//                     </p>
//                 </div>
//                 <div className="documents-stats">
//                     <div className="stat-pill">
//                         <span className="stat-count">{[
//                             hasResume ? 1 : 0,
//                             offers.length,
//                             appointmentLetters.length
//                         ].reduce((a, b) => a + b, 0)}</span>
//                         <span className="stat-label">Total Documents</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Document Grid */}
//             <div className="documents-grid">
//                 {/* Resume Card */}
//                 {hasResume && (
//                     <div className="document-card-modern">
//                         <div className="document-card-header">
//                             <div className="document-icon-wrapper resume">
//                                 <FaFileAlt className="document-icon" />
//                             </div>
//                             <div className="document-type-badge">
//                                 <span className="badge-dot"></span>
//                                 Primary
//                             </div>
//                         </div>
                        
//                         <div className="document-card-content">
//                             <h4 className="document-title">Resume</h4>
//                             <p className="document-description">
//                                 {candidate.fullName}'s resume • {candidate.experience?.[0]?.jobTitle || 'Professional'}
//                             </p>
                            
//                             <div className="document-metadata">
//                                 <div className="metadata-item">
//                                     <FaClock className="metadata-icon" />
//                                     <span>Updated {formatDate(candidate.updatedAt)}</span>
//                                 </div>
//                                 <div className="metadata-item">
//                                     <span className="file-format-badge">
//                                         {candidate.resume?.split('.').pop()?.toUpperCase()}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="document-card-footer">
//                             <button 
//                                 className="document-action-btn view"
//                                 onClick={() => handlePreview(candidate.resume, 'resume')}
//                             >
//                                 <FaEye className="btn-icon" />
//                                 <span>Preview</span>
//                             </button>
//                             <button 
//                                 className="document-action-btn fullscreen"
//                                 onClick={() => handleFullScreen(candidate.resume, 'resume')}
//                             >
//                                 <span className="fullscreen-icon">⛶</span>
//                                 <span>Full Screen</span>
//                             </button>
//                         </div>
                        
//                         <div className="document-card-accent resume-accent"></div>
//                     </div>
//                 )}

//                 {/* Offer Letters Section */}
//                 {offers.map((offer) => (
//                     <div key={offer._id} className="document-card-modern offer">
//                         <div className="document-card-header">
//                             <div className="document-icon-wrapper offer">
//                                 <FaHandshake className="document-icon" />
//                             </div>
//                             <div className={`document-status-badge ${offer.status}`}>
//                                 <span className="status-dot"></span>
//                                 {offer.status}
//                             </div>
//                         </div>
                        
//                         <div className="document-card-content">
//                             <h4 className="document-title">Offer Letter</h4>
//                             <p className="document-description">
//                                 {offer.position} • {formatCurrency(offer.totalAnnualCTC)}
//                             </p>
                            
//                             <div className="document-metadata">
//                                 <div className="metadata-item">
//                                     <FaCalendarAlt className="metadata-icon" />
//                                     <span>Joining {formatDate(offer.joiningDate)}</span>
//                                 </div>
//                                 <div className="metadata-item">
//                                     <FaUser className="metadata-icon" />
//                                     <span>{offer.reportingManager}</span>
//                                 </div>
//                                 <div className="metadata-item">
//                                     <span className="file-format-badge">PDF</span>
//                                 </div>
//                             </div>
                            
//                             {offer.specialRemarks && (
//                                 <div className="document-remark-tooltip">
//                                     <span className="remark-dot">💬</span>
//                                     <span className="remark-preview">
//                                         {offer.specialRemarks.substring(0, 30)}...
//                                     </span>
//                                 </div>
//                             )}
//                         </div>
                        
//                         <div className="document-card-footer">
//                             <button 
//                                 className="document-action-btn view"
//                                 onClick={() => handlePreview(offer, 'offer')}
//                             >
//                                 <FaEye className="btn-icon" />
//                                 <span>Preview</span>
//                             </button>
//                             <button 
//                                 className="document-action-btn fullscreen"
//                                 onClick={() => handleFullScreen(offer, 'offer')}
//                             >
//                                 <span className="fullscreen-icon">⛶</span>
//                                 <span>Full Screen</span>
//                             </button>
//                         </div>
                        
//                         <div className="document-card-accent offer-accent"></div>
//                     </div>
//                 ))}

//                 {/* Appointment Letters */}
//                 {appointmentLetters.map((letter) => (
//                     <div key={letter._id} className="document-card-modern appointment">
//                         <div className="document-card-header">
//                             <div className="document-icon-wrapper appointment">
//                                 <FaFileSignature className="document-icon" />
//                             </div>
//                             <div className={`document-status-badge ${letter.status}`}>
//                                 <span className="status-dot"></span>
//                                 {letter.status}
//                             </div>
//                         </div>
                        
//                         <div className="document-card-content">
//                             <h4 className="document-title">Appointment Letter</h4>
//                             <p className="document-description">
//                                 {letter.position} • Confirmed
//                             </p>
                            
//                             <div className="document-metadata">
//                                 <div className="metadata-item">
//                                     <FaCalendarAlt className="metadata-icon" />
//                                     <span>Created {formatDate(letter.createdAt)}</span>
//                                 </div>
//                                 <div className="metadata-item">
//                                     <FaBuilding className="metadata-icon" />
//                                     <span>{letter.department}</span>
//                                 </div>
//                                 <div className="metadata-item">
//                                     <span className="file-format-badge">PDF</span>
//                                 </div>
//                             </div>
//                         </div>
                        
//                         <div className="document-card-footer">
//                             <button 
//                                 className="document-action-btn view"
//                                 onClick={() => handlePreview(letter, 'appointment')}
//                             >
//                                 <FaEye className="btn-icon" />
//                                 <span>Preview</span>
//                             </button>
//                             <button 
//                                 className="document-action-btn fullscreen"
//                                 onClick={() => handleFullScreen(letter, 'appointment')}
//                             >
//                                 <span className="fullscreen-icon">⛶</span>
//                                 <span>Full Screen</span>
//                             </button>
//                         </div>
                        
//                         <div className="document-card-accent appointment-accent"></div>
//                     </div>
//                 ))}
//             </div>

//             {/* Inline Document Preview Section */}
//             {previewDocument && previewUrl && (
//                 <div className="document-preview-section">
//                     <div className="document-preview-header">
//                         <div className="preview-title">
//                             <div className="preview-icon">
//                                 {previewType === 'resume' && <FaFileAlt />}
//                                 {previewType === 'offer' && <FaHandshake />}
//                                 {previewType === 'appointment' && <FaFileSignature />}
//                             </div>
//                             <div className="preview-info">
//                                 <h3>
//                                     {previewType === 'resume' && `${candidate?.fullName}'s Resume`}
//                                     {previewType === 'offer' && `Offer Letter - ${previewDocument?.position}`}
//                                     {previewType === 'appointment' && `Appointment Letter - ${previewDocument?.position}`}
//                                 </h3>
//                                 <p>
//                                     {previewType === 'resume' && 'Primary application document'}
//                                     {previewType === 'offer' && `Generated on ${formatDate(previewDocument?.createdAt)}`}
//                                     {previewType === 'appointment' && `Confirmed on ${formatDate(previewDocument?.createdAt)}`}
//                                 </p>
//                             </div>
//                         </div>
//                         <div className="preview-actions">
//                             <button 
//                                 className="preview-action-btn fullscreen-btn"
//                                 onClick={() => {
//                                     handleFullScreen(previewDocument, previewType);
//                                 }}
//                             >
//                                 <span className="fullscreen-icon">⛶</span>
//                                 <span>Open in New Tab</span>
//                             </button>
//                             <button 
//                                 className="preview-action-btn close-btn"
//                                 onClick={handleClosePreview}
//                             >
//                                 <FaTimes />
//                             </button>
//                         </div>
//                     </div>
//                     <div className="document-preview-body">
//                         {previewUrl.endsWith('.pdf') || previewType !== 'resume' ? (
//                             <iframe
//                                 src={previewUrl}
//                                 title={`${previewType} Preview`}
//                                 className="document-preview-iframe"
//                             />
//                         ) : (
//                             <div className="document-image-preview">
//                                 <img
//                                     src={previewUrl}
//                                     alt={`${previewType} Preview`}
//                                     className="document-preview-image"
//                                 />
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//     const renderCandidateDetails = () => (
//         <div className="tab-content">
//             {/* Professional Summary */}
//             <div className="section-card">
//                 <h3 className="section-title">Professional Summary</h3>
//                 <p className="summary-text">
//                     {candidate.summary || `Experienced professional with ${totalYears} years and ${totalMonths} months of experience in ${candidate.skills?.slice(0, 3).join(', ')}.`}
//                 </p>
//             </div>

//             {/* Contact Information */}
//             <div className="section-card">
//                 <h3 className="section-title">Contact Information</h3>
//                 <div className="contact-grid">
//                     <div className="contact-field">
//                         <span className="contact-label">Email</span>
//                         <span className="contact-value">{candidate.email}</span>
//                     </div>
//                     <div className="contact-field">
//                         <span className="contact-label">Phone</span>
//                         <span className="contact-value">{candidate.phone}</span>
//                     </div>
//                     <div className="contact-field">
//                         <span className="contact-label">Location</span>
//                         <span className="contact-value">{candidate.location || 'Not specified'}</span>
//                     </div>
//                     <div className="contact-field">
//                         <span className="contact-label">Applied On</span>
//                         <span className="contact-value">
//                             {new Date(candidate.createdAt).toLocaleDateString('en-US', {
//                                 day: 'numeric',
//                                 month: 'long',
//                                 year: 'numeric'
//                             })}
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* Skills */}
//             <div className="section-card">
//                 <div className="section-header">
//                     <h3 className="section-title">Technical Skills</h3>
//                     <span className="section-count">{candidate.skills?.length} skills</span>
//                 </div>
//                 <div className="skills-grid">
//                     {candidate.skills?.map((skill, index) => (
//                         <div key={index} className="skill-item">
//                             {skill}
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Experience */}
//             <div className="section-card">
//                 <div className="section-header">
//                     <h3 className="section-title">Work Experience</h3>
//                     <span className="section-total">{totalYears} years {totalMonths} months total</span>
//                 </div>
//                 <div className="experience-timeline">
//                     {candidate.experience?.map((exp, index) => {
//                         const duration = calculateDuration(exp.from, exp.to);
//                         return (
//                             <div key={index} className="experience-item">
//                                 <div className="exp-timeline-marker"></div>
//                                 <div className="exp-content">
//                                     <div className="exp-header">
//                                         <h4 className="exp-company">{exp.companyName}</h4>
//                                         <span className="exp-duration">
//                                             {formatDate(exp.from)} - {formatDate(exp.to)} • {duration.years > 0 && `${duration.years}y `}{duration.months > 0 && `${duration.months}m`}
//                                         </span>
//                                     </div>
//                                     <div className="exp-position">{exp.jobTitle}</div>
//                                     {exp.responsibilities && (
//                                         <p className="exp-description">{exp.responsibilities}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Education */}
//             <div className="section-card">
//                 <h3 className="section-title">Education</h3>
//                 <div className="education-list">
//                     {candidate.education?.map((edu, index) => (
//                         <div key={index} className="education-item">
//                             <div className="edu-header">
//                                 <h4 className="edu-institution">{edu.institution}</h4>
//                                 <span className="edu-year">{edu.yearOfPassing}</span>
//                             </div>
//                             <div className="edu-details">
//                                 <span className="edu-qualification">{edu.qualification}</span>
//                                 {edu.cgpa && (
//                                     <span className="edu-grade">CGPA: {edu.cgpa}/10</span>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Additional Information */}
//             <div className="section-card">
//                 <h3 className="section-title">Additional Information</h3>
//                 <div className="info-grid">
//                     <div className="info-item">
//                         <span className="info-label">Total Experience</span>
//                         <span className="info-value">{totalYears} years {totalMonths} months</span>
//                     </div>
//                     <div className="info-item">
//                         <span className="info-label">Current Status</span>
//                         <span className="status-badge active">Active Candidate</span>
//                     </div>
//                     <div className="info-item">
//                         <span className="info-label">Last Updated</span>
//                         <span className="info-value">
//                             {new Date(candidate.updatedAt).toLocaleDateString('en-US', {
//                                 month: 'short',
//                                 day: 'numeric',
//                                 year: 'numeric'
//                             })}
//                         </span>
//                     </div>
//                     <div className="info-item">
//                         <span className="info-label">Job ID</span>
//                         <span className="info-value code">{candidate.jobId || 'N/A'}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <div className="candidate-details-container">
//             {/* Resume Modal */}
//             {showResume && candidate?.resume && (
//                 <div className="resume-modal-overlay" onClick={() => setShowResume(false)}>
//                     <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="resume-modal-header">
//                             <h3>{candidate.fullName}'s Resume</h3>
//                             <button className="modal-close-btn" onClick={() => setShowResume(false)}>
//                                 <FaTimes />
//                             </button>
//                         </div>
//                         <div className="resume-modal-body">
//                             {candidate.resume.endsWith('.pdf') ? (
//                                 <iframe
//                                     src={candidate.resume}
//                                     title={`${candidate.fullName}'s Resume`}
//                                     className="resume-iframe"
//                                 />
//                             ) : (
//                                 <div className="resume-image-container">
//                                     <img
//                                         src={candidate.resume}
//                                         alt={`${candidate.fullName}'s Resume`}
//                                         className="resume-image"
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Header */}
//             <div className="candidate-header">
//                 <button className="back-btn" onClick={() => navigate(-1)}>
//                     <FaArrowLeft /> Back to Candidates
//                 </button>
//                 <div className="header-actions">
//                     <button className="action-btn secondary" onClick={viewResume}>
//                         <FaEye /> View Resume
//                     </button>
//                     <button className="action-btn secondary" onClick={downloadResume}>
//                         <FaDownload /> Download Resume
//                     </button>
//                     <button
//                         onClick={() => navigate(`/hr/interviews/schedule/${id}`)}
//                         className="action-btn primary"
//                     >
//                         <FaCalendarPlus /> Schedule Interview
//                     </button>
//                 </div>
//             </div>

//             {/* Candidate Profile */}
//             <div className="profile-card">
//                 <div className="profile-header">
//                     <div className="avatar">
//                         {candidate.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
//                     </div>
//                     <div className="profile-info">
//                         <h1 className="candidate-name">{candidate.fullName}</h1>
//                         <p className="candidate-title">
//                             {candidate.experience?.[0]?.jobTitle || 'Professional'} • {totalYears} years experience
//                         </p>
//                         <div className="profile-meta">
//                             <span className="meta-item">
//                                 <FaEnvelope /> {candidate.email}
//                             </span>
//                             <span className="meta-item">
//                                 <FaPhone /> {candidate.phone}
//                             </span>
//                             <span className="meta-item">
//                                 <FaClock /> Applied {new Date(candidate.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Tabs Navigation */}
//             <div className="tabs-container">
//                 <div className="tabs-header">
//                     <button
//                         className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('details')}
//                     >
//                         <FaUser /> Candidate Details
//                     </button>
//                     <button
//                         className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('interview')}
//                     >
//                         <FaHistory /> Interview Details
//                     </button>
//                     <button
//                         className={`tab-btn ${activeTab === 'offer' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('offer')}
//                     >
//                         <FaHandshake /> Offer
//                     </button>
//                     {/* <button
//                         className={`tab-btn ${activeTab === 'appointment' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('appointment')}
//                     >
//                         <FaFileSignature /> Appointment
//                     </button> */}
//                     <button
//                         className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
//                         onClick={() => setActiveTab('documents')}
//                     >
//                         <FaFileAlt /> Documents
//                     </button>
//                 </div>

//                 <div className="tabs-content">
//                     {activeTab === 'details' && renderCandidateDetails()}
//                     {activeTab === 'interview' && renderInterviewDetails()}
//                     {activeTab === 'offer' && renderOfferDetails()}
//                     {/* {activeTab === 'appointment' && renderAppointmentDetails()} */}
//                     {activeTab === 'documents' && renderDocuments()}
//                 </div>
                
//             </div>
//             {/* Fullscreen Document Viewer */}

//         </div>
//     );
// }
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBriefcase,
    FaGraduationCap,
    FaBuilding,
    FaCalendarAlt,
    FaClock,
    FaArrowLeft,
    FaStar,
    FaCode,
    FaCalendarPlus,
    FaDownload,
    FaEye,
    FaTimes,
    FaFileAlt,
    FaHandshake,
    FaFileSignature,
    FaHistory,
    FaCalendarCheck,
    FaCheckCircle
} from 'react-icons/fa';
import { MdWork, MdSchool, MdTimeline } from 'react-icons/md';
import apiPath from '../../api/apiPath';
import { apiGet,apiGetPdf } from '../../api/apiFetch';
import './ViewCandidate.css';
import { TiTick } from "react-icons/ti";

export default function ViewCandidate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showResume, setShowResume] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
            const [previewDocument, setPreviewDocument] = useState(null);
        const [previewType, setPreviewType] = useState('');
        const [previewUrl, setPreviewUrl] = useState('');

    const { data, isLoading, error } = useQuery({
        queryKey: ["candidateDetails", id],
        queryFn: () => apiGet(`${apiPath.candidateDetails}/${id}`)
    });

    const candidate = data?.data?.candidate;
    const interviews = data?.data?.interviews || [];

    const downloadResume = async () => {
        if (!candidate?.resume) {
            alert('Resume URL not available');
            return;
        }

        try {
            const response = await fetch(candidate.resume);
            const blob = await response.blob();
            const urlParts = candidate.resume.split('/');
            const originalFilename = urlParts[urlParts.length - 1];
            const filename = `${candidate.fullName.replace(/\s+/g, '_')}_Resume_${originalFilename}`;
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading resume:', error);
            alert('Failed to download resume. Please try again.');
        }
    };

    const viewResume = () => {
        if (!candidate?.resume) {
            alert('Resume URL not available');
            return;
        }
        setShowResume(true);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading candidate details...</p>
            </div>
        );
    }

    if (error || !candidate) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2>Failed to load candidate details</h2>
                <p>Please try again later</p>
                <button
                    className="btn-primary"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    const totalYears = Math.floor(candidate.totalExperienceInYears || 0);
    const totalMonths = Math.round((candidate.totalExperienceInYears % 1) * 12);

    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateDuration = (from, to) => {
        const start = new Date(from);
        const end = to ? new Date(to) : new Date();
        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months += end.getMonth() - start.getMonth();
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        return { years, months: remainingMonths };
    };
    
    const formatInterviewDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    
    const formatInterviewTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'scheduled': return '#3b82f6';
            case 'completed': return '#10b981';
            case 'cancelled': return '#ef4444';
            case 'rescheduled': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const getResultColor = (result) => {
        switch (result?.toLowerCase()) {
            case 'passed': return '#10b981';
            case 'failed': return '#ef4444';
            case 'pending': return '#f59e0b';
            case 'on hold': return '#6b7280';
            default: return '#6b7280';
        }
    };

    // Enhanced renderInterviewDetails with light theme and grid layout
    const renderInterviewDetails = () => {
        if (!interviews || interviews.length === 0) {
            return (
                <div className="tab-content">
                    <div className="empty-state-light">
                        <div className="empty-illustration-light">
                            <div className="empty-icon-circle-light">
                                <FaHistory className="empty-icon-light" />
                            </div>
                            <div className="empty-glow-light"></div>
                        </div>
                        <h3 className="empty-title-light">No Interviews Scheduled</h3>
                        <p className="empty-description-light">Start the interview process by scheduling the first round</p>
                        <button className="schedule-btn-light" onClick={() => navigate(`/hr/interview/schedule/${id}`)}>
                            <FaCalendarPlus className="btn-icon-light" />
                            <span>Schedule First Interview</span>
                        </button>
                    </div>
                </div>
            );
        }

        // Calculate stats
        const totalInterviews = interviews.length;
        const completedInterviews = interviews.filter(i => i.status?.toLowerCase() === 'completed').length;
        const upcomingInterviews = interviews.filter(i =>
            i.status?.toLowerCase() === 'scheduled' && new Date(i.interviewDate) > new Date()
        ).length;
        const passedInterviews = interviews.filter(i => i.result?.toLowerCase() === 'passed').length;

        return (
            <div className="tab-content-light">
                {/* Modern Stats Cards - Grid Layout */}
                <div className="stats-grid-light">
                    <div className="stat-card-light total">
                        <div className="stat-icon-wrapper-light">
                            <FaHistory className="stat-icon-light" />
                        </div>
                        <div className="stat-content-light">
                            <span className="stat-value-light">{totalInterviews}</span>
                            <span className="stat-label-light">Total Interviews</span>
                        </div>
                        <div className="stat-trend-light">
                            <span className="trend-badge-light">All rounds</span>
                        </div>
                    </div>

                    <div className="stat-card-light completed">
                        <div className="stat-icon-wrapper-light">
                            <FaCheckCircle className="stat-icon-light" />
                        </div>
                        <div className="stat-content-light">
                            <span className="stat-value-light">{completedInterviews}</span>
                            <span className="stat-label-light">Completed</span>
                        </div>
                        <div className="stat-percentage-light">
                            <span className="percentage-text-light">{Math.round((completedInterviews / totalInterviews) * 100)}%</span>
                        </div>
                    </div>

                    <div className="stat-card-light upcoming">
                        <div className="stat-icon-wrapper-light">
                            <FaCalendarAlt className="stat-icon-light" />
                        </div>
                        <div className="stat-content-light">
                            <span className="stat-value-light">{upcomingInterviews}</span>
                            <span className="stat-label-light">Upcoming</span>
                        </div>
                        <div className="stat-footer-light">
                            <span className="footer-text-light">
                                {upcomingInterviews > 0 ? '⏳ Pending' : '✓ No pending'}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card-light passed">
                        <div className="stat-icon-wrapper-light">
                            <TiTick className="stat-icon-light" />
                        </div>
                        <div className="stat-content-light">
                            <span className="stat-value-light">{passedInterviews}</span>
                            <span className="stat-label-light">Passed</span>
                        </div>
                        <div className="stat-footer-light">
                            <span className="footer-text-light">
                                {completedInterviews > 0 ? `${Math.round((passedInterviews / completedInterviews) * 100)}% success` : '0% success'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Header Section */}
                <div className="interviews-header-light">
                    <div className="header-left-light">
                        <h3 className="header-title-light">Interview Rounds</h3>
                        <p className="header-subtitle-light">Comprehensive view of all interview stages</p>
                    </div>
                </div>

                {/* Interview Cards Grid */}
                <div className="interviews-grid-light">
                    {interviews.map((interview, index) => {
                        const interviewDate = new Date(interview.interviewDate);
                        const isPast = interviewDate < new Date();
                        const isUpcoming = !isPast && interview.status?.toLowerCase() === 'scheduled';
                        const isCompleted = interview.status?.toLowerCase() === 'completed';
                        const isPassed = interview.result?.toLowerCase() === 'passed';

                        return (
                            <div
                                key={interview._id}
                                className={`interview-card-light ${isUpcoming ? 'upcoming' : ''} ${isCompleted ? 'completed' : ''}`}
                            >
                                {/* Card Header with Status */}
                                <div className="card-header-light">
                                    <div className="card-header-top">
                                        <div className={`round-badge-light ${isCompleted ? (isPassed ? 'passed' : 'failed') : 'pending'}`}>
                                            {isCompleted ? (
                                                isPassed ? <TiTick className="badge-icon-light" /> : <FaTimes className="badge-icon-light" />
                                            ) : (
                                                <span className="round-number-light">{index + 1}</span>
                                            )}
                                        </div>
                                        {interview.result && (
                                            <div className={`result-chip-light ${interview.result.toLowerCase()}`}>
                                                <FaCheckCircle className="result-icon-light" />
                                                <span>{interview.result}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="round-info-light">
                                        <h4 className="round-title-light">{interview.round || 'Interview'} Round</h4>
                                        <div className="date-info-light">
                                            <div className="date-item-light">
                                                <FaCalendarAlt className="date-icon-light" />
                                                <span>{formatInterviewDate(interview.interviewDate)}</span>
                                            </div>
                                            <div className="date-item-light">
                                                <FaClock className="date-icon-light" />
                                                <span>{formatInterviewTime(interview.interviewDate)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="card-body-light ">
                                    <div className='flex justify-between items-center'>
                                        <div className="detail-section-light">
                                            <span className="detail-label-light">Interviewer</span>
                                            <div className="interviewer-info-light">
                                                <div className="interviewer-avatar-light">
                                                    {interview.interviewerName?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="interviewer-name-light">
                                                    {interview.interviewerName || 'Not assigned'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="detail-section-light">
                                            <span className="detail-label-light">Mode</span>
                                            <div className={`mode-badge-light ${interview.mode?.toLowerCase() || 'offline'}`}>
                                                {interview.mode?.toLowerCase() === 'online' ? '🌐' : '📍'}
                                                <span>{interview.mode || 'Offline'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail-section-light">
                                        <span className="detail-label-light">Position</span>
                                        <div className="interviewer-info-light">
                                            <span className="interviewer-name-light">
                                                {interview?.jobId?.title || 'Not assigned'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="location-section-light">
                                        <div className="location-header-light">
                                            <span className="location-icon-light">
                                                {interview.mode?.toLowerCase() === 'online' ? '🔗' : '📍'}
                                            </span>
                                            <span className="location-label-light">
                                                {interview.mode?.toLowerCase() === 'online' ? 'Link' : 'Venue'}
                                            </span>
                                        </div>
                                        <div className="location-value-light">
                                            {interview.mode?.toLowerCase() === 'online'
                                                ? interview.meetingLink?.substring(0, 25) + (interview.meetingLink?.length > 25 ? '...' : '') || 'Not provided'
                                                : interview.location?.substring(0, 25) + (interview.location?.length > 25 ? '...' : '') || 'Not specified'
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="card-accent-light"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderOfferDetails = () => {
        const offers = data?.data?.offers || [];

        if (!offers || offers.length === 0) {
            return (
                <div className="tab-content-light">
                    <div className="empty-state-light offer-empty-state">
                        <div className="empty-illustration-light">
                            <div className="empty-icon-circle-light offer-icon-circle">
                                <FaHandshake className="empty-icon-light offer-icon" />
                            </div>
                            <div className="empty-glow-light blue-glow"></div>
                        </div>
                        <h3 className="empty-title-light">No Offer Letters</h3>
                        <p className="empty-description-light">
                            This candidate hasn't received any offer letters yet.
                        </p>
                    </div>
                </div>
            );
        }

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        };

        const getStatusColor = (status) => {
            switch (status?.toLowerCase()) {
                case 'accepted': return { bg: '#f0fdf9', color: '#0d9488', dot: '#0d9488' };
                case 'pending': return { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' };
                case 'rejected': return { bg: '#fef2f2', color: '#b91c1c', dot: '#ef4444' };
                case 'negotiation': return { bg: '#eff6ff', color: '#1e40af', dot: '#3b82f6' };
                default: return { bg: '#f8fafc', color: '#475569', dot: '#94a3b8' };
            }
        };

        return (
            <div className="tab-content-light offer-tab-content">
                <div className="offer-list-header">
                    <div className="header-left">
                        <h3 className="offer-list-title">Offer Letters</h3>
                        <p className="offer-list-subtitle">
                            {offers.length} {offers.length === 1 ? 'offer' : 'offers'} extended
                        </p>
                    </div>
                    <div className="offer-count-badge">
                        <FaHandshake className="count-icon" />
                        <span>{offers.length}</span>
                    </div>
                </div>

                <div className="offer-list-container">
                    {offers.map((offer, index) => {
                        const statusStyle = getStatusColor(offer.status);

                        return (
                            <div key={offer._id} className="offer-row-card">
                                <div className="offer-row-header">
                                    <div className="offer-type-section">
                                        <div className="offer-type-icon-wrapper">
                                            <FaFileSignature className="offer-type-icon" />
                                        </div>
                                        <div className="offer-basic-info">
                                            <div className="offer-title-row">
                                                <h4 className="offer-position">{offer.position}</h4>
                                                <span
                                                    className="offer-status-badge"
                                                    style={{
                                                        backgroundColor: statusStyle.bg,
                                                        color: statusStyle.color,
                                                        borderColor: statusStyle.bg
                                                    }}
                                                >
                                                    <span
                                                        className="status-dot"
                                                        style={{ backgroundColor: statusStyle.dot }}
                                                    ></span>
                                                    {offer.status?.charAt(0).toUpperCase() + offer.status?.slice(1)}
                                                </span>
                                            </div>
                                            <div className="offer-meta">
                                                <span className="offer-meta-item">
                                                    <FaBuilding className="meta-icon" />
                                                    {offer.department || 'IT'}
                                                </span>
                                                <span className="offer-meta-item">
                                                    <FaCalendarAlt className="meta-icon" />
                                                    Joining: {formatDate(offer.joiningDate)}
                                                </span>
                                                <span className="offer-meta-item">
                                                    <FaUser className="meta-icon" />
                                                    {offer.reportingManager}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="offer-date">
                                        <FaClock className="date-icon" />
                                        <span>{formatDate(offer.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="offer-row-content">
                                    <div className="offer-highlight-section">
                                        <div className="ctc-highlight">
                                            <span className="ctc-label">Annual CTC</span>
                                            <div className="ctc-value">
                                                <span className="ctc-currency">₹</span>
                                                <span className="ctc-amount">{offer.totalAnnualCTC?.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                        <div className="ctc-divider"></div>
                                        <div className="monthly-ctc">
                                            <span className="monthly-label">Monthly Gross</span>
                                            <span className="monthly-value">{formatCurrency(offer.monthlyGrossSalary)}</span>
                                        </div>
                                    </div>

                                    <div className="offer-key-details">
                                        <div className="key-detail-item">
                                            <span className="key-label">Basic + HRA</span>
                                            <span className="key-value">
                                                {formatCurrency(offer.basicSalary + offer.houseRentAllowance)}
                                            </span>
                                        </div>
                                        <div className="key-detail-item">
                                            <span className="key-label">Annual Bonus</span>
                                            <span className="key-value highlight">
                                                {formatCurrency(offer.annualBonus)}
                                            </span>
                                        </div>
                                        <div className="key-detail-item">
                                            <span className="key-label">Probation</span>
                                            <span className="key-value">{offer.probationPeriod} months</span>
                                        </div>
                                        <div className="key-detail-item">
                                            <span className="key-label">Location</span>
                                            <span className="key-value location">{offer.location}</span>
                                        </div>
                                    </div>

                                    {offer.specialRemarks && (
                                        <div className="offer-remarks-preview">
                                            <FaFileAlt className="remarks-icon" />
                                            <p className="remarks-text">{offer.specialRemarks}</p>
                                        </div>
                                    )}
                                </div>

                                {index < offers.length - 1 && <div className="offer-row-divider"></div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderAppointmentDetails = () => (
        <div className="tab-content">
            <div className="empty-state">
                <FaFileSignature className="empty-icon" />
                <h3>Appointment Details</h3>
                <p>No appointment scheduled</p>
            </div>
        </div>
    );

    const renderDocuments = () => {
        const offers = data?.data?.offers || [];
        const appointmentLetters = data?.data?.offers?.filter(offer => offer.isAppointmentLetter) || [];
        const hasResume = candidate?.resume;

        
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        };
        
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        };

        const fetchDocumentBlob = async (doc, type) => {
            try {
                let url = '';
                if (type === 'offer') {
                    url = `${apiPath.offerLetterPdf}/${doc._id}`;
                } else if (type === 'appointment') {
                    url = `${apiPath.appointmentLetterPdf}/${doc._id}`;
                }
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            } catch (error) {
                console.error('Error fetching document:', error);
                return null;
            }
        };

        const handlePreview = async (doc, type) => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            if (type === 'resume') {
                setPreviewUrl(candidate?.resume);
            } else {
                const blobUrl = await fetchDocumentBlob(doc, type);
                if (blobUrl) {
                    setPreviewUrl(blobUrl);
                }
            }
            setPreviewDocument(doc);
            setPreviewType(type);
        };

        const handleFullScreen = async (doc, type) => {
            if (type === 'resume') {
                window.open(candidate?.resume, '_blank');
            } else {
                // try {
                //     let url = '';
                //     if (type === 'offer') {
                //         url = `${apiPath.offerLetterPdf}/${doc._id}`;
                //     } else if (type === 'appointment') {
                //         url = `${apiPath.appointmentLetterPdf}/${doc._id}`;
                //     }
                    
                //     const response = await fetch(url, {
                //         headers: {
                //             'Authorization': `Bearer ${localStorage.getItem('token')}`
                //         }
                //     });
                //     const blob = await response.blob();
                //     const blobUrl = URL.createObjectURL(blob);
                //     window.open(blobUrl, '_blank');
                //     setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
                // } 
                  try {
                    if(type=='offer')
                    {
 const res = await apiGetPdf(`${apiPath.offerLetterPdf}/${doc._id}`);
                            const blob = res.data;
                            const pdfUrl = URL.createObjectURL(blob);
                            window.open(pdfUrl, "_blank");
                            setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
                    }
                    else if(type=='appointment')
                    {
                       const res = await apiGetPdf(`${apiPath.appointmentLetterPdf}/${doc._id}`);
            const blob = res.data;
            const pdfUrl = URL.createObjectURL(blob);
            window.open(pdfUrl, "_blank");
            setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);
                    }
                           
                        }
                catch (error) {
                    console.error('Error opening document:', error);
                    alert('Failed to open document');
                }
            }
        };

        const handleClosePreview = () => {
            if (previewUrl && previewType !== 'resume') {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewDocument(null);
            setPreviewType('');
            setPreviewUrl('');
        };

        return (
            <div className="tab-content-light documents-tab-content">
                <div className="documents-header-section">
                    <div className="header-left">
                        <h3 className="documents-list-title">Documents</h3>
                        <p className="documents-list-subtitle">
                            All candidate documents in one place
                        </p>
                    </div>
                    <div className="documents-stats">
                        <div className="stat-pill">
                            <span className="stat-count">{[
                                hasResume ? 1 : 0,
                                offers.length,
                                appointmentLetters.length
                            ].reduce((a, b) => a + b, 0)}</span>
                            <span className="stat-label">Total Documents</span>
                        </div>
                    </div>
                </div>

                <div className="documents-grid">
                    {/* Resume Card */}
                    {hasResume && (
                        <div className="document-card-modern">
                            <div className="document-card-header">
                                <div className="document-icon-wrapper resume">
                                    <FaFileAlt className="document-icon" />
                                </div>
                                <div className="document-type-badge">
                                    <span className="badge-dot"></span>
                                    Primary
                                </div>
                            </div>
                            
                            <div className="document-card-content">
                                <h4 className="document-title">Resume</h4>
                                <p className="document-description">
                                    {candidate.fullName}'s resume • {candidate.experience?.[0]?.jobTitle || 'Professional'}
                                </p>
                                
                                <div className="document-metadata">
                                    <div className="metadata-item">
                                        <FaClock className="metadata-icon" />
                                        <span>Updated {formatDate(candidate.updatedAt)}</span>
                                    </div>
                                    <div className="metadata-item">
                                        <span className="file-format-badge">
                                            {candidate.resume?.split('.').pop()?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="document-card-footer">
                                {/* <button 
                                    className="document-action-btn view"
                                    onClick={() => handlePreview(candidate.resume, 'resume')}
                                >
                                    <FaEye className="btn-icon" />
                                    <span>Preview</span>
                                </button> */}
                                <button 
                                    className="document-action-btn fullscreen"
                                    onClick={() => handleFullScreen(candidate.resume, 'resume')}
                                >
                                    <span className="fullscreen-icon">⛶</span>
                                    <span>Full Screen</span>
                                </button>
                            </div>
                            
                            <div className="document-card-accent resume-accent"></div>
                        </div>
                    )}

                    {/* Offer Letters Section */}
                    {offers.map((offer) => (
                        <div key={offer._id} className="document-card-modern offer">
                            <div className="document-card-header">
                                <div className="document-icon-wrapper offer">
                                    <FaHandshake className="document-icon" />
                                </div>
                                <div className={`document-status-badge ${offer.status}`}>
                                    <span className="status-dot"></span>
                                    {offer.status}
                                </div>
                            </div>
                            
                            <div className="document-card-content">
                                <h4 className="document-title">Offer Letter</h4>
                                <p className="document-description">
                                    {offer.position} • {formatCurrency(offer.totalAnnualCTC)}
                                </p>
                                
                                <div className="document-metadata">
                                    <div className="metadata-item">
                                        <FaCalendarAlt className="metadata-icon" />
                                        <span>Joining {formatDate(offer.joiningDate)}</span>
                                    </div>
                                    <div className="metadata-item">
                                        <FaUser className="metadata-icon" />
                                        <span>{offer.reportingManager}</span>
                                    </div>
                                    <div className="metadata-item">
                                        <span className="file-format-badge">PDF</span>
                                    </div>
                                </div>
                                
                                {offer.specialRemarks && (
                                    <div className="document-remark-tooltip">
                                        <span className="remark-dot">💬</span>
                                        <span className="remark-preview">
                                            {offer.specialRemarks.substring(0, 30)}...
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="document-card-footer">
                                {/* <button 
                                    className="document-action-btn view"
                                    onClick={() => handlePreview(offer, 'offer')}
                                >
                                    <FaEye className="btn-icon" />
                                    <span>Preview</span>
                                </button> */}
                                <button 
                                    className="document-action-btn fullscreen"
                                    onClick={() => handleFullScreen(offer, 'offer')}
                                >
                                    <span className="fullscreen-icon">⛶</span>
                                    <span>Full Screen</span>
                                </button>
                            </div>
                            
                            <div className="document-card-accent offer-accent"></div>
                        </div>
                    ))}

                    {/* Appointment Letters */}
                    {appointmentLetters.map((letter) => (
                        <div key={letter._id} className="document-card-modern appointment">
                            <div className="document-card-header">
                                <div className="document-icon-wrapper appointment">
                                    <FaFileSignature className="document-icon" />
                                </div>
                                <div className={`document-status-badge ${letter.status}`}>
                                    <span className="status-dot"></span>
                                    {letter.status}
                                </div>
                            </div>
                            
                            <div className="document-card-content">
                                <h4 className="document-title">Appointment Letter</h4>
                                <p className="document-description">
                                    {letter.position} • Confirmed
                                </p>
                                
                                <div className="document-metadata">
                                    <div className="metadata-item">
                                        <FaCalendarAlt className="metadata-icon" />
                                        <span>Created {formatDate(letter.createdAt)}</span>
                                    </div>
                                    <div className="metadata-item">
                                        <FaBuilding className="metadata-icon" />
                                        <span>{letter.department}</span>
                                    </div>
                                    <div className="metadata-item">
                                        <span className="file-format-badge">PDF</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="document-card-footer">
                                {/* <button 
                                    className="document-action-btn view"
                                    onClick={() => handlePreview(letter, 'appointment')}
                                >
                                    <FaEye className="btn-icon" />
                                    <span>Preview</span>
                                </button> */}
                                <button 
                                    className="document-action-btn fullscreen"
                                    onClick={() => handleFullScreen(letter, 'appointment')}
                                >
                                    <span className="fullscreen-icon">⛶</span>
                                    <span>Full Screen</span>
                                </button>
                            </div>
                            
                            <div className="document-card-accent appointment-accent"></div>
                        </div>
                    ))}
                </div>

                {/* Inline Document Preview Section */}
                {previewDocument && previewUrl && (
                    <div className="document-preview-section">
                        <div className="document-preview-header">
                            <div className="preview-title">
                                <div className="preview-icon">
                                    {previewType === 'resume' && <FaFileAlt />}
                                    {previewType === 'offer' && <FaHandshake />}
                                    {previewType === 'appointment' && <FaFileSignature />}
                                </div>
                                <div className="preview-info">
                                    <h3>
                                        {previewType === 'resume' && `${candidate?.fullName}'s Resume`}
                                        {previewType === 'offer' && `Offer Letter - ${previewDocument?.position}`}
                                        {previewType === 'appointment' && `Appointment Letter - ${previewDocument?.position}`}
                                    </h3>
                                    <p>
                                        {previewType === 'resume' && 'Primary application document'}
                                        {previewType === 'offer' && `Generated on ${formatDate(previewDocument?.createdAt)}`}
                                        {previewType === 'appointment' && `Confirmed on ${formatDate(previewDocument?.createdAt)}`}
                                    </p>
                                </div>
                            </div>
                            <div className="preview-actions">
                                <button 
                                    className="preview-action-btn fullscreen-btn"
                                    onClick={() => handleFullScreen(previewDocument, previewType)}
                                >
                                    <span className="fullscreen-icon">⛶</span>
                                    <span>Open in New Tab</span>
                                </button>
                                <button 
                                    className="preview-action-btn close-btn"
                                    onClick={handleClosePreview}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                        <div className="document-preview-body">
                            {previewUrl.endsWith('.pdf') || previewType !== 'resume' ? (
                                <iframe
                                    src={previewUrl}
                                    title={`${previewType} Preview`}
                                    className="document-preview-iframe"
                                />
                            ) : (
                                <div className="document-image-preview">
                                    <img
                                        src={previewUrl}
                                        alt={`${previewType} Preview`}
                                        className="document-preview-image"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderCandidateDetails = () => (
        <div className="tab-content">
            <div className="section-card">
                <h3 className="section-title">Professional Summary</h3>
                <p className="summary-text">
                    {candidate.summary || `Experienced professional with ${totalYears} years and ${totalMonths} months of experience in ${candidate.skills?.slice(0, 3).join(', ')}.`}
                </p>
            </div>

            <div className="section-card">
                <h3 className="section-title">Contact Information</h3>
                <div className="contact-grid">
                    <div className="contact-field">
                        <span className="contact-label">Email</span>
                        <span className="contact-value">{candidate.email}</span>
                    </div>
                    <div className="contact-field">
                        <span className="contact-label">Phone</span>
                        <span className="contact-value">{candidate.phone}</span>
                    </div>
                    <div className="contact-field">
                        <span className="contact-label">Location</span>
                        <span className="contact-value">{candidate.location || 'Not specified'}</span>
                    </div>
                    <div className="contact-field">
                        <span className="contact-label">Applied On</span>
                        <span className="contact-value">
                            {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">Technical Skills</h3>
                    <span className="section-count">{candidate.skills?.length} skills</span>
                </div>
                <div className="skills-grid">
                    {candidate.skills?.map((skill, index) => (
                        <div key={index} className="skill-item">
                            {skill}
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-card">
                <div className="section-header">
                    <h3 className="section-title">Work Experience</h3>
                    <span className="section-total">{totalYears} years {totalMonths} months total</span>
                </div>
                <div className="experience-timeline">
                    {candidate.experience?.map((exp, index) => {
                        const duration = calculateDuration(exp.from, exp.to);
                        return (
                            <div key={index} className="experience-item">
                                <div className="exp-timeline-marker"></div>
                                <div className="exp-content">
                                    <div className="exp-header">
                                        <h4 className="exp-company">{exp.companyName}</h4>
                                        <span className="exp-duration">
                                            {formatDate(exp.from)} - {formatDate(exp.to)} • {duration.years > 0 && `${duration.years}y `}{duration.months > 0 && `${duration.months}m`}
                                        </span>
                                    </div>
                                    <div className="exp-position">{exp.jobTitle}</div>
                                    {exp.responsibilities && (
                                        <p className="exp-description">{exp.responsibilities}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="section-card">
                <h3 className="section-title">Education</h3>
                <div className="education-list">
                    {candidate.education?.map((edu, index) => (
                        <div key={index} className="education-item">
                            <div className="edu-header">
                                <h4 className="edu-institution">{edu.institution}</h4>
                                <span className="edu-year">{edu.yearOfPassing}</span>
                            </div>
                            <div className="edu-details">
                                <span className="edu-qualification">{edu.qualification}</span>
                                {edu.cgpa && (
                                    <span className="edu-grade">CGPA: {edu.cgpa}/10</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-card">
                <h3 className="section-title">Additional Information</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Total Experience</span>
                        <span className="info-value">{totalYears} years {totalMonths} months</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Current Status</span>
                        <span className="status-badge active">Active Candidate</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Last Updated</span>
                        <span className="info-value">
                            {new Date(candidate.updatedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Job ID</span>
                        <span className="info-value code">{candidate.jobId || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="candidate-details-container">
            {/* Resume Modal */}
            {showResume && candidate?.resume && (
                <div className="resume-modal-overlay" onClick={() => setShowResume(false)}>
                    <div className="resume-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="resume-modal-header">
                            <h3>{candidate.fullName}'s Resume</h3>
                            <button className="modal-close-btn" onClick={() => setShowResume(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="resume-modal-body">
                            {candidate.resume.endsWith('.pdf') ? (
                                <iframe
                                    src={candidate.resume}
                                    title={`${candidate.fullName}'s Resume`}
                                    className="resume-iframe"
                                />
                            ) : (
                                <div className="resume-image-container">
                                    <img
                                        src={candidate.resume}
                                        alt={`${candidate.fullName}'s Resume`}
                                        className="resume-image"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="candidate-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back to Candidates
                </button>
                <div className="header-actions">
                    <button className="action-btn secondary" onClick={viewResume}>
                        <FaEye /> View Resume
                    </button>
                    <button className="action-btn secondary" onClick={downloadResume}>
                        <FaDownload /> Download Resume
                    </button>
                    <button
                        onClick={() => navigate(`/hr/interviews/schedule/${id}`)}
                        className="action-btn primary"
                    >
                        <FaCalendarPlus /> Schedule Interview
                    </button>
                </div>
            </div>

            {/* Candidate Profile */}
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">
                        {candidate.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="profile-info">
                        <h1 className="candidate-name">{candidate.fullName}</h1>
                        <p className="candidate-title">
                            {candidate.experience?.[0]?.jobTitle || 'Professional'} • {totalYears} years experience
                        </p>
                        <div className="profile-meta">
                            <span className="meta-item">
                                <FaEnvelope /> {candidate.email}
                            </span>
                            <span className="meta-item">
                                <FaPhone /> {candidate.phone}
                            </span>
                            <span className="meta-item">
                                <FaClock /> Applied {new Date(candidate.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <FaUser /> Candidate Details
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('interview')}
                    >
                        <FaHistory /> Interview Details
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'offer' ? 'active' : ''}`}
                        onClick={() => setActiveTab('offer')}
                    >
                        <FaHandshake /> Offer
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        <FaFileAlt /> Documents
                    </button>
                </div>

                <div className="tabs-content">
                    {activeTab === 'details' && renderCandidateDetails()}
                    {activeTab === 'interview' && renderInterviewDetails()}
                    {activeTab === 'offer' && renderOfferDetails()}
                    {activeTab === 'documents' && renderDocuments()}
                </div>
            </div>
        </div>
    );
}