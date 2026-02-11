import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiGet } from "../../api/apiFetch";
import apiPath from "../../api/apiPath";
import AddCandidateValidation from "../../validation/addCandidate.validation";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import {
    FaUpload,
    FaFilePdf,
    FaFileWord,
    FaTimes,
    FaCloudUploadAlt
} from "react-icons/fa";
import "./AddCandidate.css";

const steps = ["Personal Information", "Education Details", "Work Experience", "Resume Upload"];
const commonSkills = [
    "JavaScript", "React", "Node.js", "Python", "Java", "HTML/CSS", "SQL",
    "AWS", "Docker", "Git", "TypeScript", "Angular", "Vue.js", "MongoDB",
    "PostgreSQL", "Redis", "Kubernetes", "CI/CD", "Agile/Scrum"
];

const AddCandidate = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const validation = AddCandidateValidation();

    const { data: positionData } = useQuery({
        queryKey: ["positions"],
        queryFn: () => apiGet(apiPath.JobOpenings),
    });

    const positions = positionData?.data?.map((job) => ({
        value: job._id,
        label: job.title,
    })) || [];

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        reset,
        watch,
        setValue
    } = useForm({
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            personalInfo: {
                fullName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                gender: "",
                jobId: "",
                address: "",
            },
            education: [
                {
                    qualification: "",
                    institution: "",
                    yearOfPassing: "",
                    percentage: "",
                },
            ],
            experience: [
                {
                    company: "",
                    jobTitle: "",
                    fromDate: "",
                    toDate: "",
                    responsibilities: "",
                    currentlyWorking: false,
                },
            ],
            skills: [],
            totalExperience: "",
        },
    });
    console.log("errors", errors);
    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({ control, name: "education" });

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({ control, name: "experience" });

    const handleFileUpload = async (file) => {
        if (!file) return null;

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];

        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a PDF, DOC, DOCX, or TXT file');
            return null;
        }

        if (file.size > maxSize) {
            toast.error('File size must be less than 5MB');
            return null;
        }

        return file;
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const validFile = await handleFileUpload(file);
        if (validFile) {
            setResumeFile(validFile);
            setUploadProgress(0);

            // Simulate upload progress (UI only)
            const interval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 100);
        }
    };

    const removeFile = () => {
        setResumeFile(null);
        setUploadProgress(0);
    };

    // First, update your apiFetch.js to handle FormData
    // Add this function to your apiFetch.js file:
    /*
    export const apiPostFormData = async (url, formData) => {
        try {
            const token = localStorage.getItem('token') || '';
            const headers = {
                'Authorization': `Bearer ${token}`
                // Don't set Content-Type for FormData - browser will set it with boundary
            };

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API FormData POST Error:', error);
            throw error;
        }
    };
    */

    // If you don't want to modify apiFetch.js, use this custom mutation function
    const mutation = useMutation({
        mutationFn: (formData) =>
            apiPost(apiPath.AddCandidates, formData),

        onSuccess: (data) => {
            queryClient.invalidateQueries(["candidates"]);
            toast.success(data?.message || "Candidate added successfully!");
            handleReset();
            navigate(-1);
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to add candidate"
            );
        },
    });


    const onSubmit = async (data) => {
        if (!resumeFile) {
            toast.error('Please upload a resume file');
            return;
        }

        const formatDate = (date) => {
            if (!date) return "";
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        // Create FormData
        const formData = new FormData();

        // Add all form fields as per cURL structure
        formData.append('fullName', data.personalInfo.fullName);
        formData.append('email', data.personalInfo.email);
        formData.append('phone', data.personalInfo.phone);
        formData.append('jobId', data.personalInfo.jobId);

        // Add optional fields if they exist
        if (data.personalInfo.dateOfBirth) {
            formData.append('dateOfBirth', formatDate(data.personalInfo.dateOfBirth));
        }
        if (data.personalInfo.gender) {
            formData.append('gender', data.personalInfo.gender);
        }
        if (data.personalInfo.address) {
            formData.append('address', data.personalInfo.address);
        }

        formData.append('totalExperienceInYears', parseFloat(data.totalExperience) || 0);

        // Add arrays as JSON strings
        formData.append('education', JSON.stringify(data.education.map(edu => ({
            institution: edu.institution,
            qualification: edu.qualification || "",
            yearOfPassing: parseInt(edu.yearOfPassing) || 0,
            cgpa: parseFloat(edu.percentage) || 0,
        }))));

        formData.append('experience', JSON.stringify(data.experience.map(exp => ({
            companyName: exp.company,
            jobTitle: exp.jobTitle,
            from: exp.fromDate ? formatDate(exp.fromDate) : null,
            to: exp.toDate ? formatDate(exp.toDate) : null,
            responsibilities: exp.responsibilities,
        }))));

        formData.append('skills', JSON.stringify(data.skills || []));

        // Add resume file
        formData.append('resume', resumeFile);

        // Use mutation
        mutation.mutate(formData);
    };

    const handleNext = async () => {
        let isValid = false;
        if (activeStep === 0) {
            isValid = await trigger("personalInfo");
        } else if (activeStep === 1) {
            isValid = await trigger("education");
        } else if (activeStep === 2) {
            isValid = await trigger(["experience", "skills", "totalExperience"]);
        } else if (activeStep === 3) {
            // For resume step, just check if file exists
            isValid = !!resumeFile;
            if (!isValid) {
                toast.error('Please upload a resume file');
            }
        }

        if (isValid) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        reset();
        setResumeFile(null);
        setUploadProgress(0);
    };

    // Custom styles for react-select to match our UI
    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: '42px',
            border: '1.5px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
            borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
            backgroundColor: 'white',
            '&:hover': {
                borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1'
            }
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '2px 12px'
        }),
        input: (base) => ({
            ...base,
            margin: '0',
            padding: '0'
        }),
        placeholder: (base) => ({
            ...base,
            color: '#94a3b8',
            fontSize: '14px'
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1e293b',
            fontSize: '14px'
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: '#dbeafe',
            borderRadius: '16px'
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#1e40af',
            fontSize: '12px',
            fontWeight: '500',
            padding: '2px 6px'
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: '#1e40af',
            borderRadius: '0 16px 16px 0',
            '&:hover': {
                backgroundColor: '#bfdbfe',
                color: '#1e40af'
            }
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            zIndex: 9999
        }),
        option: (base, state) => ({
            ...base,
            fontSize: '14px',
            backgroundColor: state.isSelected ? '#dbeafe' : state.isFocused ? '#f1f5f9' : 'white',
            color: state.isSelected ? '#1e40af' : '#1e293b',
            '&:active': {
                backgroundColor: '#dbeafe'
            }
        })
    };

    const renderPersonalInfo = () => (
        <div className="step-container">
            <h2 className="step-title">Personal Information</h2>
            <p className="step-subtitle">DigiRoad collects this information to better understand and serve candidates.</p>

            <div className="section">
                <h3 className="section-title">Basic Information</h3>
                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">
                            Name
                            <Controller
                                name="personalInfo.fullName"
                                control={control}
                                rules={validation.personalInfo.fullName}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className={`form-input ${errors.personalInfo?.fullName ? 'error' : ''}`}
                                        placeholder="Enter full name"
                                    />
                                )}
                            />
                            {errors.personalInfo?.fullName && (
                                <span className="error-message">{errors.personalInfo.fullName.message}</span>
                            )}
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Email
                            <Controller
                                name="personalInfo.email"
                                control={control}
                                rules={validation.personalInfo.email}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="email"
                                        className={`form-input ${errors.personalInfo?.email ? 'error' : ''}`}
                                        placeholder="Enter email address"
                                    />
                                )}
                            />
                            {errors.personalInfo?.email && (
                                <span className="error-message">{errors.personalInfo.email.message}</span>
                            )}
                        </label>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3 className="section-title">Contact Information</h3>
                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">
                            Phone Number
                            <Controller
                                name="personalInfo.phone"
                                control={control}
                                rules={validation.personalInfo.phone}
                                render={({ field }) => (
                                    <div className="phone-input-container">
                                        <PhoneInput
                                            country={'in'}
                                            value={field.value}
                                            onChange={(phone) => field.onChange(phone)}
                                            inputProps={{
                                                name: 'phone',
                                                required: true,
                                                autoFocus: false
                                            }}
                                            containerClass={`phone-container ${errors.personalInfo?.phone ? 'error' : ''}`}
                                            inputClass="phone-input"
                                            buttonClass="phone-button"
                                            dropdownClass="phone-dropdown"
                                        />
                                        {errors.personalInfo?.phone && (
                                            <span className="error-message">{errors.personalInfo.phone.message}</span>
                                        )}
                                    </div>
                                )}
                            />
                        </label>
                    </div>

                    <div className="form-group">
                        {/* <label className="form-label">
                            Date of Birth
                            <Controller
                                name="personalInfo.dateOfBirth"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="date"
                                        className={`form-input ${errors.personalInfo?.dateOfBirth ? 'error' : ''}`}
                                    />
                                )}
                            />
                            {errors.personalInfo?.dateOfBirth && (
                                <span className="error-message">{errors.personalInfo.dateOfBirth.message}</span>
                            )}
                        </label> */}
                    </div>
                </div>
            </div>
            

            <div className="section">
                <h3 className="section-title">Professional Details</h3>
                <div className="grid-2">
                    {/* <div className="form-group">
                        <label className="form-label">
                            Gender
                            <Controller
                                name="personalInfo.gender"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className={`form-input ${errors.personalInfo?.gender ? 'error' : ''}`}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                )}
                            />
                            {errors.personalInfo?.gender && (
                                <span className="error-message">{errors.personalInfo.gender.message}</span>
                            )}
                        </label>
                    </div> */}

                    <div className="form-group">
                        <label className="form-label">
                            Position Applied
                            <Controller
                                name="personalInfo.jobId"
                                control={control}
                                rules={validation.personalInfo.position}
                                render={({ field }) => (
                                    <Select
                                        options={positions}
                                        placeholder="Select Position"
                                        value={positions.find(opt => opt.value === field.value)}
                                        onChange={(selected) => field.onChange(selected?.value)}
                                        styles={customSelectStyles}
                                        isClearable
                                        className={`custom-select ${errors.personalInfo?.jobId ? 'error' : ''}`}
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                            {errors.personalInfo?.jobId && (
                                <span className="error-message">{errors.personalInfo.jobId.message}</span>
                            )}
                        </label>
                    </div>
                     <div className="form-group">
                        <label className="form-label">
                            Address
                            <Controller
                                name="personalInfo.address"
                                control={control}
                                rules={validation.personalInfo.address}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="textarea"
                                        className={`form-input ${errors.personalInfo?.address ? 'error' : ''}`}
                                        placeholder="Enter your address"
                                    />
                                )}
                            />
                            {errors.personalInfo?.address && (
                                <span className="error-message">{errors.personalInfo.address.message}</span>
                            )}
                        </label>
                    </div>
                </div>
            </div>

            {/* <div className="section">
                <h3 className="section-title">Address</h3>
                <div className="form-group">
                    <label className="form-label">
                        Current Address
                        <Controller
                            name="personalInfo.address"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className={`form-input textarea ${errors.personalInfo?.address ? 'error' : ''}`}
                                    placeholder="Enter current address"
                                    rows="3"
                                />
                            )}
                        />
                        {errors.personalInfo?.address && (
                            <span className="error-message">{errors.personalInfo.address.message}</span>
                        )}
                    </label>
                </div>
            </div> */}
        </div>
    );

    const renderEducation = () => (
        <div className="step-container">
            <h2 className="step-title">Education Details</h2>
            <p className="step-subtitle">Add all relevant educational qualifications.</p>

            {educationFields.map((field, index) => (
                <div key={field.id} className="card">
                    <div className="card-header">
                        <h3 className="card-title">Education #{index + 1}</h3>
                        {index > 0 && (
                            <button
                                type="button"
                                className="delete-btn"
                                onClick={() => removeEducation(index)}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                    <div className="card-content">
                        <div className="grid-2">
                            <div className="form-group">
                                <label className="form-label">
                                    Qualification
                                    <Controller
                                        name={`education.${index}.qualification`}
                                        control={control}
                                        rules={validation.education.qualification}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                className={`form-input ${errors.education?.[index]?.qualification ? 'error' : ''}`}
                                                placeholder="e.g., Bachelor of Technology"
                                            />
                                        )}
                                    />
                                    {errors.education?.[index]?.qualification && (
                                        <span className="error-message">{errors.education[index].qualification.message}</span>
                                    )}
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Institution Name
                                    <Controller
                                        name={`education.${index}.institution`}
                                        control={control}
                                        rules={validation.education.institution}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                className={`form-input ${errors.education?.[index]?.institution ? 'error' : ''}`}
                                                placeholder="e.g., University of Delhi"
                                            />
                                        )}
                                    />
                                    {errors.education?.[index]?.institution && (
                                        <span className="error-message">{errors.education[index].institution.message}</span>
                                    )}
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Year of Passing
                                    <Controller
                                        name={`education.${index}.yearOfPassing`}
                                        control={control}
                                        rules={validation.education.yearOfPassing}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="number"
                                                className={`form-input ${errors.education?.[index]?.yearOfPassing ? 'error' : ''}`}
                                                placeholder="e.g., 2020"
                                                min="1900"
                                                max={new Date().getFullYear()}
                                            />
                                        )}
                                    />
                                    {errors.education?.[index]?.yearOfPassing && (
                                        <span className="error-message">{errors.education[index].yearOfPassing.message}</span>
                                    )}
                                </label>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Percentage/CGPA
                                    <Controller
                                        name={`education.${index}.percentage`}
                                        control={control}
                                        rules={validation.education.percentage}
                                        render={({ field }) => (
                                            <div className="input-with-suffix">
                                                <input
                                                    {...field}
                                                    type="number"
                                                    className={`form-input ${errors.education?.[index]?.percentage ? 'error' : ''}`}
                                                    placeholder="e.g., 85.5"
                                                    style={{ marginRight: "75px" }}
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                />
                                                <span className="input-suffix">%</span>
                                            </div>
                                        )}
                                    />
                                    {errors.education?.[index]?.percentage && (
                                        <span className="error-message">{errors.education[index].percentage.message}</span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="add-btn"
                onClick={() => appendEducation({
                    qualification: "",
                    institution: "",
                    yearOfPassing: "",
                    percentage: "",
                })}
            >
                + Add Another Qualification
            </button>
        </div>
    );

    const renderExperience = () => (
        <div className="step-container">
            <h2 className="step-title">Work Experience</h2>
            <p className="step-subtitle">Add work experience in chronological order.</p>

            {experienceFields.map((field, index) => {
                const currentlyWorking = watch(`experience.${index}.currentlyWorking`);

                return (
                    <div key={field.id} className="card">
                        <div className="card-header">
                            <h3 className="card-title">Experience #{index + 1}</h3>
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => removeExperience(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                        <div className="card-content">
                            <div className="grid-2">
                                <div className="form-group">
                                    <label className="form-label">
                                        Company Name
                                        <Controller
                                            name={`experience.${index}.company`}
                                            control={control}
                                            rules={validation.experience.company}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`form-input ${errors.experience?.[index]?.company ? 'error' : ''}`}
                                                    placeholder="e.g., Google Inc."
                                                />
                                            )}
                                        />
                                        {errors.experience?.[index]?.company && (
                                            <span className="error-message">{errors.experience[index].company.message}</span>
                                        )}
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Job Title
                                        <Controller
                                            name={`experience.${index}.jobTitle`}
                                            control={control}
                                            rules={validation.experience.jobTitle}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    className={`form-input ${errors.experience?.[index]?.jobTitle ? 'error' : ''}`}
                                                    placeholder="e.g., Senior Software Engineer"
                                                />
                                            )}
                                        />
                                        {errors.experience?.[index]?.jobTitle && (
                                            <span className="error-message">{errors.experience[index].jobTitle.message}</span>
                                        )}
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        From Date
                                        <Controller
                                            name={`experience.${index}.fromDate`}
                                            control={control}
                                            rules={validation.experience.fromDate}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="month"
                                                    className={`form-input ${errors.experience?.[index]?.fromDate ? 'error' : ''}`}
                                                />
                                            )}
                                        />
                                        {errors.experience?.[index]?.fromDate && (
                                            <span className="error-message">{errors.experience[index].fromDate.message}</span>
                                        )}
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        To Date
                                        <Controller
                                            name={`experience.${index}.toDate`}
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="month"
                                                    className={`form-input ${errors.experience?.[index]?.toDate ? 'error' : ''}`}
                                                    disabled={currentlyWorking}
                                                    placeholder={currentlyWorking ? "Present" : ""}
                                                />
                                            )}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="currently-working-group">
                                <Controller
                                    name={`experience.${index}.currentlyWorking`}
                                    control={control}
                                    render={({ field }) => (
                                        <label className="currently-working-label">
                                            <input
                                                {...field}
                                                type="checkbox"
                                                className="currently-working-checkbox"
                                                checked={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.checked);
                                                    if (e.target.checked) {
                                                        // Clear toDate if currently working
                                                        const { setValue } = control;
                                                        setValue(`experience.${index}.toDate`, "");
                                                    }
                                                }}
                                            />
                                            Currently working here
                                        </label>
                                    )}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Responsibilities
                                    <Controller
                                        name={`experience.${index}.responsibilities`}
                                        control={control}
                                        rules={validation.experience.responsibilities}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className={`form-input textarea ${errors.experience?.[index]?.responsibilities ? 'error' : ''}`}
                                                placeholder="Describe your responsibilities and achievements"
                                                rows="3"
                                            />
                                        )}
                                    />
                                    {errors.experience?.[index]?.responsibilities && (
                                        <span className="error-message">{errors.experience[index].responsibilities.message}</span>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                );
            })}

            <button
                type="button"
                className="add-btn"
                onClick={() => appendExperience({
                    company: "",
                    jobTitle: "",
                    fromDate: "",
                    toDate: "",
                    responsibilities: "",
                    currentlyWorking: false,
                })}
            >
                + Add Another Position
            </button>

            <div className="section">
                <h3 className="section-title">Additional Information</h3>
                <div className="grid-2">
                    <div className="form-group">
                        <label className="form-label">
                            Total Experience
                            <Controller
                                name="totalExperience"
                                control={control}
                                rules={validation.totalExperience}
                                render={({ field }) => (
                                    <div className="input-with-suffix">
                                        <input
                                            {...field}
                                            type="number"
                                            className={`form-input mr-[25px] ${errors.totalExperience ? 'error' : ''}`}
                                            placeholder="e.g., 3.5"
                                            min="0"
                                            max="50"
                                            step="0.1"
                                        />
                                        <span className="input-suffix">years</span>
                                    </div>
                                )}
                            />
                            {errors.totalExperience && (
                                <span className="error-message">{errors.totalExperience.message}</span>
                            )}
                        </label>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Skills
                            <Controller
                                name="skills"
                                control={control}
                                rules={validation.skills}
                                render={({ field }) => (
                                    <Select
                                        isMulti
                                        options={commonSkills.map(skill => ({ value: skill, label: skill }))}
                                        placeholder="Type or select skills..."
                                        value={field.value?.map(skill => ({ value: skill, label: skill }))}
                                        onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                                        styles={customSelectStyles}
                                        className={`custom-select ${errors.skills ? 'error' : ''}`}
                                        classNamePrefix="select"
                                    />
                                )}
                            />
                            {errors.skills && (
                                <span className="error-message">{errors.skills.message}</span>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderResumeUpload = () => (
        <div className="step-container">
            <h2 className="step-title">Upload Resume</h2>
            <p className="step-subtitle">Upload the candidate's resume in PDF, DOC, or DOCX format (Max 5MB).</p>

            <div className="resume-upload-container">
                {!resumeFile ? (
                    <div className="upload-area">
                        <input
                            type="file"
                            id="resume-upload"
                            className="file-input"
                            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            onChange={handleFileChange}
                            disabled={mutation.isLoading}
                        />
                        <label htmlFor="resume-upload" className="upload-label">
                            <div className="upload-icon">
                                <FaCloudUploadAlt />
                            </div>
                            <h3 className="upload-title">Upload Resume</h3>
                            <p className="upload-subtitle">
                                Drag & drop your file here or click to browse
                            </p>
                            <p className="upload-info">
                                Supported formats: PDF, DOC, DOCX, TXT • Max size: 5MB
                            </p>
                            <button type="button" className="btn btn-outline">
                                <FaUpload /> Browse Files
                            </button>
                        </label>
                    </div>
                ) : (
                    <div className="file-preview">
                        <div className="file-preview-header">
                            <div className="file-icon">
                                {resumeFile.type === 'application/pdf' ? (
                                    <FaFilePdf />
                                ) : resumeFile.type.includes('word') ? (
                                    <FaFileWord />
                                ) : (
                                    <FaFileWord />
                                )}
                            </div>
                            <div className="file-info">
                                <h4 className="file-name">{resumeFile.name}</h4>
                                <p className="file-size">
                                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                className="remove-file-btn"
                                onClick={removeFile}
                                disabled={mutation.isLoading}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {mutation.isLoading && (
                            <div className="upload-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {uploadProgress}% uploaded
                                </span>
                            </div>
                        )}

                        <div className="file-actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => document.getElementById('resume-upload')?.click()}
                                disabled={mutation.isLoading}
                            >
                                Replace File
                            </button>
                        </div>
                    </div>
                )}

                <div className="upload-note">
                    <p className="note-text">
                        <strong>Note:</strong> The resume will be parsed automatically to extract candidate information.
                    </p>
                </div>
            </div>
        </div>
    );

    const getStepContent = (step) => {
        switch (step) {
            case 0: return renderPersonalInfo();
            case 1: return renderEducation();
            case 2: return renderExperience();
            case 3: return renderResumeUpload();
            default: return null;
        }
    };

    return (
        <div className="add-candidate-container">
            <div className="main-card">
                <div className="header">
                    <h1 className="page-title">Add New Candidate</h1>
                    <p className="page-subtitle">
                        Complete the following steps to add a new candidate to the system
                    </p>
                </div>

                <div className="stepper">
                    {steps.map((label, index) => (
                        <div key={label} className="stepper-step">
                            <div className={`step-indicator ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}>
                                {index < activeStep ? '✓' : index + 1}
                            </div>
                            <div className="step-label">{label}</div>
                            {index < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                    ))}
                </div>

                <div className="step-content">
                    {getStepContent(activeStep)}
                </div>

                <div className="action-buttons">
                    <button
                        type="button"
                        className="btn btn-outline w-12"
                        onClick={handleBack}
                        disabled={activeStep === 0 || mutation.isLoading}
                    >
                        ← Back
                    </button>

                    <div className="right-actions">
                        {activeStep === steps.length - 1 ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={handleReset}
                                    disabled={mutation.isLoading}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={mutation.isLoading}
                                >
                                    {mutation.isLoading ? (
                                        <>
                                            <div className="btn-spinner"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleNext}
                                disabled={mutation.isLoading}
                            >
                                Continue →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCandidate;