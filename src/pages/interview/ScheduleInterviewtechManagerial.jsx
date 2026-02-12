import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut } from '../../api/apiFetch';
import apiPath from '../../api/apiPath';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaUser,
    FaVideo,
    FaMapMarkerAlt,
    FaStickyNote,
    FaArrowLeft,
    FaCheck,
    FaClock,
    FaLink,
    FaPhone,
    FaEnvelope,
    FaBriefcase
} from 'react-icons/fa';
import {
    MdWork,
    MdSchool,
    MdAccessTime,
    MdLocationOn
} from 'react-icons/md';
import './ScheduleInterview.css';

// Define interview rounds based on previous round
const getInterviewRounds = (previousRound, previousStatus, previousResult) => {
    // If previous round is HR and it was completed & passed, show Technical
    if (previousRound === "HR" && previousStatus === "Completed" && previousResult === "Passed") {
        return [
            { value: 'Technical', label: 'Technical Round', icon: '💻', color: '#06b6d4' },
        ];
    }
    // If previous round is Technical and it was completed & passed, show Managerial
    else if (previousRound === "Technical" && previousStatus === "Completed" && previousResult === "Passed") {
        return [
            { value: 'Managerial', label: 'Managerial Round', icon: '👨‍💼', color: '#8b5cf6' },
        ];
    }
    // If no previous round data or not completed, default to Technical (but shouldn't happen in normal flow)
    return [
        { value: 'Technical', label: 'Technical Round', icon: '💻', color: '#06b6d4' },
    ];
};

const interviewModes = [
    {
        value: 'Online',
        label: 'Video Call',
        description: 'Schedule a video interview',
        icon: <FaVideo />,
        color: '#3b82f6'
    },
    {
        value: 'Offline',
        label: 'In-Person',
        description: 'Meet at office location',
        icon: <FaMapMarkerAlt />,
        color: '#10b981'
    },
];

export default function ScheduleInterview() {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState('Online');
    const [interviewRounds, setInterviewRounds] = useState([]);
    const [defaultRound, setDefaultRound] = useState('');


    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const isPastDateTime = (date, time) => {
        if (!date || !time) return false;

        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();

        return selectedDateTime < now;
    };


    console.log("data", state?.data);

    // Fetch candidate details
    const { data: candidateData, isLoading: candidateLoading } = useQuery({
        queryKey: ['candidateForInterview', id],
        queryFn: () => apiGet(`${apiPath.candidateDetails}/${id}`),
        enabled: !!id,
    });

    const candidate = candidateData?.data;

    // Determine which round to show based on previous data
    useEffect(() => {
        if (!state?.data?.round) return;

        const currentRound = state.data.round;

        const roundMap = {
            HR: {
                value: "HR",
                label: "HR Round",
                icon: "🧑‍💼",
                color: "#10b981",
            },
            Technical: {
                value: "Technical",
                label: "Technical Round",
                icon: "💻",
                color: "#06b6d4",
            },
            Managerial: {
                value: "Managerial",
                label: "Managerial Round",
                icon: "👨‍💼",
                color: "#8b5cf6",
            },
        };

        const roundConfig = roundMap[currentRound];

        if (roundConfig) {
            setInterviewRounds([roundConfig]);
            setDefaultRound(roundConfig.value);
        }
    }, [state?.data]);


    const { control, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        defaultValues: {
            interviewerName: '',
            interviewDate: '',
            round: defaultRound || 'Technical', // Will be updated in useEffect
            mode: 'Online',
            meetingLink: '',
            location: '',
            remarks: '',
            startTime: '10:00',
            duration: '60',
            sendEmailNotification: true
        }
    });

    // Update form value when defaultRound changes
    useEffect(() => {
        if (defaultRound) {
            setValue('round', defaultRound);
        }
    }, [defaultRound, setValue]);

    // Watch mode to conditionally show fields
    const watchMode = watch('mode');
    const interviewDate = watch('interviewDate');
    const startTime = watch('startTime');

    const scheduleMutation = useMutation({
        mutationFn: (data) => apiPut(`${apiPath.updateScheduleInterview}/${id}`, data),
        onSuccess: (response) => {
            toast.success(response?.message || 'Interview scheduled successfully!');
            navigate(`/hr/interviews`);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to schedule interview');
        }
    });

    const onSubmit = (data) => {
        if (isPastDateTime(data.interviewDate, data.startTime)) {
            toast.error('Interview date & time must be in the future');
            return;
        }
        const formattedData = {
            interviewerName: data.interviewerName,
            interviewDate: data.interviewDate,
            // round: data.round, // Include round in data
            mode: data.mode,
            meetingLink: data.meetingLink || '',
            location: data.location || '',
            remarks: data.remarks || '',
            startTime: data.startTime,
            duration: parseInt(data.duration)
        };

        console.log('Submitting interview data:', formattedData);
        scheduleMutation.mutate(formattedData);
    };

    // Show info about previous round
    const getRoundInfo = () => {
        if (!state?.data) return null;

        const { round, status, result } = state.data;

        console.log("currentRound", round);
        console.log("currentStatus", status);
        console.log("currentResult", result);

        return (
            <div className="info-banner info">
                <div className="info-content">
                    <MdWork className="info-icon" />
                    <div>
                        <h4>Current Round: {round}</h4>
                        <p>
                            Status: <strong>{status}</strong>
                            {result && (
                                <>
                                    {" "} | Result: <strong>{result}</strong>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        );
    };


    // Add CSS for info banner
    const infoBannerStyle = `
        .info-banner {
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            border-left: 4px solid;
            color: #3a79de;
        }
        
        .info-banner.success {
            background-color: #f0fdf4;
            border-left-color: #10b981;
            color: #065f46;
        }
        
        .info-banner.warning {
            background-color: #fffbeb;
            border-left-color: #f59e0b;
            color: #92400e;
        }
        
        .info-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .info-icon {
            font-size: 20px;
            margin-top: 2px;
        }
        
        .info-content h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .info-content p {
            margin: 0;
            font-size: 14px;
            opacity: 0.9;
        }
    `;

    return (
        <div className="schedule-page">
            {/* Header */}
            <div className="page-header">
                <div className="container">
                    <button
                        className="btn-back"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        <span>Back</span>
                    </button>
                    <div className="header-content">
                        <h1 className="page-title">
                            <span className="title-gradient">Schedule Next Interview Round</span>
                        </h1>
                        <p className="page-subtitle">Fill in the interview details below</p>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Previous Round Info */}
                {getRoundInfo()}

                {/* Add style for info banner */}
                <style>{infoBannerStyle}</style>

                {/* BOTTOM: Interview Form */}
                <div className="interview-form-main">
                    <div className="form-card">
                        <div className="form-header">
                            <div className="header-icon">
                                <FaCalendarAlt />
                            </div>
                            <div>
                                <h2>Interview Details</h2>
                                <p>Set up interview date, time, mode, and other required information</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="interview-form">
                            {/* Interviewer & Date */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3>Basic Information</h3>
                                    <div className="section-divider"></div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaUser />
                                            <span>Interviewer Name *</span>
                                        </label>
                                        <Controller
                                            name="interviewerName"
                                            control={control}
                                            rules={{ required: 'Interviewer name is required' }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`form-input ${errors.interviewerName ? 'error' : ''}`}
                                                    placeholder="Enter interviewer's full name"
                                                />
                                            )}
                                        />
                                        {errors.interviewerName && (
                                            <span className="error-message">{errors.interviewerName.message}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaCalendarAlt />
                                            <span>Interview Date *</span>
                                        </label>
                                        <Controller
                                            name="interviewDate"
                                            control={control}
                                            rules={{
                                                required: 'Interview date is required',
                                                validate: (value) =>
                                                    value >= getTodayDate() || 'Past dates are not allowed'
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="date"
                                                    min={getTodayDate()}   // 👈 blocks past dates
                                                    className={`form-input ${errors.interviewDate ? 'error' : ''}`}
                                                />
                                            )}
                                        />

                                        {errors.interviewDate && (
                                            <span className="error-message">{errors.interviewDate.message}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">
                                            <MdAccessTime />
                                            <span>Start Time *</span>
                                        </label>
                                        <Controller
                                            name="startTime"
                                            control={control}
                                            rules={{
                                                required: 'Start time is required',
                                                validate: (value) => {
                                                    if (!interviewDate) return true;

                                                    if (isPastDateTime(interviewDate, value)) {
                                                        return 'Start time cannot be in the past';
                                                    }

                                                    return true;
                                                }
                                            }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="time"
                                                    className={`form-input ${errors.startTime ? 'error' : ''}`}
                                                />
                                            )}
                                        />

                                        {errors.startTime && (
                                            <span className="error-message">{errors.startTime.message}</span>
                                        )}

                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaClock />
                                            <span>Duration *</span>
                                        </label>
                                        <Controller
                                            name="duration"
                                            control={control}
                                            rules={{
                                                required: 'Duration is required',
                                                min: { value: 15, message: 'Minimum 15 minutes' },
                                                max: { value: 480, message: 'Maximum 8 hours' }
                                            }}
                                            render={({ field }) => (
                                                <select
                                                    {...field}
                                                    className={`form-input ${errors.duration ? 'error' : ''}`}
                                                >
                                                    <option value="30">30 minutes</option>
                                                    <option value="45">45 minutes</option>
                                                    <option value="60">60 minutes</option>
                                                    <option value="90">90 minutes</option>
                                                    <option value="120">120 minutes</option>
                                                </select>
                                            )}
                                        />
                                        {errors.duration && (
                                            <span className="error-message">{errors.duration.message}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Interview Round - Conditionally shown based on previous round */}
                            {interviewRounds.length > 0 && (
                                <div className="form-section">
                                    <div className="section-header">
                                        <h3>Interview Round</h3>
                                        <div className="section-divider"></div>
                                    </div>
                                    <div className="form-group">
                                        <Controller
                                            name="round"
                                            control={control}
                                            rules={{ required: 'Interview round is required' }}
                                            render={({ field }) => (
                                                <div className="round-selector">
                                                    {interviewRounds.map((round) => (
                                                        <button
                                                            type="button"
                                                            key={round.value}
                                                            className={`round-option ${field.value === round.value ? 'selected' : ''}`}
                                                            onClick={() => field.onChange(round.value)}
                                                            style={{ '--round-color': round.color }}
                                                        >
                                                            <span className="round-icon">{round.icon}</span>
                                                            <span className="round-label">{round.label}</span>
                                                            {field.value === round.value && (
                                                                <span className="round-check">
                                                                    <FaCheck />
                                                                </span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                        {errors.round && (
                                            <span className="error-message">{errors.round.message}</span>
                                        )}
                                        <div className="round-info-note mt-4">
                                            <p>
                                                <strong>Note:</strong> This round is automatically determined based on the previous round's result.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interview Mode */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3>Interview Mode</h3>
                                    <div className="section-divider"></div>
                                </div>
                                <div className="form-group">
                                    <Controller
                                        name="mode"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="mode-selector">
                                                {interviewModes.map((mode) => (
                                                    <button
                                                        type="button"
                                                        key={mode.value}
                                                        className={`mode-card ${field.value === mode.value ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            field.onChange(mode.value);
                                                            setSelectedMode(mode.value);
                                                        }}
                                                        style={{ '--mode-color': mode.color }}
                                                    >
                                                        <div className="mode-icon" style={{ color: mode.color }}>
                                                            {mode.icon}
                                                        </div>
                                                        <div className="mode-content">
                                                            <h4>{mode.label}</h4>
                                                            <p>{mode.description}</p>
                                                        </div>
                                                        {field.value === mode.value && (
                                                            <div className="mode-selected">
                                                                <FaCheck />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </div>

                                {/* Conditional Fields */}
                                {watchMode === 'Online' && (
                                    <div className="form-group">
                                        <label className="form-label">
                                            <FaLink />
                                            <span>Meeting Link *</span>
                                        </label>
                                        <Controller
                                            name="meetingLink"
                                            control={control}
                                            rules={{ required: watchMode === 'Online' ? 'Meeting link is required' : false }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="url"
                                                    className={`form-input ${errors.meetingLink ? 'error' : ''}`}
                                                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                                                />
                                            )}
                                        />
                                        {errors.meetingLink && (
                                            <span className="error-message">{errors.meetingLink.message}</span>
                                        )}
                                    </div>
                                )}

                                {watchMode === 'Offline' && (
                                    <div className="form-group">
                                        <label className="form-label">
                                            <MdLocationOn />
                                            <span>Location *</span>
                                        </label>
                                        <Controller
                                            name="location"
                                            control={control}
                                            rules={{ required: watchMode === 'Offline' ? 'Location is required' : false }}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`form-input ${errors.location ? 'error' : ''}`}
                                                    placeholder="Enter office address or meeting room"
                                                />
                                            )}
                                        />
                                        {errors.location && (
                                            <span className="error-message">{errors.location.message}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Additional Remarks */}
                            <div className="form-section">
                                <div className="section-header">
                                    <h3>Additional Information</h3>
                                    <div className="section-divider"></div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">
                                        <FaStickyNote />
                                        <span>Remarks & Notes</span>
                                    </label>
                                    <Controller
                                        name="remarks"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="form-textarea"
                                                placeholder="Add any special instructions, topics to cover, or notes for the interviewer..."
                                                rows="4"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="form-group">
                                    <Controller
                                        name="sendEmailNotification"
                                        control={control}
                                        render={({ field }) => (
                                            <label className="checkbox-field">
                                                <input
                                                    type="checkbox"
                                                    {...field}
                                                    checked={field.value}
                                                    className="checkbox-input"
                                                />
                                                <span className="checkbox-custom"></span>
                                                <span className="checkbox-label">
                                                    Send email notification to candidate with interview details
                                                </span>
                                            </label>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate(-1)}
                                    disabled={scheduleMutation.isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => reset()}
                                    disabled={scheduleMutation.isLoading}
                                >
                                    Clear Form
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={scheduleMutation.isLoading}
                                >
                                    {scheduleMutation.isLoading ? (
                                        <>
                                            <div className="btn-spinner"></div>
                                            Scheduling...
                                        </>
                                    ) : (
                                        <>
                                            <FaCheck />
                                            Schedule {defaultRound === 'Technical' ? 'Technical' : 'Managerial'} Round
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}