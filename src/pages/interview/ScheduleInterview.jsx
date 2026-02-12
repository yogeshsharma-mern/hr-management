import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '../../api/apiFetch';
import apiPath from '../../api/apiPath';
import toast from 'react-hot-toast';
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

const interviewRounds = [
  { value: 'HR', label: 'HR Round', icon: '👥', color: '#3b82f6' },
  // { value: 'Technical', label: 'Technical Round', icon: '💻', color: '#06b6d4' },
  // { value: 'Managerial', label: 'Managerial Round', icon: '👨‍💼', color: '#8b5cf6' },
  //   { value: 'Final', label: 'Final Round', icon: '🎯', color: '#10b981' },
  //   { value: 'Screening', label: 'Screening', icon: '🔍', color: '#f59e0b' }
];

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
  //   { 
  //     value: 'Phone', 
  //     label: 'Phone Call', 
  //     description: 'Conduct phone interview',
  //     icon: <FaPhone />,
  //     color: '#f59e0b'
  //   }
];

export default function ScheduleInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState('Online');

  // Fetch candidate details
  const { data: candidateData, isLoading: candidateLoading } = useQuery({
    queryKey: ['candidateForInterview', id],
    queryFn: () => apiGet(`${apiPath.candidateDetails}/${id}`),
    enabled: !!id,
  });

  const candidate = candidateData?.data;
  // console.log("candidate", candidate);

  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      interviewerName: '',
      interviewDate: '',
      round: 'HR',
      mode: 'Online',
      meetingLink: '',
      location: '',
      remarks: '',
      startTime: '10:00',
      duration: '60',
      sendEmailNotification: true
    }
  });
  const interviewDate = watch('interviewDate');
  const interviewerName= watch("interviewerName");
  // console.log("interviewername",interviewerName);
  // console.log("innterviewDate",interviewDate);
  // const watchMode = watch('mode');

  // Watch mode to conditionally show fields
  const watchMode = watch('mode');

  const scheduleMutation = useMutation({
    mutationFn: (data) => apiPost(`${apiPath.scheduleInterview}/${id}`, data),
    onSuccess: (response) => {
      toast.success(response?.message || 'Interview scheduled successfully!');
      navigate(`/hr/interviews`);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to schedule interview');
    }
  });
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  };
  const onSubmit = (data) => {
    console.log("data",data);
    if (isPastDateTime(data.interviewDate, data.startTime)) {
      toast.error('Interview date & time must be in the future');
      return;
    }

    const formattedData = {
      interviewerName: data.interviewerName,
      interviewDate: data.interviewDate,
      round: data.round,
      mode: data.mode,
      meetingLink: data.meetingLink || '',
      location: data.location || '',
      remarks: data.remarks || '',
      startTime: data.startTime,
      duration: parseInt(data.duration)
    };

    scheduleMutation.mutate(formattedData);
  };


  if (candidateLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Loading candidate details</h3>
          <p>Preparing interview schedule form...</p>
        </div>
      </div>
    );
  }


  const isPastDateTime = (date, time) => {
    console.log("date,time",date,time);
    if (!date || !time) return false;

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    return selectedDateTime < now;
  };


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
              <span className="title-gradient">Schedule Interview</span>
            </h1>
            <p className="page-subtitle">Fill in the interview details below</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* TOP: Compact Candidate Profile */}
        <div className="candidate-profile-top">
          <div className="profile-card">
            <div className="profile-main-info">
              <div className="profile-avatar-section">
                <div className="avatar-circle">
                  {candidate?.candidate?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="candidate-badge">
                  <div className="badge-dot active"></div>
                  <span>Available for Interview</span>
                </div>
              </div>

              <div className="profile-details-section">
                <div className="profile-header-info">
                  <h2 className="candidate-name">{candidate?.candidate?.fullName.toUpperCase()}</h2>
                  <div className="candidate-meta-row">
                    <div className="meta-item">
                      <MdWork />
                      <span>Software Developer</span>
                    </div>
                    <div className="meta-item">
                      <MdWork />
                      <span>{candidate?.candidate?.totalExperienceInYears || 0} years experience</span>
                    </div>
                  </div>
                </div>

                <div className="profile-contact-info">
                  <div className="contact-item">
                    <FaEnvelope />
                    <span>{candidate?.candidate?.email}</span>
                  </div>
                  <div className="contact-item">
                    <FaPhone />
                    <span>{candidate?.candidate?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="profile-skills-section">
                <h3 className="skills-title">Top Skills</h3>
                <div className="skills-grid">
                  {candidate?.candidate?.skills?.slice(0, 4).map((skill, index) => (
                    <div key={index} className="skill-badge">
                      {skill}
                    </div>
                  ))}
                  {candidate?.candidate?.skills?.length > 4 && (
                    <div className="skill-badge more">
                      +{candidate?.candidate?.skills?.length - 4} more
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-footer-info">
              <div className="education-info">
                <MdSchool />
                <div>
                  <div className="edu-degree">
                    {candidate?.candidate?.education?.[0]?.qualification || 'Education not specified'}
                  </div>
                  <div className="edu-school">
                    {candidate?.candidate?.education?.[0]?.institution || ''}
                  </div>
                </div>
              </div>
              <div className="candidate-id">
                Candidate ID: <strong>#{id}</strong>
              </div>
            </div>
          </div>
        </div>

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

              {/* Interview Round */}
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
                </div>
              </div>

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
                      rules={{ required: watchMode === 'In-Person' ? 'Location is required' : false }}
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
                      Schedule Interview
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