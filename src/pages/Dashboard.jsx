import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
  RadialBarChart, RadialBar,
  ComposedChart
} from 'recharts';
import {
  FaUsers, FaUserCheck, FaCalendarCheck, FaMoneyBillWave,
  FaArrowUp, FaArrowDown, FaRegCalendarAlt, FaUserTie,
  FaChartLine, FaBriefcase, FaGraduationCap, FaBalanceScale
} from 'react-icons/fa';
import {
  MdWork, MdPendingActions, MdAttachMoney, MdTrendingUp,
  MdOutlineShowChart, MdBarChart, MdPieChart
} from 'react-icons/md';
import {
  BsGraphUpArrow, BsPeopleFill, BsClockHistory,
  BsFillBarChartFill, BsPieChartFill
} from 'react-icons/bs';
import {
  HiOutlineOfficeBuilding, HiOutlineUserGroup,
  HiOutlineCurrencyDollar
} from 'react-icons/hi';
import {
  RiMoneyDollarCircleLine, RiTeamLine,
  RiUserStarLine, RiCalendarScheduleLine
} from 'react-icons/ri';
import {
  FiTrendingUp, FiTrendingDown, FiUsers, FiDollarSign
} from 'react-icons/fi';
import {
  AiOutlinePieChart, AiOutlineTeam, AiOutlineAreaChart,
  AiOutlineBarChart
} from 'react-icons/ai';
import { TbChartLine, TbChartArcs } from 'react-icons/tb';

export default function HRDashboard() {
  // Static data for metrics
  const metrics = [
    {
      title: "Total Employees",
      value: "156",
      change: "+12%",
      trend: "up",
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      color: "from-blue-500 to-blue-600",
      chartColor: "#3B82F6"
    },
    {
      title: "Active Recruitment",
      value: "24",
      change: "+5",
      trend: "up",
      icon: <MdWork className="text-emerald-500 text-2xl" />,
      color: "from-emerald-500 to-emerald-600",
      chartColor: "#10B981"
    },
    {
      title: "Pending Interviews",
      value: "18",
      change: "-3",
      trend: "down",
      icon: <MdPendingActions className="text-amber-500 text-2xl" />,
      color: "from-amber-500 to-amber-600",
      chartColor: "#F59E0B"
    },
    {
      title: "Monthly Payroll",
      value: "$124.5K",
      change: "+8.5%",
      trend: "up",
      icon: <RiMoneyDollarCircleLine className="text-purple-500 text-2xl" />,
      color: "from-purple-500 to-purple-600",
      chartColor: "#8B5CF6"
    }
  ];

  // Department distribution data for Pie Chart
  const departmentData = [
    { name: 'Engineering', value: 42, color: '#3B82F6' },
    { name: 'Sales', value: 28, color: '#10B981' },
    { name: 'Marketing', value: 18, color: '#F59E0B' },
    { name: 'HR', value: 8, color: '#8B5CF6' },
    { name: 'Finance', value: 15, color: '#EF4444' },
    { name: 'Operations', value: 24, color: '#06B6D4' }
  ];

  // Recruitment funnel data for Bar Chart
  const recruitmentData = [
    { month: 'Jan', applied: 240, screened: 180, interviewed: 120, hired: 24 },
    { month: 'Feb', applied: 220, screened: 170, interviewed: 110, hired: 22 },
    { month: 'Mar', applied: 260, screened: 200, interviewed: 140, hired: 28 },
    { month: 'Apr', applied: 280, screened: 220, interviewed: 160, hired: 32 },
    { month: 'May', applied: 300, screened: 240, interviewed: 180, hired: 36 }
  ];

  // Employee growth data for Area Chart
  const growthData = [
    { month: 'Jan', employees: 140, hires: 8 },
    { month: 'Feb', employees: 144, hires: 10 },
    { month: 'Mar', employees: 148, hires: 12 },
    { month: 'Apr', employees: 150, hires: 6 },
    { month: 'May', employees: 154, hires: 10 },
    { month: 'Jun', employees: 156, hires: 8 }
  ];

  // Attendance data for Line Chart
  const attendanceData = [
    { day: 'Mon', present: 152, absent: 4 },
    { day: 'Tue', present: 150, absent: 6 },
    { day: 'Wed', present: 154, absent: 2 },
    { day: 'Thu', present: 151, absent: 5 },
    { day: 'Fri', present: 149, absent: 7 },
    { day: 'Sat', present: 80, absent: 0 }
  ];

  // Performance rating data for Radial Chart
  const performanceData = [
    { name: 'Exceeds', value: 35, color: '#10B981' },
    { name: 'Meets', value: 45, color: '#3B82F6' },
    { name: 'Needs Improvement', value: 15, color: '#F59E0B' },
    { name: 'Below Expectations', value: 5, color: '#EF4444' }
  ];

  // Payroll distribution data for Composed Chart
  const payrollData = [
    { department: 'Engineering', salary: 65000, bonus: 8000, employees: 65 },
    { department: 'Sales', salary: 55000, bonus: 12000, employees: 44 },
    { department: 'Marketing', salary: 48000, bonus: 5000, employees: 28 },
    { department: 'HR', salary: 52000, bonus: 3000, employees: 12 },
    { department: 'Finance', salary: 58000, bonus: 4000, employees: 23 }
  ];

  // Recent hires data
  const recentHires = [
    { name: "Alex Johnson", position: "Senior Developer", department: "Engineering", date: "Jan 15", avatarColor: "bg-blue-500" },
    { name: "Sarah Miller", position: "Marketing Manager", department: "Marketing", date: "Jan 12", avatarColor: "bg-emerald-500" },
    { name: "David Chen", position: "Sales Executive", department: "Sales", date: "Jan 10", avatarColor: "bg-amber-500" },
    { name: "Maria Garcia", position: "HR Specialist", department: "Human Resources", date: "Jan 8", avatarColor: "bg-purple-500" }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-surface)] p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-[var(--text-primary)]">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-[var(--bg-surface)] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="md:flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">HR Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, Erşad. Here's your team overview.</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button className="px-4 py-2 bg-[var(--bg-surface)] border border-gray-300 rounded-xl text-sm font-medium hover:bg-[var(--bg-surface)] transition-colors">
              Export Report
            </button> */}
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all">
              Generate Insights
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Last updated: Today, 10:30 AM
          </span>
        </div>
      </div>

      {/* Metrics Cards with Mini Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-10`}>
                {metric.icon}
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${metric.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {metric.trend === 'up' ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
                {metric.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">{metric.value}</h3>
            <p className="text-gray-600 mb-4">{metric.title}</p>
            {/* Mini Chart */}
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { value: 10 }, { value: 25 }, { value: 18 }, { value: 30 }, { value: 22 }, { value: metric.trend === 'up' ? 35 : 15 }
                ]}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={metric.chartColor}
                    fill={metric.chartColor}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution - Pie Chart */}
        <div className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Department Distribution</h2>
              <p className="text-gray-600 text-sm">Employee count by department</p>
            </div>
            <MdPieChart className="text-gray-400 text-2xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recruitment Trends - Bar Chart */}
        <div className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Recruitment Pipeline</h2>
              <p className="text-gray-600 text-sm">Monthly recruitment metrics</p>
            </div>
            <MdBarChart className="text-gray-400 text-2xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="applied" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="screened" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviewed" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="hired" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Employee Growth - Area Chart */}
        <div className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Employee Growth</h2>
              <p className="text-gray-600 text-sm">Headcount and monthly hires</p>
            </div>
            <AiOutlineAreaChart className="text-gray-400 text-2xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="employees" fill="#3B82F6" fillOpacity={0.2} stroke="#3B82F6" strokeWidth={2} />
                <Bar dataKey="hires" fill="#10B981" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Ratings - Radial Chart */}
        <div className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Performance Ratings</h2>
              <p className="text-gray-600 text-sm">Employee performance distribution</p>
            </div>
            <TbChartArcs className="text-gray-400 text-2xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="20%"
                outerRadius="90%"
                data={performanceData}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  wrapperStyle={{ right: -40 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance and Payroll Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Attendance - Line Chart */}
        <div className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Weekly Attendance</h2>
              <p className="text-gray-600 text-sm">Present vs. Absent employees</p>
            </div>
            <TbChartLine className="text-gray-400 text-2xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payroll Distribution - Composed Chart */}
        <div className="bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Payroll Analysis</h2>
              <p className="text-gray-600 text-sm">Salary and bonus by department</p>
            </div>
            <HiOutlineCurrencyDollar className="text-gray-400 text-2xl" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={payrollData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="department" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="salary" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="bonus" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="employees" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Hires & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Hires */}
        <div className="lg:col-span-2 bg-[var(--bg-surface)] rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Hires</h2>
              <p className="text-gray-600 text-sm">New employees this month</p>
            </div>
            <FaUserCheck className="text-gray-400 text-2xl" />
          </div>
          <div className="space-y-4">
            {recentHires.map((hire, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--bg-surface)] transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`${hire.avatarColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-bold">
                      {hire.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">{hire.name}</h4>
                    <p className="text-sm text-gray-600">{hire.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-[var(--bg-surface)] text-gray-800 text-sm rounded-full font-medium">
                    {hire.department}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{hire.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Key Insights</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[var(--bg-surface)] bg-opacity-20 rounded-lg">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white text-sm opacity-90">Retention Rate</p>
                  <p className="text-white text-2xl font-bold">94.2%</p>
                </div>
              </div>
              <FiTrendingUp className="text-emerald-300 text-2xl" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[var(--bg-surface)] bg-opacity-20 rounded-lg">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white text-sm opacity-90">Avg. Experience</p>
                  <p className="text-white text-2xl font-bold">4.8 yrs</p>
                </div>
              </div>
              <FiTrendingUp className="text-emerald-300 text-2xl" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[var(--bg-surface)] bg-opacity-20 rounded-lg">
                  <FaBalanceScale className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white text-sm opacity-90">Gender Ratio</p>
                  <p className="text-white text-2xl font-bold">42/58</p>
                </div>
              </div>
              <FiUsers className="text-emerald-300 text-2xl" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-[var(--bg-surface)] bg-opacity-20 rounded-lg">
                  <FiDollarSign className="text-white text-xl" />
                </div>
                <div>
                  <p className="text-white text-sm opacity-90">Avg. Salary</p>
                  <p className="text-white text-2xl font-bold">$58.4K</p>
                </div>
              </div>
              <FiTrendingUp className="text-emerald-300 text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}