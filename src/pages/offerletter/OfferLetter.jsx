import React, { useState } from 'react';
import apiPath from '../../api/apiPath';
import { apiPost,apiGet } from '../../api/apiFetch';
import './OfferLetter.css';
import { useQuery } from '@tanstack/react-query';


export default function OfferLetter() {
  const [formData, setFormData] = useState({
    candidate: '',
    position: 'Software Engineer',
    joiningDate: '31/03/2023',
    reportingManager: '',
    basicSalary: 20000,
    hra: 0,
    specialAllowance: 0,
    annualBonus: 0,
    probationPeriod: 3,
    noticePeriod: 2,
    specialRemarks: '',
  });

  const [loading, setLoading] = useState(false);
const { data, isLoading, isError, error } = useQuery({
  queryKey: ["candidatesdata"],
  queryFn: () => apiGet(apiPath.CANDIDATES)
});

if (isLoading) {
  return <p>Loading candidates...</p>;
}

if (isError) {
  return <p>Error: {error.message}</p>;
}

// console.log("candidates", data.data);
const candidates= data?.data;
console.log("candidates",candidates);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'basicSalary' || name === 'hra' || name === 'specialAllowance' || name === 'annualBonus'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const calculateMonthlyGross = () => {
    return formData.basicSalary + formData.hra + formData.specialAllowance;
  };

  const calculateTotalCTC = () => {
    const monthlyGross = calculateMonthlyGross();
    return (monthlyGross * 12) + formData.annualBonus;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        monthlyGrossSalary: calculateMonthlyGross(),
        totalCTC: calculateTotalCTC()
      };
      const response = await apiPost(apiPath.offerLetters, payload);
      alert('Offer letter generated successfully!');
    } catch (error) {
      alert('Error generating offer letter');
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
                    <label htmlFor="candidate">
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
                      id="position"
                      name="candidate"
                      value={formData.candidate}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="Software Engineer">Software Engineer</option>
                      {
                        candidates?.map((item,index)=>
                        {
                    return     <option value={item.fullName}>{item?.fullName} </option>
                      // <option value="Team Lead">Team Lead</option>
                      // <option value="Project Manager">Project Manager</option>
                      // <option value="Product Manager">Product Manager</option>
                        })
                      }
                    </select>
                  </div>

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
                  <span>Salary Components (Monthly)</span>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="basicSalary">Basic Salary</label>
                    <div className="input-group">
                      <span className="input-group-text">£</span>
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
                    <label htmlFor="hra">HRA (House Rent Allowance)</label>
                    <div className="input-group">
                      <span className="input-group-text">£</span>
                      <input
                        type="number"
                        id="hra"
                        name="hra"
                        value={formData.hra}
                        onChange={handleChange}
                        className="form-control"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialAllowance">Special Allowance</label>
                    <div className="input-group">
                      <span className="input-group-text">£</span>
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
                    <label htmlFor="annualBonus">Annual Bonus</label>
                    <div className="input-group">
                      <span className="input-group-text">£</span>
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
                    <span className="ctc-value">£ {calculateMonthlyGross().toLocaleString()}</span>
                  </div>
                  <div className="ctc-item">
                    <span className="ctc-label">Annual Bonus:</span>
                    <span className="ctc-value">£ {formData.annualBonus.toLocaleString()}</span>
                  </div>
                  <div className="ctc-item total">
                    <span className="ctc-label">Total Annual CTC:</span>
                    <span className="ctc-value">£ {calculateTotalCTC().toLocaleString()}</span>
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

                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="btn btn-secondary"
                    disabled={loading}
                  >
                    Preview
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Generating...' : 'Generate Offer Letter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="preview-section">
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
                          <td>HRA</td>
                          <td>£ {formData.hra.toLocaleString()}</td>
                          <td>£ {(formData.hra * 12).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Special Allowance</td>
                          <td>£ {formData.specialAllowance.toLocaleString()}</td>
                          <td>£ {(formData.specialAllowance * 12).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Annual Bonus</td>
                          <td>—</td>
                          <td>£ {formData.annualBonus.toLocaleString()}</td>
                        </tr>
                        <tr className="total-row">
                          <td><strong>Total CTC</strong></td>
                          <td><strong>£ {calculateMonthlyGross().toLocaleString()}</strong></td>
                          <td><strong>£ {calculateTotalCTC().toLocaleString()}</strong></td>
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
        </div>
      </div>
    </div>
  );
}