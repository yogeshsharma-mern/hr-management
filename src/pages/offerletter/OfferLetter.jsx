import React, { useEffect, useState } from 'react';
import apiPath from '../../api/apiPath';
import { apiPost, apiGet } from '../../api/apiFetch';
import './OfferLetter.css';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';


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
  // const [jobId,setJobId] = useState("");
  // console.log("jobId",jobId);
  const navigate = useNavigate();
  console.log("formdata", formData);

  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["candidatesdata"],
    queryFn: () => apiGet(apiPath.CANDIDATES)
  });

  // if (isLoading) {
  //   return <p>Loading candidates...</p>;
  // }

  // if (isError) {
  //   return <p>Error: {error.message}</p>;
  // }

  // console.log("candidates", data.data);
  const candidates = data?.data;
  console.log("candidates", candidates);

  const selectPosition = candidates?.find((can) => can?.fullName === formData?.candidateName);
  const jobId = selectPosition?.jobId?._id;
  const candidateId = selectPosition?._id;
  console.log("candidateId", candidateId);
  console.log("jobid", jobId);
  // useEffect(()=>
  // {
  //   setJobId(selectPosition?.jobId?._id);
  // },[selectPosition])
  console.log("selectedposition", selectPosition);


  // const candidates = [
  //   {
  //     fullName: "yogesh"
  //   },
  //   {
  //     fullName: "nitin"
  //   }
  // ]

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
    // const monthlyGross = calculateMonthlyGross();
    return (formData.annualBonus + formData.houseRentAllowance + formData.specialAllowance + formData.basicSalary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        jobId,
        candidateId
        // monthlyGrossSalary: calculateMonthlyGross(),
        // totalCTC: calculateTotalCTC()
      };
      const response = await apiPost(apiPath.offerLetters, payload);
      console.log("res", res);
      // alert('Offer letter generated successfully!');
      toast.success(response?.data);
      navigate(-1);

    } catch (error) {
      // alert('Error generating offer letter');
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // For preview, we'll just log the data
    const previewData = {
      ...formData,
      monthlyGrossSalary: calculateMonthlyGross(),
      totalCTC: calculateTotalCTC()
    };
    console.log('Preview Data:', previewData);
    alert('Check console for preview data or implement modal preview');
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

        <h1 className="page-title">Create and Send Offer Letters</h1>
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
                    {/* <input
                      type="text"
                      id="candidate"
                      name="candidate"
                      value={formData.candidate}
                      onChange={handleChange}
                      placeholder="Search and select candidate..."
                      className="form-control"
                      required
                    /> */}
                    <select
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select Candidate</option>

                      {candidates?.map((item) => (
                        <option key={item._id} value={item.fullName}>
                          {item.fullName}
                        </option>
                      ))}
                    </select>

                  </div>
                  {/* 
                  <div className="form-group">
                    <label htmlFor="position">
                      Position <span className="required">*</span>
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      <option value="Senior Software Engineer">Senior Software Engineer</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Product Manager">Product Manager</option>
                    </select>
                  </div> */}

                  <div className="form-group">
                    <label htmlFor="reportingManager">
                      Position  <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="reportingManager"
                      name="reportingManager"
                      value={selectPosition?.jobId?.title}
                      onChange={handleChange}
                      placeholder="Enter position of candidate"
                      className="form-control disabled"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fathersname">
                      Father's Name  <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      // value={}
                      onChange={handleChange}
                      placeholder="Enter fathers name of candidate"
                      className="form-control disabled"
                      required
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
                  {/* <button
                    type="button"
                    onClick={handlePreview}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Preview
                  </button> */}
                  <button
                    type="submit"
                    className="flex justify-center items-center cursor-pointer px-4 py-2 rounded btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Offer Letter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <div className="preview-section">
          <div className="card preview-card">
            <div className="card-header">
              <h2>Offer Letter Preview</h2>
            </div>
            <div className="card-body">
              <div className="offer-letter-preview">
                <div className="letter-header">
                  <div className="company-logo">
                    <div className="logo-placeholder">🏢</div>
                    <h3>HRMS Portal</h3>
                  </div>
                  <div className="letter-title">
                    <h1>OFFER LETTER</h1>
                    <p className="letter-date">{new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>

                <div className="letter-content">
                  <div className="candidate-info">
                    <p><strong>Dear {formData.candidate || '[Candidate Name]'},</strong></p>
                    <p>
                      We are pleased to offer you the position of <strong>{formData.position}</strong>
                      at HRMS Portal. This letter outlines the terms and conditions of your employment.
                    </p>
                  </div>

                  <div className="terms-section">
                    <h3>Employment Terms</h3>
                    <ul>
                      <li>
                        <strong>Position:</strong> {formData.position}
                      </li>
                      <li>
                        <strong>Joining Date:</strong> {formData.joiningDate}
                      </li>
                      <li>
                        <strong>Reporting Manager:</strong> {formData.reportingManager || '[Manager Name]'}
                      </li>
                      <li>
                        <strong>Probation Period:</strong> {formData.probationPeriod} months
                      </li>
                      <li>
                        <strong>Notice Period:</strong> {formData.noticePeriod} months
                      </li>
                    </ul>
                  </div>

                  <div className="salary-section">
                    <h3>Compensation Details</h3>
                    <table className="salary-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Monthly</th>
                          <th>Annual</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Basic Salary</td>
                          <td>£ {formData.basicSalary.toLocaleString()}</td>
                          <td>£ {(formData.basicSalary * 12).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>houseRentAllowance</td>
                          <td>₹ {formData.houseRentAllowance.toLocaleString()}</td>
                          <td>₹ {(formData.houseRentAllowance * 12).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Special Allowance</td>
                          <td>₹ {formData.specialAllowance.toLocaleString()}</td>
                          <td>₹ {(formData.specialAllowance * 12).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Annual Bonus</td>
                          <td>—</td>
                          <td>₹ {formData.annualBonus.toLocaleString()}</td>
                        </tr>
                        <tr className="total-row">
                          <td><strong>Total CTC</strong></td>
                          <td><strong>₹ {calculateMonthlyGross().toLocaleString()}</strong></td>
                          <td><strong>₹ {calculateTotalCTC().toLocaleString()}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {formData.specialRemarks && (
                    <div className="remarks-section">
                      <h3>Additional Remarks</h3>
                      <p>{formData.specialRemarks}</p>
                    </div>
                  )}

                  <div className="closing-section">
                    <p>
                      We look forward to welcoming you to our team and are confident that you will
                      make valuable contributions to our company.
                    </p>
                    <br />
                    <p>Sincerely,</p>
                    <br />
                    <p><strong>HR Department</strong></p>
                    <p>HRMS Portal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}