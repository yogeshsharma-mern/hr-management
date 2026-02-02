export const validateJobForm = (formData) => {
    const errors = {};

    if (!formData.title.trim()) {
        errors.title = "Job title is required";
    } else if (formData.title.length < 3) {
        errors.title = "Job title must be at least 3 characters";
    }

    if (!formData.department) {
        errors.department = "Department is required";
    }

    if (!formData.location) {
        errors.location = "Location is required";
    }

    if (!formData.noOfOpenings) {
        errors.noOfOpenings = "Number of openings is required";
    } else if (Number(formData.noOfOpenings) < 1) {
        errors.noOfOpenings = "Openings must be at least 1";
    }
    if (!formData.description.trim()) {
        errors.description = "Description is required"
    }
    else if (formData.description && formData.description.length < 10) {
        errors.description = "Description must be at least 10 characters";
    }

    return errors;
};
