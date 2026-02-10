import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import apiPath from '../../api/apiPath';
import { apiGet, apiPost } from '../../api/apiFetch';
import { useParams } from 'react-router-dom';
import {
  FileText,
  ChevronDown,
  Bell,
  ArrowLeft,
  Calendar,
  Building,
  Briefcase,
  MapPin,
  User,
  DollarSign,
  FileCheck,
  Clock,
  FileDown,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Mail,
  Download,
  Eye,
  Shield,
  Award,
  Heart,
  Coffee,
  Home,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  FileSignature,
  Check,
  X,
  Info,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';

const AppointmentLetterPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [formData, setFormData] = useState({
    candidateId: '',
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    dateOfJoining: '',
    department: 'Engineering',
    designation: '',
    workLocation: 'Mumbai Office',
    reportingManager: '',
    employeeId: '',
  });

  const [employmentTerms, setEmploymentTerms] = useState({
    employmentType: 'Full Time',
    probationPeriod: '',
    noticePeriod: '',
  });

  const [salaryData, setSalaryData] = useState([
    { id: 1, component: 'Basic Salary', monthly: '0', annual: '0', icon: '💰' },
    { id: 2, component: 'HRA (House Rent Allowance)', monthly: '0', annual: '0', icon: '🏠' },
    { id: 3, component: 'Special Allowance', monthly: '0', annual: '0', icon: '✨' },
    { id: 4, component: 'Annual Bonus', monthly: '0', annual: '0', icon: '🎯' },
  ]);

  const benefits = [
    { id: 1, name: 'Health Insurance', description: 'Self + Family Coverage', icon: <Heart className="w-4 h-4" /> },
    { id: 2, name: 'Provident Fund (PF)', description: '12% Contribution', icon: <Shield className="w-4 h-4" /> },
    { id: 3, name: 'Paid Time Off', description: '24 Days/Year', icon: <Calendar className="w-4 h-4" /> },
    { id: 4, name: 'Remote Work', description: 'Hybrid Policy', icon: <Home className="w-4 h-4" /> },
    { id: 5, name: 'Learning Budget', description: '₹50,000/Year', icon: <Award className="w-4 h-4" /> },
    { id: 6, name: 'Wellness Allowance', description: '₹20,000/Year', icon: <Coffee className="w-4 h-4" /> },
  ];

  // Helper functions
  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString('en-IN');
  };

const formatDateForInput = (dateString) => {
  if (!dateString) return '';

  // Case 1: Already in YYYY-MM-DD (ISO)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Case 2: "01 April 2026"
  const [day, monthName, year] = dateString.split(' ');

  const monthMap = {
    January: '01', February: '02', March: '03', April: '04',
    May: '05', June: '06', July: '07', August: '08',
    September: '09', October: '10', November: '11', December: '12',
  };

  const month = monthMap[monthName];

  if (!day || !month || !year) return '';

  return `${year}-${month}-${day.padStart(2, '0')}`;
};


  const extractPeriod = (periodString) => {
    if (!periodString) return '';
    const match = periodString.match(/(\d+)\s*(month|day|year)/i);
    if (match) {
      const number = match[1];
      const unit = match[2].toLowerCase();
      if (unit === 'month') return `${number} Months`;
      if (unit === 'year') return `${number} Year`;
      if (unit === 'day') return `${number} Days`;
    }
    return periodString;
  };

  // Calculate totals
  const calculateTotals = (salaryArray) => {
    const monthly = salaryArray.reduce((sum, item) => {
      const monthlyValue = parseInt(item.monthly.replace(/,/g, '')) || 0;
      return sum + monthlyValue;
    }, 0);
    
    const annual = salaryArray.reduce((sum, item) => {
      const annualValue = parseInt(item.annual.replace(/,/g, '')) || 0;
      return sum + annualValue;
    }, 0);
    
    return { monthly, annual };
  };

  // Fetch offer letter data
  const { 
    data: apiData, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['offerLetterData', id],
    queryFn: async () => {
      try {
        const response = await apiGet(`${apiPath.offerLetterData}/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!id,
  });

  // Set data when apiData changes
  useEffect(() => {
    if (!apiData) return;

    const offerData = apiData;

    setFormData({
      candidateId: offerData.candidateId || '',
      candidateName: offerData.candidateName || '',
      candidateEmail: '',
      candidatePhone: '',
      dateOfJoining: formatDateForInput(offerData.joiningDate),
      department: 'Engineering',
      designation: offerData.position || '',
      workLocation: 'Mumbai Office',
      reportingManager: offerData.reportingManager || '',
      employeeId: '',
    });

    setEmploymentTerms({
      employmentType: 'Full Time',
      probationPeriod: extractPeriod(offerData.probationPeriod) || '6 Months',
      noticePeriod: extractPeriod(offerData.noticePeriod) || '2 Months',
    });

    setSalaryData([
      {
        id: 1,
        component: 'Basic Salary',
        monthly: formatNumber(Math.round(offerData.basicSalary / 12)),
        annual: formatNumber(offerData.basicSalary),
        icon: '💰'
      },
      {
        id: 2,
        component: 'HRA (House Rent Allowance)',
        monthly: formatNumber(Math.round(offerData.houseRentAllowance / 12)),
        annual: formatNumber(offerData.houseRentAllowance),
        icon: '🏠'
      },
      {
        id: 3,
        component: 'Special Allowance',
        monthly: formatNumber(Math.round(offerData.specialAllowance / 12)),
        annual: formatNumber(offerData.specialAllowance),
        icon: '✨'
      },
      {
        id: 4,
        component: 'Annual Bonus',
        monthly: formatNumber(Math.round(offerData.annualBonus / 12)),
        annual: formatNumber(offerData.annualBonus),
        icon: '🎯'
      },
    ]);
  }, [apiData]);

  // Mutation for generating appointment letter
  const generateMutation = useMutation({
    mutationFn: (payload) => apiPost(apiPath.generateAppointmentLetter, payload),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success('Appointment letter generated successfully!', {
          duration: 4000,
          position: 'top-right',
          icon: '✅'
        });
      } else {
        toast.error(data?.message || 'Failed to generate appointment letter', {
          duration: 4000,
          position: 'top-right'
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Error generating appointment letter', {
        duration: 4000,
        position: 'top-right'
      });
    }
  });

  // Calculate totals using the helper function
  const { monthly: totalMonthly, annual: totalAnnual } = calculateTotals(salaryData);

  // Handle generate appointment letter
  const handleGenerateLetter = () => {
    if (!apiData) {
      toast.error('No offer letter data available', {
        duration: 3000,
        position: 'top-right'
      });
      return;
    }

    const payload = {
      offerLetterId: id,
      candidateId: apiData.candidateId,
      candidateName: apiData.candidateName,
      position: apiData.position,
      joiningDate: apiData.joiningDate,
      reportingManager: apiData.reportingManager,
      basicSalary: apiData.basicSalary,
      houseRentAllowance: apiData.houseRentAllowance,
      specialAllowance: apiData.specialAllowance,
      annualBonus: apiData.annualBonus,
      totalAnnualCTC: apiData.totalAnnualCTC,
      probationPeriod: apiData.probationPeriod,
      noticePeriod: apiData.noticePeriod,
      specialRemarks: apiData.specialRemarks,
      department: formData.department,
      workLocation: formData.workLocation,
      employmentType: employmentTerms.employmentType
    };

    generateMutation.mutate(payload);
  };

  // Handle download PDF
  const handleDownloadPDF = () => {
    if (apiData?.fileName) {
      // Implement actual PDF download logic
      toast.success('Preparing PDF download...', {
        duration: 3000,
        position: 'top-right'
      });
    } else {
      toast.error('No PDF file available', {
        duration: 3000,
        position: 'top-right'
      });
    }
  };

  // Handle send email
  const handleSendEmail = () => {
    toast.success('Appointment letter will be sent to candidate', {
      duration: 3000,
      position: 'top-right'
    });
  };

  const letterContent = {
    companyName: 'Waplia Digital Solution Pvt. Ltd',
    companyAddress: 'Registered Office Address, Malviya nagar sector 5, jaipur',
    date: new Date().toLocaleDateString('en-GB'),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-8 h-8 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50"></div>
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin relative z-10" />
            </div>
            <p className="text-gray-700 text-sm font-medium">Loading offer letter data...</p>
            <p className="text-gray-500 text-xs mt-2">Preparing your appointment letter</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-6">{error?.message || 'Unable to load offer letter data'}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => refetch()}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow flex items-center"
            >
              <Loader2 className="w-4 h-4 mr-2" />
              Retry
            </button>
            <button 
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[var(--bg-surface)]
/95 backdrop-blur-sm border-b border-gray-200/80">
          <div className="md:px-8 px-2 py-2  md:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(-1)} 
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Back</span>
                </button>
                
                <div className="md:flex hidden items-center text-sm text-gray-500">
                  <span className="font-medium">HR Management</span>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <span className="font-medium">Offer Letters</span>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <span className="text-gray-900 font-semibold">Appointment Letter</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {/* <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow flex items-center gap-2">
                  <FileSignature className="w-4 h-4" />
                  New Template
                </button> */}
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Generate Appointment Letter</h1>
                  <p className="text-gray-600 mt-1">Create official appointment letter for {formData.candidateName || 'candidate'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    apiData?.status === 'accepted' 
                      ? 'bg-green-100 text-green-800' 
                      : apiData?.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {apiData?.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:px-8 px-2 py-2 md:y-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Employee Information */}
              <div className="lg:col-span-2 space-y-8">
                {/* Employee Information Card */}
                <div className="bg-[var(--bg-surface)]
 rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Candidate Details</h3>
                          <p className="text-sm text-gray-500">Personal & employment information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={formData.candidateName}
                            disabled
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Designation
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={formData.designation}
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date of Joining
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={formData.dateOfJoining}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Department
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={formData.department}
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Reporting Manager
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={formData.reportingManager}
                          disabled
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Work Location
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          value={formData.workLocation}
                          disabled
                        />
                      </div>
                    </div>

                    {/* Employment Terms */}
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-md font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        Employment Terms
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Employment Type</label>
                          <div className="relative">
                            <select
                              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 appearance-none"
                              value={employmentTerms.employmentType}
                              disabled
                            >
                              <option>Full Time</option>
                              <option>Part Time</option>
                              <option>Contract</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Probation Period</label>
                          <div className="relative">
                            <select
                              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 appearance-none"
                              value={employmentTerms.probationPeriod}
                              disabled
                            >
                              <option>6 Months</option>
                              <option>3 Months</option>
                              <option>1 Year</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Notice Period</label>
                          <div className="relative">
                            <select
                              className="w-full border border-gray-300 rounded-xl px-4 py-3.5 bg-gray-50/50 text-gray-700 appearance-none"
                              value={employmentTerms.noticePeriod}
                              disabled
                            >
                              <option>2 Months</option>
                              <option>1 Month</option>
                              <option>3 Months</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary Breakdown Card */}
                <div className="bg-[var(--bg-surface)]
 rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Salary Structure</h3>
                          <p className="text-sm text-gray-500">Compensation breakdown & benefits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Annual CTC</p>
                        <p className="text-2xl font-bold text-gray-900">₹{totalAnnual.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:p-6 p-2 overflow-auto">
                    <div className=" rounded-xl border border-gray-200">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="text-left p-4 text-sm font-semibold text-gray-700">Component</th>
                            <th className="text-right p-4 text-sm font-semibold text-gray-700">Monthly (₹)</th>
                            <th className="text-right p-4 text-sm font-semibold text-gray-700">Annual (₹)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {salaryData.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{item.icon}</span>
                                  <span className="font-medium text-gray-700">{item.component}</span>
                                </div>
                              </td>
                              <td className="p-4 text-right font-medium text-gray-900">₹{item.monthly}</td>
                              <td className="p-4 text-right font-medium text-gray-900">₹{item.annual}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                          <tr>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-semibold text-blue-900">Total CTC</span>
                              </div>
                            </td>
                            <td className="p-4 text-right font-bold text-blue-900 text-lg">₹{totalMonthly.toLocaleString()}</td>
                            <td className="p-4 text-right font-bold text-blue-900 text-lg">₹{totalAnnual.toLocaleString()}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    {/* Benefits Section */}
                       <button
                    onClick={handleGenerateLetter}
                    disabled={generateMutation.isPending || !apiData}
                    className={`w-full   py-2 rounded-xl mt-4 cursor-pointer font-semibold flex items-center justify-center transition-all ${
                      generateMutation.isPending 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : ' bg-blue-600 text-white  hover:shadow-xl'
                    }`}
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Generating Letter...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-3" />
                        Generate Appointment Letter
                      </>
                    )}
                  </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Preview */}
              <div className="space-y-8">
                {/* Generate Card */}
                {/* <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-surface)]
/20 backdrop-blur-sm flex items-center justify-center">
                      <FileSignature className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ready to Generate</h3>
                    <p className="text-blue-100/80">Create official appointment letter</p>
                  </div>

                

                  <div className="mt-6 space-y-4">
                    <button
                      onClick={handleDownloadPDF}
                      disabled={!apiData?.fileName}
                      className="w-full py-3 rounded-xl border border-white/30 text-white hover:bg-[var(--bg-surface)]
/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button
                      onClick={handleSendEmail}
                      className="w-full py-3 rounded-xl border border-white/30 text-white hover:bg-[var(--bg-surface)]
/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send via Email
                    </button>
                  </div>
                </div> */}

                {/* Status Card */}
                <div className="bg-[var(--bg-surface)]
 rounded-2xl shadow-sm border border-gray-200/80 p-6">
                  <h4 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <Info className="w-5 h-5 text-gray-400" />
                    Letter Status
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Offer Status</p>
                          <p className="font-medium">{apiData?.status?.charAt(0).toUpperCase() + apiData?.status?.slice(1) || 'Pending'}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apiData?.status === 'accepted' 
                          ? 'bg-green-100 text-green-800' 
                          : apiData?.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apiData?.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Total Annual CTC</span>
                        <span className="font-bold text-gray-900">₹{apiData?.totalAnnualCTC?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Monthly Gross</span>
                        <span className="font-medium text-gray-900">₹{apiData?.monthlyGrossSalary?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Joining Date</span>
                        <span className="font-medium text-gray-900">{apiData?.joiningDate || 'Not set'}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Created</span>
                        <span className="text-sm font-medium text-gray-900">
                          {apiData?.createdAt ? new Date(apiData.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Last Updated</span>
                        <span className="text-sm font-medium text-gray-900">
                          {apiData?.updatedAt ? new Date(apiData.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="bg-[var(--bg-surface)]
 rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-400" />
                      Quick Preview
                    </h4>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="mb-4">
                        <h5 className="font-bold text-blue-800 mb-1">{letterContent.companyName}</h5>
                        <p className="text-xs text-gray-600">{letterContent.companyAddress}</p>
                      </div>
                      <div className="space-y-3 text-sm">
                        <p className="text-gray-700">Dear {formData.candidateName || 'Candidate'},</p>
                        <p className="text-gray-600">We are pleased to offer you the position of {formData.designation}...</p>
                      </div>
                      <button className="mt-6 w-full py-2.5 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View Full Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentLetterPage;