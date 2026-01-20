// src/validation/addCandidate.validation.js
// import helpers from "utils/helpers"; // optional
// import { useTranslation } from "react-i18next"; // optional

const AddCandidateValidation = () => {
    // const { t } = useTranslation(); // enable later if needed

    return {
        personalInfo: {
            fullName: {
                required: "Full name is required",
                minLength: {
                    value: 2,
                    message: "Minimum 2 characters required",
                },
                validate: {
                    noOnlySpaces: (v) => v.trim() !== "" || "Only spaces are not allowed",
                },
            },

            email: {
                required: "Email is required",
                pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                },
            },

            phone: {
                required: "Phone number is required",
            },

            dateOfBirth: {
                required: "Date of birth is required",
                validate: {
                    isAdult: (value) => {
                        if (!value) return true; // required handles empty case

                        const today = new Date();
                        const dob = new Date(value);

                        let age = today.getFullYear() - dob.getFullYear();
                        const monthDiff = today.getMonth() - dob.getMonth();

                        if (
                            monthDiff < 0 ||
                            (monthDiff === 0 && today.getDate() < dob.getDate())
                        ) {
                            age--;
                        }

                        return age >= 18 || "Candidate must be at least 18 years old";
                    },
                },
            },


            gender: {
                required: "Gender is required",
            },

            position: {
                required: "Position is required",
            },

            address: {
                required: "Address is required",
                minLength: {
                    value: 10,
                    message: "Address must be at least 10 characters",
                },
            },
        },

        education: {
            degree: {
                required: "Degree is required",
            },
            institution: {
                required: "Institution name is required",
            },
            yearOfPassing: {
                required: "Year of passing is required",
                pattern: {
                    value: /^[0-9]{4}$/,
                    message: "Enter a valid 4 digit year",
                },
                validate: (value) => {
                    const year = parseInt(value);
                    const currentYear = new Date().getFullYear();
                    return (
                        (year >= 1900 && year <= currentYear + 5) ||
                        `Year must be between 1900 and ${currentYear + 5}`
                    );
                },
            },
            percentage: {
                required: "Percentage is required",
                min: { value: 0, message: "Cannot be negative" },
                max: { value: 100, message: "Cannot exceed 100" },
            },
        },

        experience: {
            company: {
                required: "Company name is required",
            },
            jobTitle: {
                required: "Job title is required",
            },
            fromDate: {
                required: "From date is required",
            },
            responsibilities: {
                required: "Responsibilities are required",
                minLength: {
                    value: 5,
                    message: "Minimum 5 characters required",
                },
            },
        },

        totalExperience: {
            required: "Total experience is required",
            min: { value: 0, message: "Cannot be negative" },
            max: { value: 50, message: "Cannot exceed 50 years" },
        },

        skills: {
            required: "At least one skill is required",
            validate: (v) =>
                v && v.length > 0 ? true : "At least one skill is required",
        },
    };
};

export default AddCandidateValidation;
