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
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Smartphone,
  Coffee,
  Globe,
  Trophy,
  Zap,
  Edit2,
  Eye,
  Save,
  X
} from 'lucide-react';

const AppointmentLetterPage = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    candidateId: 'CAND001',
    candidateName: 'Rajesh Kumar',
    candidateEmail: 'rajesh.kumar@example.com',
    candidatePhone: '+91 98765 43210',
    dateOfJoining: '28/12/2026',
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
    workHours: '9:00 AM - 6:00 PM',
    workDays: 'Monday to Friday',
  });

  const [salaryData, setSalaryData] = useState([
    { id: 1, component: 'Basic Salary', monthly: '40,000', annual: '480,000', percentage: 53.3 },
    { id: 2, component: 'HRA (House Rent Allowance)', monthly: '20,000', annual: '240,000', percentage: 26.7 },
    { id: 3, component: 'Special Allowance', monthly: '15,000', annual: '180,000', percentage: 20 },
    { id: 4, component: 'Performance Bonus', monthly: '0', annual: '100,000', percentage: 11.1 },
  ]);

  const benefits = [
    { id: 1, name: 'Health Insurance', description: 'Self + Family Coverage', icon: <Shield className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Provident Fund', description: '12% Employer Contribution', icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { id: 3, name: 'Gratuity', description: 'After 5 years of service', icon: <Gift className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' },
    { id: 4, name: 'Paid Leaves', description: '21 days per year', icon: <Calendar className="w-5 h-5" />, color: 'bg-amber-100 text-amber-600' },
    { id: 5, name: 'WFH Allowance', description: '₹5,000 monthly', icon: <Home className="w-5 h-5" />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 6, name: 'Gym Membership', description: 'Corporate plan', icon: <Award className="w-5 h-5" />, color: 'bg-red-100 text-red-600' },
    { id: 7, name: 'Learning Budget', description: '₹50,000 annually', icon: <Sparkles className="w-5 h-5" />, color: 'bg-pink-100 text-pink-600' },
    { id: 8, name: 'Team Events', description: 'Quarterly offsites', icon: <Users className="w-5 h-5" />, color: 'bg-cyan-100 text-cyan-600' },
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
    setIsEditing(false);
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

  const handleSaveDraft = () => {
    setIsEditing(false);
    alert('Draft saved successfully!');
  };

  const letterContent = {
    companyName: 'TECHNOVA SOLUTIONS',
    companyAddress: 'Tech Park, Andheri East, Mumbai - 400093, Maharashtra',
    companyWebsite: 'www.technova-solutions.com',
    hrEmail: 'hr@technova-solutions.com',
    hrPhone: '+91 22 1234 5678',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Appointment Letter
              </h1>
              <p className="text-gray-600 mt-2">Generate professional appointment letters for new hires</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Draft Mode</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Quick Generate
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Candidate</p>
                  <p className="font-semibold text-gray-800">{formData.candidateName}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-semibold text-gray-800">{formData.designation}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual CTC</p>
                  <p className="font-semibold text-gray-800">₹{totalAnnual.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-semibold text-gray-800">{formData.dateOfJoining}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Form */}
          <div className=" space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                {['details', 'salary', 'benefits'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {tab === 'details' && 'Employee Details'}
                    {tab === 'salary' && 'Salary Structure'}
                    {tab === 'benefits' && 'Benefits & Perks'}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Candidate Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={formData.candidateName}
                            onChange={(e) => handleInputChange('candidateName', e.target.value)}
                          />
                          <User className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Joining
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={formData.dateOfJoining}
                            onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                          />
                          <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={formData.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                          />
                          <Building className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Designation
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={formData.designation}
                            onChange={(e) => handleInputChange('designation', e.target.value)}
                          />
                          <Briefcase className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Employment Terms */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
                        Employment Terms
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(employmentTerms).map(([key, value]) => (
                          <div key={key} className="bg-white rounded-xl p-4 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1 capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </p>
                            <p className="font-semibold text-gray-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'salary' && (
                  <div>
                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-500 to-blue-600">
                          <tr>
                            <th className="text-left p-4 text-white font-medium">Component</th>
                            <th className="text-right p-4 text-white font-medium">Monthly (₹)</th>
                            <th className="text-right p-4 text-white font-medium">Annual (₹)</th>
                            <th className="text-right p-4 text-white font-medium">%</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {salaryData.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                              <td className="p-4 font-medium text-gray-700">{item.component}</td>
                              <td className="p-4 text-right font-semibold">₹{item.monthly}</td>
                              <td className="p-4 text-right font-semibold">₹{item.annual}</td>
                              <td className="p-4 text-right">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {item.percentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-gray-50 to-blue-50">
                          <tr>
                            <td className="p-4 font-bold text-gray-800">Total CTC</td>
                            <td className="p-4 text-right font-bold text-gray-800">
                              ₹{totalMonthly.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-right font-bold text-gray-800">
                              ₹{totalAnnual.toLocaleString('en-IN')}
                            </td>
                            <td className="p-4 text-right">100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    {/* Salary Chart Placeholder */}
                    <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">Salary Distribution</h4>
                        <span className="text-sm text-gray-500">Visual breakdown</span>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500" style={{ width: '100%' }}>
                          <div className="h-full w-[53.3%] bg-blue-500"></div>
                          <div className="h-full w-[26.7%] bg-green-500"></div>
                          <div className="h-full w-[20%] bg-purple-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'benefits' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {benefits.map((benefit) => (
                        <div key={benefit.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${benefit.color}`}>
                            {benefit.icon}
                          </div>
                          <h4 className="font-semibold text-gray-800 mb-1">{benefit.name}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGenerateLetter}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center font-medium group"
              >
                <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Generate Appointment Letter
              </button>
              <button
                onClick={handleSaveDraft}
                className="px-6 py-4 bg-white border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center font-medium"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Preview Card */}
            <div className={`bg-white rounded-2xl shadow-xl border-2 ${previewMode ? 'border-blue-500' : 'border-gray-200'} transition-all`}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    Letter Preview
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrint}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Print"
                    >
                      <Printer className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      // onClick={handleCopyLetter}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Letter Preview */}
              <div className="p-6">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                  {/* Company Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">{letterContent.companyName}</h2>
                    <p className="text-gray-600 text-sm">{letterContent.companyAddress}</p>
                    <div className="flex items-center justify-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{letterContent.companyWebsite}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{letterContent.hrEmail}</span>
                    </div>
                  </div>

                  {/* Letter Meta */}
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">{formData.dateOfJoining}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">To</p>
                        <p className="font-medium text-lg">{formData.candidateName}</p>
                        <p className="text-sm text-gray-600">{formData.candidateEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Letter Body */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-3">Subject: Letter of Appointment</h4>
                      <div className="space-y-3 text-gray-700">
                        <p>Dear <span className="font-semibold">{formData.candidateName}</span>,</p>
                        <p>We are pleased to offer you the position of <span className="font-semibold">{formData.designation}</span> in our <span className="font-semibold">{formData.department}</span> Department.</p>
                        <p>Your employment will commence on <span className="font-semibold">{formData.dateOfJoining}</span> and will be subject to the terms and conditions outlined in this letter.</p>
                        <div className="bg-blue-50 p-4 rounded-lg mt-4">
                          <p className="text-sm text-blue-800">
                            This letter confirms your appointment details, compensation package, and employment terms as discussed during the interview process.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signature Area */}
                  <div className="mt-8 pt-6 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="h-12 w-48 border-b border-gray-400 mb-2"></div>
                        <p className="font-semibold text-gray-800">HR Administrator</p>
                        <p className="text-sm text-gray-600">Human Resources Department</p>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-md transition-all"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-md transition-all"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </button>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Progress Status</h3>
              <div className="space-y-4">
                {[
                  { step: 'Candidate Selected', status: 'completed', date: '25/12/2026' },
                  { step: 'Offer Accepted', status: 'completed', date: '26/12/2026' },
                  { step: 'Letter Generated', status: 'current', date: '28/12/2026' },
                  { step: 'Documentation', status: 'pending' },
                  { step: 'Joining', status: 'pending' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      item.status === 'completed' ? 'bg-green-100 text-green-600' :
                      item.status === 'current' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {item.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700">{item.step}</p>
                      {item.date && <p className="text-xs text-gray-500">{item.date}</p>}
                    </div>
                    {item.status === 'current' && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLetterPage;