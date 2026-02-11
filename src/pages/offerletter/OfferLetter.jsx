// import React, { useEffect, useState } from 'react';
// import apiPath from '../../api/apiPath';
// import { apiPost, apiGet } from '../../api/apiFetch';
// import './OfferLetter.css';
// import { useQuery } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft } from 'react-icons/fa';
// import toast from 'react-hot-toast';
// import { RiAiGenerate } from "react-icons/ri";



// export default function OfferLetter() {
//   const [formData, setFormData] = useState({
//     candidateName: '',
//     position: 'Software Engineer',
//     joiningDate: '31/03/2023',
//     reportingManager: '',
//     basicSalary: 200000,
//     houseRentAllowance: 0,
//     specialAllowance: 0,
//     annualBonus: 0,
//     probationPeriod: 3,
//     noticePeriod: 2,
//     specialRemarks: '',
//   });
//   // const [jobId,setJobId] = useState("");
//   // console.log("jobId",jobId);
//   const navigate = useNavigate();
//   console.log("formdata", formData);

//   const [loading, setLoading] = useState(false);
//   const { data, isLoading, isError, error } = useQuery({
//     queryKey: ["candidatesdata"],
//     queryFn: () => apiGet(`${apiPath.CANDIDATES}?limit=100`),
//   });

//   // if (isLoading) {
//   //   return <p>Loading candidates...</p>;
//   // }

//   // if (isError) {
//   //   return <p>Error: {error.message}</p>;
//   // }

//   // console.log("candidates", data.data);
//   const candidates = data?.data;
//   console.log("candidates", candidates);

//   const selectPosition = candidates?.find((can) => can?.fullName === formData?.candidateName);
//   const jobId = selectPosition?.jobId?._id;
//   const candidateId = selectPosition?._id;
//   console.log("candidateId", candidateId);
//   console.log("jobid", jobId);
//   // useEffect(()=>
//   // {
//   //   setJobId(selectPosition?.jobId?._id);
//   // },[selectPosition])
//   console.log("selectedposition", selectPosition);


//   // const candidates = [
//   //   {
//   //     fullName: "yogesh"
//   //   },
//   //   {
//   //     fullName: "nitin"
//   //   }
//   // ]

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'basicSalary' || name === 'houseRentAllowance' || name === 'specialAllowance' || name === 'annualBonus'
//         ? parseFloat(value) || 0
//         : value
//     }));
//   };

//   const calculateMonthlyGross = () => {
//     return (formData.basicSalary + formData.houseRentAllowance + formData.specialAllowance + formData.annualBonus) / 12;
//   };

//   const calculateTotalCTC = () => {
//     // const monthlyGross = calculateMonthlyGross();
//     return (formData.annualBonus + formData.houseRentAllowance + formData.specialAllowance + formData.basicSalary);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         jobId,
//         candidateId
//         // monthlyGrossSalary: calculateMonthlyGross(),
//         // totalCTC: calculateTotalCTC()
//       };
//       const response = await apiPost(apiPath.offerLetters, payload);
//       // console.log("res", response);
//       // alert('Offer letter generated successfully!');
//       toast.success('Offer letter generated successfully!');
//       navigate(-1);

//     } catch (error) {
//       // alert('Error generating offer letter');
//       toast.error(error?.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePreview = () => {
//     // For preview, we'll just log the data
//     const previewData = {
//       ...formData,
//       monthlyGrossSalary: calculateMonthlyGross(),
//       totalCTC: calculateTotalCTC()
//     };
//     console.log('Preview Data:', previewData);
//     alert('Check console for preview data or implement modal preview');
//   };

//   return (
//     <div className="offer-letter-container">
//       <button
//         className="bg-gray-200 flex items-center gap-2 py-1 px-3 rounded cursor-pointer"
//         onClick={() => navigate(-1)}
//       >
//         <FaArrowLeft /> Go Back
//       </button>
//       <div className="header-section">

//         <h1 className="page-title">Create  Offer Letter</h1>
//         <p className="page-subtitle">Generate professional offer letters for selected candidates</p>
//       </div>

//       <div className="offer-letter-content">
//         <div className="form-section">
//           <div className="card">
//             <div className="card-header">
//               <h2>Candidate Information</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit}>
//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label htmlFor="candidateName">
//                       Select Candidate <span className="required">*</span>
//                     </label>
//                     {/* <input
//                       type="text"
//                       id="candidate"
//                       name="candidate"
//                       value={formData.candidate}
//                       onChange={handleChange}
//                       placeholder="Search and select candidate..."
//                       className="form-control"
//                       required
//                     /> */}
//                     <select
//                       name="candidateName"
//                       value={formData.candidateName}
//                       onChange={handleChange}
//                       className="form-control"
//                       required
//                     >
//                       <option value="">Select Candidate</option>

//                       {candidates?.map((item) => (
//                         <option key={item._id} value={item.fullName}>
//                           {item.fullName}
//                         </option>
//                       ))}
//                     </select>

//                   </div>
//                   {/* 
//                   <div className="form-group">
//                     <label htmlFor="position">
//                       Position <span className="required">*</span>
//                     </label>
//                     <select
//                       id="position"
//                       name="position"
//                       value={formData.position}
//                       onChange={handleChange}
//                       className="form-control"
//                       required
//                     >
//                       <option value="Software Engineer">Software Engineer</option>
//                       <option value="Senior Software Engineer">Senior Software Engineer</option>
//                       <option value="Team Lead">Team Lead</option>
//                       <option value="Project Manager">Project Manager</option>
//                       <option value="Product Manager">Product Manager</option>
//                     </select>
//                   </div> */}

//                   <div className="form-group">
//                     <label htmlFor="reportingManager">
//                       Position  <span className="required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="reportingManager"
//                       name="reportingManager"
//                       value={selectPosition?.jobId?.title}
//                       onChange={handleChange}
//                       placeholder="Enter position of candidate"
//                       className="form-control disabled"
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="fathersname">
//                       Father's Name  <span className="required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="fatherName"
//                       name="fatherName"
//                       // value={}
//                       onChange={handleChange}
//                       placeholder="Enter fathers name of candidate"
//                       className="form-control disabled"
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label htmlFor="joiningDate">
//                       Joining Date <span className="required">*</span>
//                     </label>
//                     <input
//                       type="date"
//                       id="joiningDate"
//                       name="joiningDate"
//                       value={formData.joiningDate}
//                       onChange={handleChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="reportingManager">
//                       Reporting Manager <span className="required">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       id="reportingManager"
//                       name="reportingManager"
//                       value={formData.reportingManager}
//                       onChange={handleChange}
//                       placeholder="Enter reporting manager name"
//                       className="form-control"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="section-divider">
//                   <span>Salary Components (Yearly)</span>
//                 </div>

//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label htmlFor="basicSalary">Basic Salary (yearly)</label>
//                     <div className="input-group">
//                       <span className="input-group-text">₹</span>
//                       <input
//                         type="number"
//                         id="basicSalary"
//                         name="basicSalary"
//                         value={formData.basicSalary}
//                         onChange={handleChange}
//                         className="form-control"
//                         min="0"
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="houseRentAllowance">HRA (House Rent Allowance, yearly)</label>
//                     <div className="input-group">
//                       <span className="input-group-text">₹</span>
//                       <input
//                         type="number"
//                         id="houseRentAllowance"
//                         name="houseRentAllowance"
//                         value={formData.houseRentAllowance}
//                         onChange={handleChange}
//                         className="form-control"
//                         min="0"
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="specialAllowance">Special Allowance (yearly)</label>
//                     <div className="input-group">
//                       <span className="input-group-text">₹</span>
//                       <input
//                         type="number"
//                         id="specialAllowance"
//                         name="specialAllowance"
//                         value={formData.specialAllowance}
//                         onChange={handleChange}
//                         className="form-control"
//                         min="0"
//                       />
//                     </div>
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="annualBonus">Annual Bonus (yearly)</label>
//                     <div className="input-group">
//                       <span className="input-group-text">₹</span>
//                       <input
//                         type="number"
//                         id="annualBonus"
//                         name="annualBonus"
//                         value={formData.annualBonus}
//                         onChange={handleChange}
//                         className="form-control"
//                         min="0"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ctc-summary">
//                   <div className="ctc-item">
//                     <span className="ctc-label">Monthly Gross Salary:</span>
//                     <span className="ctc-value">₹ {calculateMonthlyGross().toLocaleString()}</span>
//                   </div>
//                   <div className="ctc-item">
//                     <span className="ctc-label">Annual Bonus:</span>
//                     <span className="ctc-value">₹ {formData.annualBonus.toLocaleString()}</span>
//                   </div>
//                   <div className="ctc-item total">
//                     <span className="ctc-label">Total Annual CTC:</span>
//                     <span className="ctc-value">₹ {calculateTotalCTC().toLocaleString()}</span>
//                   </div>
//                 </div>

//                 <div className="section-divider">
//                   <span>Additional Terms & Conditions</span>
//                 </div>

//                 <div className="form-grid">
//                   <div className="form-group">
//                     <label htmlFor="probationPeriod">Probation Period (Months)</label>
//                     <input
//                       type="number"
//                       id="probationPeriod"
//                       name="probationPeriod"
//                       value={formData.probationPeriod}
//                       onChange={handleChange}
//                       placeholder="e.g., 3"
//                       className="form-control"
//                       min="0"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label htmlFor="noticePeriod">Notice Period (Months)</label>
//                     <input
//                       type="number"
//                       id="noticePeriod"
//                       name="noticePeriod"
//                       value={formData.noticePeriod}
//                       onChange={handleChange}
//                       placeholder="e.g., 2"
//                       className="form-control"
//                       min="0"
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="specialRemarks">Special Remarks (Optional)</label>
//                   <textarea
//                     id="specialRemarks"
//                     name="specialRemarks"
//                     value={formData.specialRemarks}
//                     onChange={handleChange}
//                     placeholder="Add any special terms or conditions..."
//                     className="form-control"
//                     rows="4"
//                   />
//                 </div>

//                 <div className="flex justify-end mt-3">
//                   {/* <button
//                     type="button"
//                     onClick={handlePreview}
//                     className="btn btn-secondary"
//                     disabled={loading}
//                   >
//                     Preview
//                   </button> */}
//                   <button
//                     type="submit"
//                     className="flex justify-center items-center cursor-pointer px-4 py-2 rounded btn-primary"
//                     disabled={loading}
//                   >
//                <RiAiGenerate className="mr-2" />     {loading ? 'Generating...' : 'Generate Offer Letter'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>

      
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select';
import apiPath from '../../api/apiPath';
import { apiPost, apiGet } from '../../api/apiFetch';
import './OfferLetter.css';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { RiAiGenerate } from "react-icons/ri";

export default function OfferLetter() {
  const [formData, setFormData] = useState({
    candidateName: '',
    position: 'Software Engineer',
    joiningDate: '31/03/2023',
    reportingManager: '',
    basicSalary: 200000,
    houseRentAllowance: 0,
    specialAllowance: 0,
    annualBonus: 0,
    probationPeriod: 3,
    noticePeriod: 2,
    specialRemarks: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch candidates with pagination or search
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["candidatesdata"],
       queryFn: () => apiGet(`${apiPath.CANDIDATES}?limit=100`),
// Increased limit
  });

  // Memoize candidates data for better performance
  const candidates = useMemo(() => {
    return data?.data || [];
  }, [data]);

  // Format candidates for react-select
  const candidateOptions = useMemo(() => {
    return candidates.map(candidate => ({
      value: candidate.fullName,
      label: candidate.fullName,
      candidateData: candidate // Store full candidate data for easy access
    }));
  }, [candidates]);

  // Find selected candidate
  const selectedCandidate = useMemo(() => {
    return candidates.find(can => can?.fullName === formData?.candidateName);
  }, [candidates, formData.candidateName]);

  const jobId = selectedCandidate?.jobId?._id;
  const candidateId = selectedCandidate?._id;

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setFormData(prev => ({
        ...prev,
        candidateName: selectedOption.value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        candidateName: ''
      }));
    }
  };

  // Custom styles for react-select
  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      maxHeight: '300px',
      overflowY: 'auto'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white'
      }
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: '#6b7280',
      padding: '10px'
    }),
    loadingMessage: (base) => ({
      ...base,
      color: '#6b7280',
      padding: '10px'
    })
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basicSalary' || name === 'houseRentAllowance' || name === 'specialAllowance' || name === 'annualBonus'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const calculateMonthlyGross = () => {
    return (formData.basicSalary + formData.houseRentAllowance + formData.specialAllowance + formData.annualBonus) / 12;
  };

  const calculateTotalCTC = () => {
    return (formData.annualBonus + formData.houseRentAllowance + formData.specialAllowance + formData.basicSalary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.candidateName) {
      toast.error('Please select a candidate');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        jobId,
        candidateId
      };
      const response = await apiPost(apiPath.offerLetters, payload);
      toast.success('Offer letter generated successfully!');
      navigate(-1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error generating offer letter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-letter-container">
      <button
        className="bg-gray-200 flex items-center gap-2 py-1 px-3 rounded cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Go Back
      </button>
      <div className="header-section">
        <h1 className="page-title">Create Offer Letter</h1>
        <p className="page-subtitle">Generate professional offer letters for selected candidates</p>
      </div>

      <div className="offer-letter-content">
        <div className="form-section">
          <div className="card">
            <div className="card-header">
              <h2>Candidate Information</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="candidateName">
                      Select Candidate <span className="required">*</span>
                    </label>
                    <Select
                      id="candidateName"
                      name="candidateName"
                      value={candidateOptions.find(option => option.value === formData.candidateName)}
                      onChange={handleSelectChange}
                      options={candidateOptions}
                      isClearable
                      isSearchable
                      placeholder="Search and select candidate..."
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={customStyles}
                      isLoading={isLoading}
                      loadingMessage={() => "Loading candidates..."}
                      noOptionsMessage={() => "No candidates found"}
                      required
                    />
                    {isLoading && <p className="text-sm text-gray-500 mt-1">Loading candidates...</p>}
                    {isError && <p className="text-sm text-red-500 mt-1">Error: {error.message}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="position">
                      Position  <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={selectedCandidate?.jobId?.title || ''}
                      readOnly
                      className="form-control disabled"
                      placeholder="Position will auto-populate"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="fatherName">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      // You might want to add father's name to your candidate data
                      // value={selectedCandidate?.fatherName || ''}
                      onChange={handleChange}
                      placeholder="Enter father's name"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="joiningDate">
                      Joining Date <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="joiningDate"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reportingManager">
                      Reporting Manager <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="reportingManager"
                      name="reportingManager"
                      value={formData.reportingManager}
                      onChange={handleChange}
                      placeholder="Enter reporting manager name"
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                {/* Rest of your form remains the same */}
                <div className="section-divider">
                  <span>Salary Components (Yearly)</span>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="basicSalary">Basic Salary (yearly)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        id="basicSalary"
                        name="basicSalary"
                        value={formData.basicSalary}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="houseRentAllowance">HRA (House Rent Allowance, yearly)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        id="houseRentAllowance"
                        name="houseRentAllowance"
                        value={formData.houseRentAllowance}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialAllowance">Special Allowance (yearly)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        id="specialAllowance"
                        name="specialAllowance"
                        value={formData.specialAllowance}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="annualBonus">Annual Bonus (yearly)</label>
                    <div className="input-group">
                      <span className="input-group-text">₹</span>
                      <input
                        type="number"
                        id="annualBonus"
                        name="annualBonus"
                        value={formData.annualBonus}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="ctc-summary">
                  <div className="ctc-item">
                    <span className="ctc-label">Monthly Gross Salary:</span>
                    <span className="ctc-value">₹ {calculateMonthlyGross().toLocaleString()}</span>
                  </div>
                  <div className="ctc-item">
                    <span className="ctc-label">Annual Bonus:</span>
                    <span className="ctc-value">₹ {formData.annualBonus.toLocaleString()}</span>
                  </div>
                  <div className="ctc-item total">
                    <span className="ctc-label">Total Annual CTC:</span>
                    <span className="ctc-value">₹ {calculateTotalCTC().toLocaleString()}</span>
                  </div>
                </div>

                <div className="section-divider">
                  <span>Additional Terms & Conditions</span>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="probationPeriod">Probation Period (Months)</label>
                    <input
                      type="number"
                      id="probationPeriod"
                      name="probationPeriod"
                      value={formData.probationPeriod}
                      onChange={handleChange}
                      placeholder="e.g., 3"
                      className="form-control"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="noticePeriod">Notice Period (Months)</label>
                    <input
                      type="number"
                      id="noticePeriod"
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleChange}
                      placeholder="e.g., 2"
                      className="form-control"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRemarks">Special Remarks (Optional)</label>
                  <textarea
                    id="specialRemarks"
                    name="specialRemarks"
                    value={formData.specialRemarks}
                    onChange={handleChange}
                    placeholder="Add any special terms or conditions..."
                    className="form-control"
                    rows="4"
                  />
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="submit"
                    className="flex justify-center items-center cursor-pointer px-4 py-2 rounded btn-primary"
                    disabled={loading || isLoading}
                  >
                    <RiAiGenerate className="mr-2" />     
                    {loading ? 'Generating...' : 'Generate Offer Letter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}