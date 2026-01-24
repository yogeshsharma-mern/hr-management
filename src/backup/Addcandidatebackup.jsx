import React, { useState } from "react";
import {
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Container,
    Paper,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    FormControl,
    InputLabel,
    Chip,
    Autocomplete,
    Divider,
    InputAdornment,
    FormHelperText,
    Card,
    CardContent,
    Stack,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPost, apiGet } from "../../api/apiFetch";
import apiPath from "../../api/apiPath";
import AddCandidateValidation from "../../validation/addCandidate.validation";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


// Styled Components for better structure
const StepContainer = ({ children, title }) => (
    <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom color="primary">
            {title}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {children}
    </Box>
);

const FormSection = ({ title, children, spacing = 3 }) => (
    <Box sx={{ mb: 4 }}>
        {title && (
            <Typography variant="h6" fontWeight={500} gutterBottom color="text.secondary">
                {title}
            </Typography>
        )}
        <Grid container spacing={spacing}>
            {children}
        </Grid>
    </Box>
);

const FieldWrapper = ({ children, xs = 12, sm = 6, md = 4 }) => (
    <Grid item xs={xs} sm={sm} md={md}>
        {children}
    </Grid>
);

const positions = [
    "Software Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Data Analyst",
    "DevOps Engineer",
    "QA Engineer",
    "Business Analyst",
    "Project Manager",
];


const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const steps = ["Personal Information", "Education Details", "Work Experience"];

const commonSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "HTML/CSS",
    "SQL",
    "AWS",
    "Docker",
    "Git",
    "TypeScript",
    "Angular",
    "Vue.js",
    "MongoDB",
    "PostgreSQL",
    "Redis",
    "Kubernetes",
    "CI/CD",
    "Agile/Scrum",
    "UI/UX Design",
    "Data Analysis",
    "Machine Learning",
];

const AddCandidate = () => {
    const [activeStep, setActiveStep] = useState(0);
    const queryClient = useQueryClient();
    const validation = AddCandidateValidation();
    const { data: positionData, isLoading, isFetching, error, isError } = useQuery({
        queryKey: ["positions"],
        queryFn: () =>
            apiGet(apiPath.JobOpenings),
    });
    console.log("positonData", positionData);
const navigate = useNavigate();
    // const positions = positionData?.data.map((job) => job?.title) || [];
const positions =
  positionData?.data?.map((job) => ({
    value: job._id,
    label: job.title,
  })) || [];

    console.log("posotions", positions);
    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        watch,
    } = useForm({
        mode: "onChange",        // 👈 validate on change
        reValidateMode: "onChange", // 👈 re-validate when value changes
        defaultValues: {
            personalInfo: {
                fullName: "",
                email: "",
                phone: "",
                dateOfBirth: null,
                gender: "",
                position: "",
                jobId:"",
                address: "",
            },
            education: [
                {
                    qualification: "",
                    institution: "",
                    // specialization: "",
                    yearOfPassing: "",
                    percentage: "",
                },
            ],
            experience: [
                {
                    company: "",
                    jobTitle: "",
                    fromDate: null,
                    toDate: null,
                    responsibilities: "",
                    currentlyWorking: false,
                },
            ],
            skills: [],
            totalExperience: "",
        },
    });


    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control,
        name: "education",
    });

    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({
        control,
        name: "experience",
    });

    const mutation = useMutation({
        mutationFn: (data) => apiPost(apiPath.AddCandidates, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(["candidates"]);
            alert("Candidate added successfully!");
            handleReset();
            toast.success(data?.message);
            navigate(-1);
        },
        onError: (error) => {
   toast.error(error?.response?.data?.message);
        },
    });

    const handleNext = async () => {
        let isValid = false;

        if (activeStep === 0) {
            isValid = await trigger("personalInfo");
        } else if (activeStep === 1) {
            isValid = await trigger("education");
        } else if (activeStep === 2) {
            isValid = await trigger(["experience", "skills", "totalExperience"]);
        }

        if (isValid) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    // const onSubmit = (data) => {
    //     console.log("data", data);
    //     const formattedData = {
    //         ...data,
        
    //             ...data.personalInfo,
    //             dateOfBirth: data.personalInfo.dateOfBirth
    //                 ? new Date(data.personalInfo.dateOfBirth).toISOString()
    //                 : null,

            
    //         education: data.education.map((edu) => ({
    //             ...edu,
    //             yearOfPassing: parseInt(edu.yearOfPassing) || 0,
    //             percentage: parseFloat(edu.percentage) || 0,
    //         })),
    //         experience: data.experience.map((exp) => ({
    //             ...exp,
    //             fromDate: exp.fromDate ? new Date(exp.fromDate).toISOString() : null,
    //             toDate: exp.toDate ? new Date(exp.toDate).toISOString() : null,
    //         })),
    //         totalExperience: parseFloat(data.totalExperience) || 0,
    //     };

    //     mutation.mutate(formattedData);
    // };

const onSubmit = (data) => {
    console.log("Form data:", data);
    
    // Format date to YYYY-MM-DD for API
    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const payload = {
        // Send personalInfo fields at root level
        fullName: data.personalInfo.fullName,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        jobId: data.personalInfo.jobId,
        // Add other personalInfo fields if needed by API
        dateOfBirth: data.personalInfo.dateOfBirth ? formatDate(data.personalInfo.dateOfBirth) : null,
        gender: data.personalInfo.gender,
        address: data.personalInfo.address,
        
        // Education array - CORRECTED FIELD NAMES
        education: data.education.map(edu => ({
            institution: edu.institution, // ✅
            qualification: edu.qualification || "", // ✅ Changed from edu.specialization to edu.qualification
            yearOfPassing: parseInt(edu.yearOfPassing) || 0,
            cgpa: parseFloat(edu.percentage) || 0, // ✅ Changed from edu.cgpa to edu.percentage
        })),
        
        // Experience array - CORRECTED FIELD NAMES
        experience: data.experience.map(exp => ({
            companyName: exp.company, // ✅ Changed from exp.companyName to exp.company
            jobTitle: exp.jobTitle,
            from: exp.fromDate ? formatDate(exp.fromDate) : null, // ✅ Changed from exp.from to exp.fromDate
            to: exp.toDate ? formatDate(exp.toDate) : null, // ✅ Changed from exp.to to exp.toDate
            responsibilities: exp.responsibilities,
        })),
        
        // Total experience - CORRECTED FIELD NAME
        totalExperienceInYears: parseFloat(data.totalExperience) || 0, // ✅ Changed from data.totalExperienceInYears to data.totalExperience
        
        // Skills array
        skills: data.skills || [],
    };

    console.log("Final payload:", payload);
    mutation.mutate(payload);
};
    const renderPersonalInfo = () => (
        <StepContainer title="Personal Information">
            <FormSection spacing={4}>

                {/* ================= BASIC INFORMATION ================= */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Basic Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="personalInfo.fullName"
                                control={control}
                                rules={validation.personalInfo.fullName}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Full Name"
                                        error={!!errors.personalInfo?.fullName}
                                        helperText={errors.personalInfo?.fullName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="personalInfo.email"
                                control={control}
                                rules={validation.personalInfo.email}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Email Address"
                                        error={!!errors.personalInfo?.email}
                                        helperText={errors.personalInfo?.email?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* ================= CONTACT INFORMATION ================= */}
                <Box>
                    {/* <Typography variant="h6" gutterBottom>
          Contact Information
        </Typography> */}

                    <Grid container spacing={3}>
                        <Grid item xs={12} mt={4} md={6}>
                            <Controller
                                name="personalInfo.phone"
                                control={control}
                                rules={validation.personalInfo.phone}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.personalInfo?.phone}>
                                        <InputLabel shrink>Phone Number</InputLabel>
                                        <Box sx={{ mt: 2 }}>
                                            <PhoneInput
                                                country="in"
                                                value={field.value}
                                                onChange={field.onChange}
                                                inputStyle={{ width: "100%" }}
                                            />
                                        </Box>
                                        <FormHelperText>
                                            {errors.personalInfo?.phone?.message}
                                        </FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid container spacing={3} mt={4}>
                            {/* <Grid item xs={12} md={6}> */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Controller
                                    name="personalInfo.dateOfBirth"
                                    control={control}
                                    rules={validation.personalInfo.dateOfBirth}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="Date of Birth"
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    error={!!errors.personalInfo?.dateOfBirth}
                                                    helperText={errors.personalInfo?.dateOfBirth?.message}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Box>

                {/* ================= PROFESSIONAL DETAILS ================= */}
                <Box>
                    {/* <Typography variant="h6" gutterBottom>
          Professional Details
        </Typography> */}

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="personalInfo.gender"
                                control={control}
                                rules={validation.personalInfo.gender}
                                render={({ field }) => (
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            Gender
                                        </Typography>
                                        <Select
                                            options={genderOptions}
                                            placeholder="Select Gender"
                                            onChange={(option) => field.onChange(option?.value)}
                                            value={genderOptions.find(
                                                (opt) => opt.value === field.value
                                            )}
                                            styles={{
                                                container: (base) => ({ ...base, width: "100%" }),
                                                control: (base) => ({
                                                    ...base,
                                                    minHeight: 56,
                                                    borderRadius: 6,
                                                }),
                                            }}
                                        />
                                        <FormHelperText error>
                                            {errors.personalInfo?.gender?.message}
                                        </FormHelperText>
                                    </Box>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Controller
                                name="personalInfo.jobId"
                                control={control}
                                rules={validation.personalInfo.position}
                                render={({ field }) => (
                                    <Box>
                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                            Position Applied
                                        </Typography>
                                       <Select
  options={positions}
  placeholder="Select Position"
  onChange={(option) => field.onChange(option?.value)} // 👈 yahan ID jayegi
value={positions.find(opt => opt.value === field.value)}

  styles={{
    container: (base) => ({ ...base, width: "100%" }),
    control: (base) => ({
      ...base,
      minHeight: 56,
      borderRadius: 6,
    }),
  }}
/>

                                        <FormHelperText error>
                                            {errors.personalInfo?.position?.message}
                                        </FormHelperText>
                                    </Box>
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* ================= ADDRESS ================= */}
                <Box>
                    {/* <Typography variant="h6" gutterBottom>
          Address
        </Typography> */}

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Controller
                                name="personalInfo.address"
                                control={control}
                                rules={validation.personalInfo.address}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Current Address"
                                        error={!!errors.personalInfo?.address}
                                        helperText={errors.personalInfo?.address?.message}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

            </FormSection>
        </StepContainer>
    );



    const renderEducation = () => (
        <StepContainer title="Education Details">
            {educationFields.map((field, index) => (
                <Card key={field.id} sx={{ mb: 3, border: 1, borderColor: "divider" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" color="primary">
                                Education #{index + 1}
                            </Typography>
                            {index > 0 && (
                                <IconButton
                                    onClick={() => removeEducation(index)}
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>

                        <FormSection spacing={2}>
                            <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`education.${index}.qualification`}
                                    control={control}
                                    rules={validation.education.qualification}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="qualification/Qualification"
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.education?.[index]?.qualification}
                                            helperText={errors.education?.[index]?.qualification?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>

                            <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`education.${index}.institution`}
                                    control={control}
                                    rules={validation.education.institution}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Institution Name"
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.education?.[index]?.institution}
                                            helperText={errors.education?.[index]?.institution?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>

                            {/* <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`education.${index}.specialization`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Specialization"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </FieldWrapper> */}

                            <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`education.${index}.yearOfPassing`}
                                    control={control}
                                    rules={validation.education.yearOfPassing}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Year of Passing"
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.education?.[index]?.yearOfPassing}
                                            helperText={errors.education?.[index]?.yearOfPassing?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>

                            <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`education.${index}.percentage`}
                                    control={control}
                                    rules={validation.education.percentage}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Percentage/CGPA"
                                            variant="outlined"
                                            size="small"
                                            type="number"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                inputProps: { min: 0, max: 100, step: 0.01 }
                                            }}
                                            error={!!errors.education?.[index]?.percentage}
                                            helperText={errors.education?.[index]?.percentage?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>
                        </FormSection>
                    </CardContent>
                </Card>
            ))}

            <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                    appendEducation({
                        qualification: "",
                        institution: "",
                        specialization: "",
                        yearOfPassing: "",
                        percentage: "",
                    })
                }
                variant="outlined"
                color="primary"
                sx={{ mt: 1 }}
            >
                Add Another qualification
            </Button>
        </StepContainer>
    );

    const renderExperience = () => (
        <StepContainer title="Work Experience">
            {experienceFields.map((field, index) => (
                <Card key={field.id} sx={{ mb: 3, border: 1, borderColor: "divider" }}>
                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h6" color="primary">
                                Experience #{index + 1}
                            </Typography>
                            {index > 0 && (
                                <IconButton
                                    onClick={() => removeExperience(index)}
                                    color="error"
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>

                        <FormSection spacing={2}>
                            <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`experience.${index}.company`}
                                    control={control}
                                    rules={validation.experience.company}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Company Name"
                                            variant="outlined"
                                            // size="small"
                                            error={!!errors.experience?.[index]?.company}
                                            helperText={errors.experience?.[index]?.company?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>

                            <FieldWrapper xs={12} md={6}>
                                <Controller
                                    name={`experience.${index}.jobTitle`}
                                    control={control}
                                    rules={validation.experience.jobTitle}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Job Title"
                                            variant="outlined"
                                            // size="small"

                                            error={!!errors.experience?.[index]?.jobTitle}
                                            helperText={errors.experience?.[index]?.jobTitle?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>

                            <FieldWrapper xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Controller
                                        name={`experience.${index}.fromDate`}
                                        control={control}
                                        rules={validation.experience.fromDate}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label="From Date"
                                                inputFormat="MM/yyyy"
                                                views={['year', 'month']}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        error={!!errors.experience?.[index]?.fromDate}
                                                        helperText={errors.experience?.[index]?.fromDate?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FieldWrapper>

                            <FieldWrapper xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Controller
                                        name={`experience.${index}.toDate`}
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
                                                label="To Date"
                                                inputFormat="MM/yyyy"
                                                views={['year', 'month']}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        error={!!errors.experience?.[index]?.toDate}
                                                        helperText={errors.experience?.[index]?.toDate?.message}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </FieldWrapper>

                            <FieldWrapper xs={12}>
                                <Controller
                                    name={`experience.${index}.responsibilities`}
                                    control={control}
                                    rules={validation.experience.responsibilities}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            multiline
                                            rows={2}
                                            label="Responsibilities"
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.experience?.[index]?.responsibilities}
                                            helperText={errors.experience?.[index]?.responsibilities?.message}
                                        />
                                    )}
                                />
                            </FieldWrapper>
                        </FormSection>
                    </CardContent>
                </Card>
            ))}

            <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() =>
                    appendExperience({
                        company: "",
                        jobTitle: "",
                        fromDate: null,
                        toDate: null,
                        responsibilities: "",
                        currentlyWorking: false,
                    })
                }
                variant="outlined"
                color="primary"
                sx={{ mt: 1, mb: 4 }}
            >
                Add Another Position
            </Button>

            <FormSection title="Additional Information">
                <Grid container spacing={2}>
                    {/* Total Experience Field */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="totalExperience"
                            control={control}
                            rules={validation.totalExperience}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Total Experience"
                                    variant="outlined"
                                    type="number"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                years
                                            </InputAdornment>
                                        ),
                                        inputProps: {
                                            min: 0,
                                            max: 50,
                                            step: 0.5,
                                            style: { width: '130px' }
                                        },
                                    }}
                                    sx={{
                                        '& .MuiInputBase-root': {
                                            minHeight: 56,
                                        }
                                    }}
                                    error={!!errors.totalExperience}
                                    helperText={errors.totalExperience?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* Skills Field - Takes full width or half depending on your preference */}
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="skills"
                            control={control}
                            rules={validation.skills}
                            render={({ field }) => (
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    fullWidth
                                    value={field.value || []}
                                    onChange={(_, newValue) => field.onChange(newValue)}
                                    options={commonSkills}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            minHeight: 56,
                                            alignItems: "flex-start",
                                            paddingTop: 1,
                                            paddingBottom: 1,
                                            flexWrap: 'wrap',
                                        },
                                        "& .MuiAutocomplete-input": {
                                            minWidth: '150px !important',
                                        }
                                    }}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option}
                                                {...getTagProps({ index })}
                                                key={index}
                                                size="small"
                                                variant="outlined"
                                                sx={{ margin: 0.5 }}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Skills"
                                            placeholder="Type or select skills"
                                            error={!!errors.skills}
                                            helperText={errors.skills?.message}
                                            sx={{
                                                '& .MuiInputLabel-root': {
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }
                                            }}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </FormSection>

        </StepContainer>
    );

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return renderPersonalInfo();
            case 1:
                return renderEducation();
            case 2:
                return renderExperience();
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight={700}
                    gutterBottom
                    color="primary.main"
                    align="center"
                >
                    Add New Candidate
                </Typography>

                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 4 }}
                >
                    Complete the following steps to add a new candidate to the system
                </Typography>

                <Stepper
                    activeStep={activeStep}
                    sx={{
                        mb: 6,
                        "& .MuiStepIcon-root": {
                            width: 32,
                            height: 32,
                        },
                        "& .MuiStepIcon-text": {
                            fontSize: "0.875rem",
                            fontWeight: 600,
                        },
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel
                                StepIconProps={{
                                    sx: {
                                        "&.Mui-completed": {
                                            color: "success.main",
                                        },
                                        "&.Mui-active": {
                                            color: "primary.main",
                                        },
                                    },
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ minHeight: "400px" }}>
                    {getStepContent(activeStep)}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 6, pt: 3, borderTop: 1, borderColor: "divider" }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                    >
                        Back
                    </Button>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        {activeStep === steps.length - 1 ? (
                            <>
                                <Button
                                    onClick={handleReset}
                                    variant="outlined"
                                    color="inherit"
                                    sx={{ minWidth: 120 }}
                                >
                                    Reset
                                </Button>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    variant="contained"
                                    color="primary"
                                    disabled={mutation.isLoading}
                                    sx={{ minWidth: 120 }}
                                >
                                    {mutation.isLoading ? (
                                        <>Submitting...</>
                                    ) : (
                                        <>Submit Application</>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                color="primary"
                                sx={{ minWidth: 120 }}
                            >
                                Continue
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddCandidate;






// second. backup
// import React, { useState } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { apiPost, apiGet } from "../../api/apiFetch";
// import apiPath from "../../api/apiPath";
// import AddCandidateValidation from "../../validation/addCandidate.validation";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import Select from "react-select";
// import "./AddCandidate.css";

// const steps = ["Personal Information", "Education Details", "Work Experience"];
// const commonSkills = [
//     "JavaScript", "React", "Node.js", "Python", "Java", "HTML/CSS", "SQL", 
//     "AWS", "Docker", "Git", "TypeScript", "Angular", "Vue.js", "MongoDB", 
//     "PostgreSQL", "Redis", "Kubernetes", "CI/CD", "Agile/Scrum"
// ];

// const AddCandidate = () => {
//     const [activeStep, setActiveStep] = useState(0);
//     const queryClient = useQueryClient();
//     const navigate = useNavigate();
//     const validation = AddCandidateValidation();

//     const { data: positionData } = useQuery({
//         queryKey: ["positions"],
//         queryFn: () => apiGet(apiPath.JobOpenings),
//     });

//     const positions = positionData?.data?.map((job) => ({
//         value: job._id,
//         label: job.title,
//     })) || [];

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         trigger,
//         reset,
//         watch
//     } = useForm({
//         mode: "onChange",
//         reValidateMode: "onChange",
//         defaultValues: {
//             personalInfo: {
//                 fullName: "",
//                 email: "",
//                 phone: "",
//                 dateOfBirth: "",
//                 gender: "",
//                 jobId: "",
//                 address: "",
//             },
//             education: [
//                 {
//                     qualification: "",
//                     institution: "",
//                     yearOfPassing: "",
//                     percentage: "",
//                 },
//             ],
//             experience: [
//                 {
//                     company: "",
//                     jobTitle: "",
//                     fromDate: "",
//                     toDate: "",
//                     responsibilities: "",
//                     currentlyWorking: false,
//                 },
//             ],
//             skills: [],
//             totalExperience: "",
//         },
//     });

//     const {
//         fields: educationFields,
//         append: appendEducation,
//         remove: removeEducation,
//     } = useFieldArray({ control, name: "education" });

//     const {
//         fields: experienceFields,
//         append: appendExperience,
//         remove: removeExperience,
//     } = useFieldArray({ control, name: "experience" });

//     const mutation = useMutation({
//         mutationFn: (data) => apiPost(apiPath.AddCandidates, data),
//         onSuccess: (data) => {
//             queryClient.invalidateQueries(["candidates"]);
//             toast.success(data?.message || "Candidate added successfully!");
//             handleReset();
//             navigate(-1);
//         },
//         onError: (error) => {
//             toast.error(error?.response?.data?.message || "Failed to add candidate");
//         },
//     });

//     const handleNext = async () => {
//         let isValid = false;
//         if (activeStep === 0) {
//             isValid = await trigger("personalInfo");
//         } else if (activeStep === 1) {
//             isValid = await trigger("education");
//         } else if (activeStep === 2) {
//             isValid = await trigger(["experience", "skills", "totalExperience"]);
//         }

//         if (isValid) {
//             setActiveStep(prev => prev + 1);
//         }
//     };

//     const handleBack = () => {
//         setActiveStep(prev => prev - 1);
//     };

//     const handleReset = () => {
//         setActiveStep(0);
//         reset();
//     };

//     const onSubmit = (data) => {
//         const formatDate = (date) => {
//             if (!date) return "";
//             const d = new Date(date);
//             return d.toISOString().split('T')[0];
//         };

//         const payload = {
//             fullName: data.personalInfo.fullName,
//             email: data.personalInfo.email,
//             phone: data.personalInfo.phone,
//             jobId: data.personalInfo.jobId,
//             dateOfBirth: data.personalInfo.dateOfBirth ? formatDate(data.personalInfo.dateOfBirth) : null,
//             gender: data.personalInfo.gender,
//             address: data.personalInfo.address,
//             education: data.education.map(edu => ({
//                 institution: edu.institution,
//                 qualification: edu.qualification || "",
//                 yearOfPassing: parseInt(edu.yearOfPassing) || 0,
//                 cgpa: parseFloat(edu.percentage) || 0,
//             })),
//             experience: data.experience.map(exp => ({
//                 companyName: exp.company,
//                 jobTitle: exp.jobTitle,
//                 from: exp.fromDate ? formatDate(exp.fromDate) : null,
//                 to: exp.toDate ? formatDate(exp.toDate) : null,
//                 responsibilities: exp.responsibilities,
//             })),
//             totalExperienceInYears: parseFloat(data.totalExperience) || 0,
//             skills: data.skills || [],
//         };

//         mutation.mutate(payload);
//     };

//     // Custom styles for react-select to match our UI
//     const customSelectStyles = {
//         control: (base, state) => ({
//             ...base,
//             minHeight: '42px',
//             border: '1.5px solid #e2e8f0',
//             borderRadius: '8px',
//             boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
//             borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
//             backgroundColor: 'white',
//             '&:hover': {
//                 borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1'
//             }
//         }),
//         valueContainer: (base) => ({
//             ...base,
//             padding: '2px 12px'
//         }),
//         input: (base) => ({
//             ...base,
//             margin: '0',
//             padding: '0'
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: '#94a3b8',
//             fontSize: '14px'
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: '#1e293b',
//             fontSize: '14px'
//         }),
//         multiValue: (base) => ({
//             ...base,
//             backgroundColor: '#dbeafe',
//             borderRadius: '16px'
//         }),
//         multiValueLabel: (base) => ({
//             ...base,
//             color: '#1e40af',
//             fontSize: '12px',
//             fontWeight: '500',
//             padding: '2px 6px'
//         }),
//         multiValueRemove: (base) => ({
//             ...base,
//             color: '#1e40af',
//             borderRadius: '0 16px 16px 0',
//             '&:hover': {
//                 backgroundColor: '#bfdbfe',
//                 color: '#1e40af'
//             }
//         }),
//         menu: (base) => ({
//             ...base,
//             borderRadius: '8px',
//             border: '1px solid #e2e8f0',
//             boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
//             zIndex: 9999
//         }),
//         option: (base, state) => ({
//             ...base,
//             fontSize: '14px',
//             backgroundColor: state.isSelected ? '#dbeafe' : state.isFocused ? '#f1f5f9' : 'white',
//             color: state.isSelected ? '#1e40af' : '#1e293b',
//             '&:active': {
//                 backgroundColor: '#dbeafe'
//             }
//         })
//     };

//     const renderPersonalInfo = () => (
//         <div className="step-container">
//             <h2 className="step-title">Personal Information</h2>
//             <p className="step-subtitle">DigiRoad collects this information to better understand and serve candidates.</p>
            
//             <div className="section">
//                 <h3 className="section-title">Basic Information</h3>
//                 <div className="grid-2">
//                     <div className="form-group">
//                         <label className="form-label">
//                             Full Name
//                             <Controller
//                                 name="personalInfo.fullName"
//                                 control={control}
//                                 rules={validation.personalInfo.fullName}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="text"
//                                         className={`form-input ${errors.personalInfo?.fullName ? 'error' : ''}`}
//                                         placeholder="Enter full name"
//                                     />
//                                 )}
//                             />
//                             {errors.personalInfo?.fullName && (
//                                 <span className="error-message">{errors.personalInfo.fullName.message}</span>
//                             )}
//                         </label>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">
//                             Email Address
//                             <Controller
//                                 name="personalInfo.email"
//                                 control={control}
//                                 rules={validation.personalInfo.email}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="email"
//                                         className={`form-input ${errors.personalInfo?.email ? 'error' : ''}`}
//                                         placeholder="Enter email address"
//                                     />
//                                 )}
//                             />
//                             {errors.personalInfo?.email && (
//                                 <span className="error-message">{errors.personalInfo.email.message}</span>
//                             )}
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="section">
//                 <h3 className="section-title">Contact Information</h3>
//                 <div className="grid-2">
//                     <div className="form-group">
//                         <label className="form-label">
//                             Phone Number
//                             <Controller
//                                 name="personalInfo.phone"
//                                 control={control}
//                                 rules={validation.personalInfo.phone}
//                                 render={({ field }) => (
//                                     <div className="phone-input-container">
//                                         <PhoneInput
//                                             country={'in'}
//                                             value={field.value}
//                                             onChange={(phone) => field.onChange(phone)}
//                                             inputProps={{
//                                                 name: 'phone',
//                                                 required: true,
//                                                 autoFocus: false
//                                             }}
//                                             containerClass={`phone-container ${errors.personalInfo?.phone ? 'error' : ''}`}
//                                             inputClass="phone-input"
//                                             buttonClass="phone-button"
//                                             dropdownClass="phone-dropdown"
//                                         />
//                                         {errors.personalInfo?.phone && (
//                                             <span className="error-message">{errors.personalInfo.phone.message}</span>
//                                         )}
//                                     </div>
//                                 )}
//                             />
//                         </label>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">
//                             Date of Birth
//                             <Controller
//                                 name="personalInfo.dateOfBirth"
//                                 control={control}
//                                 rules={validation.personalInfo.dateOfBirth}
//                                 render={({ field }) => (
//                                     <input
//                                         {...field}
//                                         type="date"
//                                         className={`form-input ${errors.personalInfo?.dateOfBirth ? 'error' : ''}`}
//                                     />
//                                 )}
//                             />
//                             {errors.personalInfo?.dateOfBirth && (
//                                 <span className="error-message">{errors.personalInfo.dateOfBirth.message}</span>
//                             )}
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="section">
//                 <h3 className="section-title">Professional Details</h3>
//                 <div className="grid-2">
//                     <div className="form-group">
//                         <label className="form-label">
//                             Gender
//                             <Controller
//                                 name="personalInfo.gender"
//                                 control={control}
//                                 rules={validation.personalInfo.gender}
//                                 render={({ field }) => (
//                                     <select
//                                         {...field}
//                                         className={`form-input ${errors.personalInfo?.gender ? 'error' : ''}`}
//                                     >
//                                         <option value="">Select Gender</option>
//                                         <option value="male">Male</option>
//                                         <option value="female">Female</option>
//                                         <option value="other">Other</option>
//                                         <option value="prefer-not-to-say">Prefer not to say</option>
//                                     </select>
//                                 )}
//                             />
//                             {errors.personalInfo?.gender && (
//                                 <span className="error-message">{errors.personalInfo.gender.message}</span>
//                             )}
//                         </label>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">
//                             Position Applied
//                             <Controller
//                                 name="personalInfo.jobId"
//                                 control={control}
//                                 rules={validation.personalInfo.position}
//                                 render={({ field }) => (
//                                     <Select
//                                         options={positions}
//                                         placeholder="Select Position"
//                                         value={positions.find(opt => opt.value === field.value)}
//                                         onChange={(selected) => field.onChange(selected?.value)}
//                                         styles={customSelectStyles}
//                                         isClearable
//                                         className={`custom-select ${errors.personalInfo?.jobId ? 'error' : ''}`}
//                                         classNamePrefix="select"
//                                     />
//                                 )}
//                             />
//                             {errors.personalInfo?.jobId && (
//                                 <span className="error-message">{errors.personalInfo.jobId.message}</span>
//                             )}
//                         </label>
//                     </div>
//                 </div>
//             </div>

//             <div className="section">
//                 <h3 className="section-title">Address</h3>
//                 <div className="form-group">
//                     <label className="form-label">
//                         Current Address
//                         <Controller
//                             name="personalInfo.address"
//                             control={control}
//                             rules={validation.personalInfo.address}
//                             render={({ field }) => (
//                                 <textarea
//                                     {...field}
//                                     className={`form-input textarea ${errors.personalInfo?.address ? 'error' : ''}`}
//                                     placeholder="Enter current address"
//                                     rows="3"
//                                 />
//                             )}
//                         />
//                         {errors.personalInfo?.address && (
//                             <span className="error-message">{errors.personalInfo.address.message}</span>
//                         )}
//                     </label>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderEducation = () => (
//         <div className="step-container">
//             <h2 className="step-title">Education Details</h2>
//             <p className="step-subtitle">Add all relevant educational qualifications.</p>

//             {educationFields.map((field, index) => (
//                 <div key={field.id} className="card">
//                     <div className="card-header">
//                         <h3 className="card-title">Education #{index + 1}</h3>
//                         {index > 0 && (
//                             <button
//                                 type="button"
//                                 className="delete-btn"
//                                 onClick={() => removeEducation(index)}
//                             >
//                                 Remove
//                             </button>
//                         )}
//                     </div>
//                     <div className="card-content">
//                         <div className="grid-2">
//                             <div className="form-group">
//                                 <label className="form-label">
//                                     Qualification
//                                     <Controller
//                                         name={`education.${index}.qualification`}
//                                         control={control}
//                                         rules={validation.education.qualification}
//                                         render={({ field }) => (
//                                             <input
//                                                 {...field}
//                                                 type="text"
//                                                 className={`form-input ${errors.education?.[index]?.qualification ? 'error' : ''}`}
//                                                 placeholder="e.g., Bachelor of Technology"
//                                             />
//                                         )}
//                                     />
//                                     {errors.education?.[index]?.qualification && (
//                                         <span className="error-message">{errors.education[index].qualification.message}</span>
//                                     )}
//                                 </label>
//                             </div>

//                             <div className="form-group">
//                                 <label className="form-label">
//                                     Institution Name
//                                     <Controller
//                                         name={`education.${index}.institution`}
//                                         control={control}
//                                         rules={validation.education.institution}
//                                         render={({ field }) => (
//                                             <input
//                                                 {...field}
//                                                 type="text"
//                                                 className={`form-input ${errors.education?.[index]?.institution ? 'error' : ''}`}
//                                                 placeholder="e.g., University of Delhi"
//                                             />
//                                         )}
//                                     />
//                                     {errors.education?.[index]?.institution && (
//                                         <span className="error-message">{errors.education[index].institution.message}</span>
//                                     )}
//                                 </label>
//                             </div>

//                             <div className="form-group">
//                                 <label className="form-label">
//                                     Year of Passing
//                                     <Controller
//                                         name={`education.${index}.yearOfPassing`}
//                                         control={control}
//                                         rules={validation.education.yearOfPassing}
//                                         render={({ field }) => (
//                                             <input
//                                                 {...field}
//                                                 type="number"
//                                                 className={`form-input ${errors.education?.[index]?.yearOfPassing ? 'error' : ''}`}
//                                                 placeholder="e.g., 2020"
//                                                 min="1900"
//                                                 max={new Date().getFullYear()}
//                                             />
//                                         )}
//                                     />
//                                     {errors.education?.[index]?.yearOfPassing && (
//                                         <span className="error-message">{errors.education[index].yearOfPassing.message}</span>
//                                     )}
//                                 </label>
//                             </div>

//                             <div className="form-group">
//                                 <label className="form-label">
//                                     Percentage/CGPA
//                                     <Controller
//                                         name={`education.${index}.percentage`}
//                                         control={control}
//                                         rules={validation.education.percentage}
//                                         render={({ field }) => (
//                                             <div className="input-with-suffix">
//                                                 <input
//                                                     {...field}
//                                                     type="number"
//                                                     className={`form-input ${errors.education?.[index]?.percentage ? 'error' : ''}`}
//                                                     placeholder="e.g., 85.5"
//                                                     min="0"
//                                                     max="100"
//                                                     step="0.01"
//                                                 />
//                                                 <span className="input-suffix">%</span>
//                                             </div>
//                                         )}
//                                     />
//                                     {errors.education?.[index]?.percentage && (
//                                         <span className="error-message">{errors.education[index].percentage.message}</span>
//                                     )}
//                                 </label>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ))}

//             <button
//                 type="button"
//                 className="add-btn"
//                 onClick={() => appendEducation({
//                     qualification: "",
//                     institution: "",
//                     yearOfPassing: "",
//                     percentage: "",
//                 })}
//             >
//                 + Add Another Qualification
//             </button>
//         </div>
//     );

//     const renderExperience = () => (
//         <div className="step-container">
//             <h2 className="step-title">Work Experience</h2>
//             <p className="step-subtitle">Add work experience in chronological order.</p>

//             {experienceFields.map((field, index) => {
//                 const currentlyWorking = watch(`experience.${index}.currentlyWorking`);
                
//                 return (
//                     <div key={field.id} className="card">
//                         <div className="card-header">
//                             <h3 className="card-title">Experience #{index + 1}</h3>
//                             {index > 0 && (
//                                 <button
//                                     type="button"
//                                     className="delete-btn"
//                                     onClick={() => removeExperience(index)}
//                                 >
//                                     Remove
//                                 </button>
//                             )}
//                         </div>
//                         <div className="card-content">
//                             <div className="grid-2">
//                                 <div className="form-group">
//                                     <label className="form-label">
//                                         Company Name
//                                         <Controller
//                                             name={`experience.${index}.company`}
//                                             control={control}
//                                             rules={validation.experience.company}
//                                             render={({ field }) => (
//                                                 <input
//                                                     {...field}
//                                                     type="text"
//                                                     className={`form-input ${errors.experience?.[index]?.company ? 'error' : ''}`}
//                                                     placeholder="e.g., Google Inc."
//                                                 />
//                                             )}
//                                         />
//                                         {errors.experience?.[index]?.company && (
//                                             <span className="error-message">{errors.experience[index].company.message}</span>
//                                         )}
//                                     </label>
//                                 </div>

//                                 <div className="form-group">
//                                     <label className="form-label">
//                                         Job Title
//                                         <Controller
//                                             name={`experience.${index}.jobTitle`}
//                                             control={control}
//                                             rules={validation.experience.jobTitle}
//                                             render={({ field }) => (
//                                                 <input
//                                                     {...field}
//                                                     type="text"
//                                                     className={`form-input ${errors.experience?.[index]?.jobTitle ? 'error' : ''}`}
//                                                     placeholder="e.g., Senior Software Engineer"
//                                                 />
//                                             )}
//                                         />
//                                         {errors.experience?.[index]?.jobTitle && (
//                                             <span className="error-message">{errors.experience[index].jobTitle.message}</span>
//                                         )}
//                                     </label>
//                                 </div>

//                                 <div className="form-group">
//                                     <label className="form-label">
//                                         From Date
//                                         <Controller
//                                             name={`experience.${index}.fromDate`}
//                                             control={control}
//                                             rules={validation.experience.fromDate}
//                                             render={({ field }) => (
//                                                 <input
//                                                     {...field}
//                                                     type="month"
//                                                     className={`form-input ${errors.experience?.[index]?.fromDate ? 'error' : ''}`}
//                                                 />
//                                             )}
//                                         />
//                                         {errors.experience?.[index]?.fromDate && (
//                                             <span className="error-message">{errors.experience[index].fromDate.message}</span>
//                                         )}
//                                     </label>
//                                 </div>

//                                 <div className="form-group">
//                                     <label className="form-label">
//                                         To Date
//                                         <Controller
//                                             name={`experience.${index}.toDate`}
//                                             control={control}
//                                             render={({ field }) => (
//                                                 <input
//                                                     {...field}
//                                                     type="month"
//                                                     className={`form-input ${errors.experience?.[index]?.toDate ? 'error' : ''}`}
//                                                     disabled={currentlyWorking}
//                                                     placeholder={currentlyWorking ? "Present" : ""}
//                                                 />
//                                             )}
//                                         />
//                                     </label>
//                                 </div>
//                             </div>

//                             <div className="currently-working-group">
//                                 <Controller
//                                     name={`experience.${index}.currentlyWorking`}
//                                     control={control}
//                                     render={({ field }) => (
//                                         <label className="currently-working-label">
//                                             <input
//                                                 {...field}
//                                                 type="checkbox"
//                                                 className="currently-working-checkbox"
//                                                 checked={field.value}
//                                                 onChange={(e) => {
//                                                     field.onChange(e.target.checked);
//                                                     if (e.target.checked) {
//                                                         // Clear toDate if currently working
//                                                         const { setValue } = control;
//                                                         setValue(`experience.${index}.toDate`, "");
//                                                     }
//                                                 }}
//                                             />
//                                             Currently working here
//                                         </label>
//                                     )}
//                                 />
//                             </div>

//                             <div className="form-group">
//                                 <label className="form-label">
//                                     Responsibilities
//                                     <Controller
//                                         name={`experience.${index}.responsibilities`}
//                                         control={control}
//                                         rules={validation.experience.responsibilities}
//                                         render={({ field }) => (
//                                             <textarea
//                                                 {...field}
//                                                 className={`form-input textarea ${errors.experience?.[index]?.responsibilities ? 'error' : ''}`}
//                                                 placeholder="Describe your responsibilities and achievements"
//                                                 rows="3"
//                                             />
//                                         )}
//                                     />
//                                     {errors.experience?.[index]?.responsibilities && (
//                                         <span className="error-message">{errors.experience[index].responsibilities.message}</span>
//                                     )}
//                                 </label>
//                             </div>
//                         </div>
//                     </div>
//                 );
//             })}

//             <button
//                 type="button"
//                 className="add-btn"
//                 onClick={() => appendExperience({
//                     company: "",
//                     jobTitle: "",
//                     fromDate: "",
//                     toDate: "",
//                     responsibilities: "",
//                     currentlyWorking: false,
//                 })}
//             >
//                 + Add Another Position
//             </button>

//             <div className="section">
//                 <h3 className="section-title">Additional Information</h3>
//                 <div className="grid-2">
//                     <div className="form-group">
//                         <label className="form-label">
//                             Total Experience
//                             <Controller
//                                 name="totalExperience"
//                                 control={control}
//                                 rules={validation.totalExperience}
//                                 render={({ field }) => (
//                                     <div className="input-with-suffix">
//                                         <input
//                                             {...field}
//                                             type="number"
//                                             className={`form-input ${errors.totalExperience ? 'error' : ''}`}
//                                             placeholder="e.g., 3.5"
//                                             min="0"
//                                             max="50"
//                                             step="0.1"
//                                         />
//                                         <span className="input-suffix">years</span>
//                                     </div>
//                                 )}
//                             />
//                             {errors.totalExperience && (
//                                 <span className="error-message">{errors.totalExperience.message}</span>
//                             )}
//                         </label>
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">
//                             Skills
//                             <Controller
//                                 name="skills"
//                                 control={control}
//                                 rules={validation.skills}
//                                 render={({ field }) => (
//                                     <Select
//                                         isMulti
//                                         options={commonSkills.map(skill => ({ value: skill, label: skill }))}
//                                         placeholder="Type or select skills..."
//                                         value={field.value?.map(skill => ({ value: skill, label: skill }))}
//                                         onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
//                                         styles={customSelectStyles}
//                                         className={`custom-select ${errors.skills ? 'error' : ''}`}
//                                         classNamePrefix="select"
//                                     />
//                                 )}
//                             />
//                             {errors.skills && (
//                                 <span className="error-message">{errors.skills.message}</span>
//                             )}
//                         </label>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const getStepContent = (step) => {
//         switch (step) {
//             case 0: return renderPersonalInfo();
//             case 1: return renderEducation();
//             case 2: return renderExperience();
//             default: return null;
//         }
//     };

//     return (
//         <div className="add-candidate-container">
//             <div className="main-card">
//                 <div className="header">
//                     <h1 className="page-title">Add New Candidate</h1>
//                     <p className="page-subtitle">
//                         Complete the following steps to add a new candidate to the system
//                     </p>
//                 </div>

//                 <div className="stepper">
//                     {steps.map((label, index) => (
//                         <div key={label} className="stepper-step">
//                             <div className={`step-indicator ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}>
//                                 {index < activeStep ? '✓' : index + 1}
//                             </div>
//                             <div className="step-label">{label}</div>
//                             {index < steps.length - 1 && <div className="step-line"></div>}
//                         </div>
//                     ))}
//                 </div>

//                 <div className="step-content">
//                     {getStepContent(activeStep)}
//                 </div>

//                 <div className="action-buttons">
//                     <button
//                         type="button"
//                         className="btn btn-outline"
//                         onClick={handleBack}
//                         disabled={activeStep === 0}
//                     >
//                         ← Back
//                     </button>

//                     <div className="right-actions">
//                         {activeStep === steps.length - 1 ? (
//                             <>
//                                 <button
//                                     type="button"
//                                     className="btn btn-outline"
//                                     onClick={handleReset}
//                                 >
//                                     Reset
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="btn btn-primary"
//                                     onClick={handleSubmit(onSubmit)}
//                                     disabled={mutation.isLoading}
//                                 >
//                                     {mutation.isLoading ? 'Submitting...' : 'Submit Application'}
//                                 </button>
//                             </>
//                         ) : (
//                             <button
//                                 type="button"
//                                 className="btn btn-primary"
//                                 onClick={handleNext}
//                             >
//                                 Continue →
//                             </button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddCandidate;