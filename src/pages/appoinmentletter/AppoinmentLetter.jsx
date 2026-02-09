import React, { useState } from 'react';
import {
  Download,
  Mail,
  FileText,
  Calendar,
  Building,
  User,
  Briefcase,
  DollarSign,
  FileCheck,
  Home,
  Shield,
  Gift,
  MapPin,
  Clock,
  CheckCircle,
  Printer,
  Copy,
  Search,
  Plus,
  Filter,
  MoreVertical,
  ChevronDown,
  Send,
  CheckSquare,
  FileEdit,
  Eye,
  Save,
  X,
  ArrowLeft,
  Settings,
  Bell,
  LayoutGrid,
  Users,
  UserPlus,
  FolderOpen,
  FileSignature,
  LogIn,
  Folder
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
const AppointmentLetterPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [selectedCandidate, setSelectedCandidate] = useState('Rajesh Kumar');
  const [previewMode, setPreviewMode] = useState(true);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    candidateId: 'CAND001',
    candidateName: 'Rajesh Kumar',
    candidateEmail: 'candidate@example.com',
    candidatePhone: '+91 98765 43210',
    dateOfJoining: '28/02/2026',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    workLocation: 'Mumbai Office',
    reportingManager: 'Amit Sharma',
    employeeId: 'EMP2026001',
  });

  const [employmentTerms, setEmploymentTerms] = useState({
    employmentType: 'Full Time',
    probationPeriod: '3 Months',
    noticePeriod: '2 Months',
  });

  const salaryData = [
    { id: 1, component: 'Basic Salary', monthly: '40,000', annual: '480,000' },
    { id: 2, component: 'HRA (House Rent Allowance)', monthly: '20,000', annual: '240,000' },
    { id: 3, component: 'Special Allowance', monthly: '15,000', annual: '180,000' },
    { id: 4, component: 'Performance Bonus', monthly: '0', annual: '100,000' },
  ];

  const benefits = [
    { id: 1, name: 'Health Insurance', description: 'Self + Family' },
    { id: 2, name: 'Provident Fund (PF)', description: 'PF Contribution' },
    { id: 3, name: 'Gratuity', description: 'Gratuity Benefits' },
    { id: 4, name: 'Paid Leaves', description: '21 days/year' },
    { id: 5, name: 'Work from Home Allowance', description: 'WFH Benefits' },
  ];

  // Calculate totals
  const totalMonthly = salaryData.reduce((sum, item) => sum + parseInt(item.monthly.replace(',', '')) || 0, 0);
  const totalAnnual = salaryData.reduce((sum, item) => sum + parseInt(item.annual.replace(',', '')) || 0, 0);

  // Handle changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTermsChange = (field, value) => {
    setEmploymentTerms(prev => ({ ...prev, [field]: value }));
  };

  // Actions
  const handleGenerateLetter = () => {
    setPreviewMode(true);
    alert('Appointment letter generated successfully!');
  };

  const handleDownloadPDF = () => {
    alert('PDF download started!');
  };

  const handleSendEmail = () => {
    alert(`Appointment letter sent to ${formData.candidateEmail}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const letterContent = {
    companyName: 'TECHNOVA SOLUTIONS',
    companyAddress: 'Registered Office Address, 123 Business Street, Mumbai - 400001',
    date: '6/2/2026',
  };

  return (
    <>

      <div onClick={() => navigate(-1)} className='mb-2 flex w-[100px] gap-2 items-center px-3 ml-5 rounded cursor-pointer py-2 bg-gray-100 '>
        <IoIosArrowRoundBack />
        Back

      </div>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}


        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Appointment Letter</h2>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-gray-400" />
                  {/* <Settings className="w-5 h-5 text-gray-400" /> */}
                </div>
              </div>
              {/* <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  New Letter
                </button>
              </div> */}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Employee Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Employee Information Card */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Candidate
                        </label>
                        <div className="relative">
                          <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedCandidate}
                            onChange={(e) => setSelectedCandidate(e.target.value)}
                          >
                            <option>Rajesh Kumar</option>
                            <option>Priya Sharma</option>
                            <option>Amit Patel</option>
                            <option>Neha Singh</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Joining
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={formData.dateOfJoining}
                              onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                            />
                            {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Department
                          </label>
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Designation
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.designation}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          placeholder="e.g., Senior Software Engineer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salary Breakdown */}
                  <div className="p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Salary Breakdown</h4>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-2 text-sm font-medium text-gray-700">Salary Component</th>
                            <th className="text-right p-2 text-sm font-medium text-gray-700">Monthly (₹)</th>
                            <th className="text-right p-2 text-sm font-medium text-gray-700">Annual (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {salaryData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="p-2 text-gray-600">{item.component}</td>
                              <td className="p-2 text-right font-medium text-gray-900">₹{item.monthly}</td>
                              <td className="p-2 text-right font-medium text-gray-900">₹{item.annual}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-blue-50">
                          <tr>
                            <td className="p-2 font-semibold text-blue-900">Total CTC</td>
                            <td className="p-2 text-right font-semibold text-blue-900">₹{totalMonthly.toLocaleString()}</td>
                            <td className="p-2 text-right font-semibold text-blue-900">₹{totalAnnual.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Employment Terms */}
                  <div className="p-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Employment Terms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employment Type *
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={employmentTerms.employmentType}
                          onChange={(e) => handleTermsChange('employmentType', e.target.value)}
                        >
                          <option>Full Time</option>
                          <option>Part Time</option>
                          <option>Contract</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Probation Period *
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={employmentTerms.probationPeriod}
                          onChange={(e) => handleTermsChange('probationPeriod', e.target.value)}
                        >
                          <option>3 Months</option>
                          <option>6 Months</option>
                          <option>1 Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notice Period *
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={employmentTerms.noticePeriod}
                          onChange={(e) => handleTermsChange('noticePeriod', e.target.value)}
                        >
                          <option>2 Months</option>
                          <option>1 Month</option>
                          <option>3 Months</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Location *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.workLocation}
                        onChange={(e) => handleInputChange('workLocation', e.target.value)}
                        placeholder="e.g., Mumbai Office"
                      />
                    </div>
                  </div>

                  {/* Benefits & Perks */}
                  {/* <div className="p-6 border-t border-gray-200">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Benefits & Perks</h4>
                    <div className="space-y-3">
                      {benefits.map((benefit) => (
                        <div key={benefit.id} className="flex items-center">
                          <CheckSquare className="w-4 h-4 text-blue-600 mr-3" />
                          <span className="text-gray-700">{benefit.name}</span>
                          {benefit.description && (
                            <span className="ml-2 text-sm text-gray-500">({benefit.description})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Right Column - Letter Preview */}
              <div className="space-y-6">
                {/* Letter Preview Card */}
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Letter Preview</h3>
                  </div>

                  <div className="p-6">
                    <div className="border border-gray-200 rounded-lg p-6 min-h-[500px] bg-gray-50">
                      {/* Company Header */}
                      <div className="mb-6">
                        <h2 className="text-lg font-bold text-blue-800 mb-1">{letterContent.companyName}</h2>
                        <p className="text-sm text-gray-600">{letterContent.companyAddress}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-600">Date: <span className="text-gray-900">{letterContent.date}</span></p>
                        </div>

                        <div>
                          <p className="text-gray-600 mb-1">To,</p>
                          <p className="text-gray-900 font-medium">{formData.candidateName}</p>
                          <p className="text-gray-600 text-sm">{formData.candidateEmail}</p>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-semibold text-blue-700 mb-3">Subject: Letter of Appointment</h4>

                          <div className="space-y-4 text-gray-700">
                            <p>Dear {formData.candidateName},</p>
                            <p>
                              We are pleased to offer you the position of {formData.designation} in our {formData.department} Department. Your employment will commence on the date of joining mentioned above.
                            </p>
                            <p>
                              ... [Full letter content will be generated] ...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 grid grid-cols-1 gap-3">
                      <button
                        onClick={handleGenerateLetter}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <FileText className="w-5 h-5 mr-2" />
                        Generate Appointment Letter
                      </button>
                      {/* 
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={handleDownloadPDF}
                          className="px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download PDF
                        </button>
                        <button
                          onClick={handleSendEmail}
                          className="px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Send Email
                        </button>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                {/* <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-4">Letter Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Status</span>
                      <span className="px-3 py-1 bg-blue-500 rounded-full text-sm">Draft</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Last Modified</span>
                      <span>Today, 10:30 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-100">Candidate Status</span>
                      <span>Offer Accepted</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentLetterPage;