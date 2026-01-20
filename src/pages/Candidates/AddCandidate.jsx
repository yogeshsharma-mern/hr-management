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
import { apiPost } from "../../api/apiFetch";
import apiPath from "../../api/apiPath";
import AddCandidateValidation from "../../validation/addCandidate.validation";


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
                address: "",
            },
            education: [
                {
                    degree: "",
                    institution: "",
                    specialization: "",
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
        onSuccess: () => {
            queryClient.invalidateQueries(["candidates"]);
            alert("Candidate added successfully!");
            handleReset();
        },
        onError: (error) => {
            alert(`Error adding candidate: ${error.message}`);
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

    const onSubmit = (data) => {
        console.log("data",data);
        const formattedData = {
            ...data,
            personalInfo: {
                ...data.personalInfo,
                dateOfBirth: data.personalInfo.dateOfBirth
                    ? new Date(data.personalInfo.dateOfBirth).toISOString()
                    : null,
            },
            education: data.education.map((edu) => ({
                ...edu,
                yearOfPassing: parseInt(edu.yearOfPassing) || 0,
                percentage: parseFloat(edu.percentage) || 0,
            })),
            experience: data.experience.map((exp) => ({
                ...exp,
                fromDate: exp.fromDate ? new Date(exp.fromDate).toISOString() : null,
                toDate: exp.toDate ? new Date(exp.toDate).toISOString() : null,
            })),
            totalExperience: parseFloat(data.totalExperience) || 0,
        };

        mutation.mutate(formattedData);
    };

    const renderPersonalInfo = () => (
        <StepContainer title="Personal Information">
            <FormSection spacing={3}>

                {/* Basic Info */}
                <FieldWrapper md={6}>
                    <Controller
                        name="personalInfo.fullName"
                        control={control}
                        rules={validation.personalInfo.fullName}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Full Name"
                                error={!!errors.personalInfo?.fullName}
                                helperText={errors.personalInfo?.fullName?.message}
                            />
                        )}
                    />
                </FieldWrapper>

                <FieldWrapper md={6}>
                    <Controller
                        name="personalInfo.email"
                        control={control}
                        rules={validation.personalInfo.email}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email Address"
                                error={!!errors.personalInfo?.email}
                                helperText={errors.personalInfo?.email?.message}
                            />
                        )}
                    />
                </FieldWrapper>

                {/* Contact Info */}
                <FieldWrapper md={6}>
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
                                    />
                                </Box>
                                <FormHelperText>
                                    {errors.personalInfo?.phone?.message}
                                </FormHelperText>
                            </FormControl>
                        )}
                    />
                </FieldWrapper>

                <FieldWrapper md={6}>
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
                                            error={!!errors.personalInfo?.dateOfBirth}
                                            helperText={errors.personalInfo?.dateOfBirth?.message}
                                        />
                                    )}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </FieldWrapper>

                {/* Selection */}
                {/* Selection */}
                {/* Selection */}
                {/* Selection */}
                <FieldWrapper xs={12} md={6}>
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
                                    {...field}
                                    options={genderOptions}
                                    placeholder="Select Gender"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={genderOptions.find(opt => opt.value === field.value)}
                                    styles={{
                                        container: (base) => ({ ...base, width: "100%" }),
                                        control: (base) => ({
                                            ...base,
                                            minHeight: 56,
                                            borderRadius: 4,
                                        }),
                                    }}
                                />
                                <FormHelperText error>
                                    {errors.personalInfo?.gender?.message}
                                </FormHelperText>
                            </Box>
                        )}
                    />
                </FieldWrapper>

                <FieldWrapper xs={12} md={6}>
                    <Controller
                        name="personalInfo.position"
                        control={control}
                        rules={validation.personalInfo.position}
                        render={({ field }) => (
                            <Box>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    Position Applied
                                </Typography>
                                <Select
                                    {...field}
                                    options={positions.map(p => ({ label: p, value: p }))}
                                    placeholder="Select Position"
                                    onChange={(option) => field.onChange(option?.value)}
                                    value={
                                        positions
                                            .map(p => ({ label: p, value: p }))
                                            .find(opt => opt.value === field.value)
                                    }
                                    styles={{
                                        container: (base) => ({ ...base, width: "100%" }),
                                        control: (base) => ({
                                            ...base,
                                            minHeight: 56,
                                            borderRadius: 4,
                                        }),
                                    }}
                                />
                                <FormHelperText error>
                                    {errors.personalInfo?.position?.message}
                                </FormHelperText>
                            </Box>
                        )}
                    />
                </FieldWrapper>






                {/* Address */}
                <FieldWrapper xs={12}>
                    <Controller
                        name="personalInfo.address"
                        control={control}
                        rules={validation.personalInfo.address}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                multiline
                                rows={3}
                                label="Current Address"
                                error={!!errors.personalInfo?.address}
                                helperText={errors.personalInfo?.address?.message}
                            />
                        )}
                    />
                </FieldWrapper>

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
                                    name={`education.${index}.degree`}
                                    control={control}
                                    rules={validation.education.degree}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            label="Degree/Qualification"
                                            variant="outlined"
                                            size="small"
                                            error={!!errors.education?.[index]?.degree}
                                            helperText={errors.education?.[index]?.degree?.message}
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

                            <FieldWrapper xs={12} md={6}>
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
                            </FieldWrapper>

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
                        degree: "",
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
                Add Another Degree
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