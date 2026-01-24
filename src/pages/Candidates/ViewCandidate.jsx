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
    FaHistory
} from 'react-icons/fa';
import { MdWork, MdSchool, MdTimeline } from 'react-icons/md';
import apiPath from '../../api/apiPath';
import { apiGet } from '../../api/apiFetch';
import './ViewCandidate.css';

export default function ViewCandidate() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showResume, setShowResume] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

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

    const renderInterviewDetails = () => (
        <div className="tab-content">
            <div className="empty-state">
                <FaHistory className="empty-icon" />
                <h3>Interview History</h3>
                <p>No interviews scheduled yet</p>
                <button className="schedule-btn" onClick={() => navigate(`/hr/interview/schedule/${id}`)}>
                    <FaCalendarPlus /> Schedule First Interview
                </button>
            </div>
        </div>
    );

    const renderOfferDetails = () => (
        <div className="tab-content">
            <div className="empty-state">
                <FaHandshake className="empty-icon" />
                <h3>Offer Details</h3>
                <p>No offer has been made yet</p>
            </div>
        </div>
    );

    const renderAppointmentDetails = () => (
        <div className="tab-content">
            <div className="empty-state">
                <FaFileSignature className="empty-icon" />
                <h3>Appointment Details</h3>
                <p>No appointment scheduled</p>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="tab-content">
            <div className="documents-section">
                <div className="document-card">
                    <FaFileAlt className="document-icon" />
                    <div className="document-info">
                        <h4>Resume</h4>
                        <p>Primary application document</p>
                    </div>
                    <div className="document-actions">
                        <button className="document-btn view" onClick={viewResume}>
                            <FaEye /> View
                        </button>
                        <button className="document-btn download" onClick={downloadResume}>
                            <FaDownload /> Download
                        </button>
                    </div>
                </div>
                <div className="document-card">
                    <FaFileAlt className="document-icon" />
                    <div className="document-info">
                        <h4>Cover Letter</h4>
                        <p>Not uploaded</p>
                    </div>
                    <button className="document-btn upload">Upload</button>
                </div>
                <div className="document-card">
                    <FaFileAlt className="document-icon" />
                    <div className="document-info">
                        <h4>Certifications</h4>
                        <p>No certifications uploaded</p>
                    </div>
                    <button className="document-btn upload">Upload</button>
                </div>
            </div>
        </div>
    );

    const renderCandidateDetails = () => (
        <div className="tab-content">
            {/* Professional Summary */}
            <div className="section-card">
                <h3 className="section-title">Professional Summary</h3>
                <p className="summary-text">
                    {candidate.summary || `Experienced professional with ${totalYears} years and ${totalMonths} months of experience in ${candidate.skills?.slice(0, 3).join(', ')}.`}
                </p>
            </div>

            {/* Contact Information */}
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

            {/* Skills */}
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

            {/* Experience */}
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

            {/* Education */}
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

            {/* Additional Information */}
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
                                    className="resume-frame"
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
                        className={`tab-btn ${activeTab === 'appointment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointment')}
                    >
                        <FaFileSignature /> Appointment
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
                    {activeTab === 'appointment' && renderAppointmentDetails()}
                    {activeTab === 'documents' && renderDocuments()}
                </div>
            </div>
        </div>
    );
}