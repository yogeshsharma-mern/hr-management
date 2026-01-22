// import {
//   FaHome,
//   FaUserTie,
//   FaUserFriends,
//   FaCalendarAlt,
//   FaFileContract,
//   FaIdCard,
// } from "react-icons/fa";
// import { 
//   MdWork, 
//   MdInterests, 
//   MdAssessment, 
//   MdDashboard,
//   MdOutlineAnalytics,
//   MdOutlinePayments,
//   MdSettings
// } from "react-icons/md";
// import { 
// //   IoMdAnalytics,
//   IoPersonAddOutline,
//   IoDocumentsOutline,
//   IoCalendar,
//   IoChevronDown,
//   IoChevronUp,
//   IoChevronForward
// } from "react-icons/io5";
// import { 
//   TbLockPassword, 
//   TbReportAnalytics, 
//   TbLogout,
//   TbUsers,
//   TbCalendarStats
// } from "react-icons/tb";
// import { 
//   BsPeopleFill, 
//   BsClockHistory, 
//   BsFileEarmarkText,
//   BsGraphUpArrow,
//   BsBuilding
// } from "react-icons/bs";
// import { 
//   HiOutlineOfficeBuilding, 
//   HiMenuAlt3,
//   HiOutlineUserGroup
// } from "react-icons/hi";
// import { 
//   RiLogoutCircleRLine,
//   RiTeamLine,
//   RiMoneyDollarCircleLine,
//   RiDashboardLine
// } from "react-icons/ri";
// import { 
//   GiTakeMyMoney,
//   GiPayMoney
// } from "react-icons/gi";
// import { 
//   FiSettings,
//   FiUsers,
//   FiTrendingUp
// } from "react-icons/fi";
// import { 
//   AiOutlineTeam,
//   AiOutlinePieChart,
//   AiOutlineDashboard
// } from "react-icons/ai";
// import { 
//   BiChevronRight,
//   BiUserCircle,
//   BiBriefcaseAlt2
// } from "react-icons/bi";
// import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSelector, useDispatch } from "react-redux";
// import { toggleSidebarCollapse } from "../features/ui/uislic";
// import { logout } from "../features/auth/authSlice";

// export default function Sidebar({ isOpen, toggleSidebar }) {
//   const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
//   const dispatch = useDispatch();

//   const [openMenus, setOpenMenus] = useState({
//     recruitment: localStorage.getItem("openRecruitmentMenu") === "true",
//     employees: localStorage.getItem("openEmployeeMenu") === "true",
//     analytics: localStorage.getItem("openAnalyticsMenu") === "true",
//     settings: localStorage.getItem("openSettingsMenu") === "true"
//   });

//   // Save menu states
//   useEffect(() => {
//     Object.keys(openMenus).forEach(key => {
//       localStorage.setItem(`open${key.charAt(0).toUpperCase() + key.slice(1)}Menu`, openMenus[key]);
//     });
//   }, [openMenus]);

//   const toggleMenu = (menu) => {
//     setOpenMenus(prev => ({
//       ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
//       [menu]: !prev[menu]
//     }));
//   };

//   const handleMainNavClick = () => {
//     setOpenMenus({
//       recruitment: false,
//       employees: false,
//       analytics: false,
//       settings: false
//     });
//     toggleSidebar?.();
//   };

//   const handleSubmenuClick = () => {
//     toggleSidebar?.();
//   };

//   // Modern styling inspired by AlignUI
//   const navItemClass = ({ isActive }) =>
//     `flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
//      ${isActive
//         ? "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 border-l-3 border-blue-500 shadow-sm"
//         : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
//      } ${collapsed ? 'justify-center' : ''}`;

//   const subItemClass = ({ isActive }) =>
//     `flex items-center space-x-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-300
//      ${isActive
//         ? "bg-blue-50 text-blue-600 font-medium"
//         : "text-gray-500 hover:text-blue-500 hover:bg-blue-50/50"
//      }`;

//   const iconWrapperClass = "relative flex items-center justify-center";

//   return (
//     <aside
//       className={`
//         fixed top-0 left-0 h-full bg-white border-r border-gray-200
//         shadow-lg z-[200] transition-all duration-300 ease-out
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         ${collapsed ? "md:w-20" : "md:w-64"}
//         md:translate-x-0 md:static flex flex-col overflow-hidden
//       `}
//     >
//       {/* Collapse Button */}
//       <button
//         onClick={() => dispatch(toggleSidebarCollapse())}
//         className="hidden md:flex absolute -right-3 top-6 w-8 h-8 bg-white 
//                  border border-gray-300 rounded-full items-center justify-center shadow-md
//                  cursor-pointer hover:bg-gray-50 hover:shadow-lg transition-all duration-300 z-10"
//       >
//         <HiMenuAlt3 className="text-gray-700 text-lg" />
//       </button>

//       {/* Logo Section */}
//       <div className="p-6 border-b border-gray-200">
//         {!collapsed ? (
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
//                 <span className="text-white font-bold text-lg">HR</span>
//               </div>
//             </div>
//             <div>
//               <h1 className="text-lg font-bold text-gray-900">AlignUI HR</h1>
//               <p className="text-xs text-gray-500">Management System</p>
//             </div>
//           </div>
//         ) : (
//           <div className="flex justify-center">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
//               <span className="text-white font-bold text-lg">HR</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* User Profile */}
//       {!collapsed && (
//         <div className="px-4 py-3 mx-3 my-2 bg-gray-50 rounded-xl">
//           <div className="flex items-center space-x-3">
//             <div className="relative">
//               <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-semibold text-sm">EB</span>
//               </div>
//               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-gray-900 truncate">Hr Management</p>
//               <p className="text-xs text-gray-600">Waplia Digital Solution Pvt. ltd.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//         {/* Dashboard */}
//         <NavLink to="/hr/dashboard" className={navItemClass} onClick={handleMainNavClick}>
//           <div className={iconWrapperClass}>
//             <AiOutlineDashboard size={20} className="text-gray-600 group-hover:text-blue-600" />
//           </div>
//           {!collapsed && (
//             <div className="ml-3 flex-1 flex items-center justify-between">
//               <span className="text-sm font-medium">Dashboard</span>
//             </div>
//           )}
//         </NavLink>

//         {/* Recruitment */}
//         <div>
//           <button
//             onClick={() => toggleMenu('recruitment')}
//             className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300 group
//                        ${openMenus.recruitment ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
//                        ${collapsed ? 'justify-center' : ''}`}
//           >
//             <div className={iconWrapperClass}>
//               <IoPersonAddOutline size={20} className={openMenus.recruitment ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'} />
//             </div>
//             {!collapsed && (
//               <>
//                 <span className="ml-3 text-sm font-medium flex-1 text-left">Recruitment</span>
//                 <IoChevronDown className={`transition-transform duration-300 ${openMenus.recruitment ? 'rotate-180' : ''}`} />
//               </>
//             )}
//           </button>

//           <AnimatePresence>
//             {openMenus.recruitment && !collapsed && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4"
//               >
//                 <NavLink to="/hr/job-openings" className={subItemClass} onClick={handleSubmenuClick}>
//                   <BiBriefcaseAlt2 size={16} />
//                   <span>Job Openings</span>
//                   <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">12</span>
//                 </NavLink>
//                 <NavLink to="/hr/candidates" className={subItemClass} onClick={handleSubmenuClick}>
//                   <BsPeopleFill size={16} />
//                   <span>Candidates</span>
//                   <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">48</span>
//                 </NavLink>
//                 <NavLink to="/hr/interviews" className={subItemClass} onClick={handleSubmenuClick}>
//                   <MdAssessment size={16} />
//                   <span>Interviews</span>
//                 </NavLink>
//                 <NavLink to="/hr/offers" className={subItemClass} onClick={handleSubmenuClick}>
//                   <BsFileEarmarkText size={16} />
//                   <span>Offer Letters</span>
//                 </NavLink>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Employees */}
//         <div>
//           <button
//             onClick={() => toggleMenu('employees')}
//             className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300 group
//                        ${openMenus.employees ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
//                        ${collapsed ? 'justify-center' : ''}`}
//           >
//             <div className={iconWrapperClass}>
//               <FiUsers size={20} className={openMenus.employees ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'} />
//             </div>
//             {!collapsed && (
//               <>
//                 <span className="ml-3 text-sm font-medium flex-1 text-left">Employees</span>
//                 <IoChevronDown className={`transition-transform duration-300 ${openMenus.employees ? 'rotate-180' : ''}`} />
//               </>
//             )}
//           </button>

//           <AnimatePresence>
//             {openMenus.employees && !collapsed && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4"
//               >
//                 <NavLink to="/hr/employees" className={subItemClass} onClick={handleSubmenuClick}>
//                   <TbUsers size={16} />
//                   <span>All Employees</span>
//                   <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">156</span>
//                 </NavLink>
//                 <NavLink to="/hr/attendance" className={subItemClass} onClick={handleSubmenuClick}>
//                   <BsClockHistory size={16} />
//                   <span>Attendance</span>
//                 </NavLink>
//                 <NavLink to="/hr/documents" className={subItemClass} onClick={handleSubmenuClick}>
//                   <IoDocumentsOutline size={16} />
//                   <span>Documents</span>
//                 </NavLink>
//                 <NavLink to="/hr/appointments" className={subItemClass} onClick={handleSubmenuClick}>
//                   <FaFileContract size={16} />
//                   <span>Appointments</span>
//                 </NavLink>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Payroll */}
//         <NavLink to="/hr/payroll" className={navItemClass} onClick={handleMainNavClick}>
//           <div className={iconWrapperClass}>
//             <MdOutlinePayments size={20} className="text-gray-600 group-hover:text-blue-600" />
//           </div>
//           {!collapsed && (
//             <div className="ml-3 flex-1 flex items-center justify-between">
//               <span className="text-sm font-medium">Payroll</span>
//               <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Due</span>
//             </div>
//           )}
//         </NavLink>

//         {/* Calendar */}
//         <NavLink to="/hr/calendar" className={navItemClass} onClick={handleMainNavClick}>
//           <div className={iconWrapperClass}>
//             <TbCalendarStats size={20} className="text-gray-600 group-hover:text-blue-600" />
//           </div>
//           {!collapsed && (
//             <div className="ml-3 flex-1 flex items-center justify-between">
//               <span className="text-sm font-medium">Calendar</span>
//               <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">3</span>
//             </div>
//           )}
//         </NavLink>

//         {/* Analytics */}
//         <div>
//           <button
//             onClick={() => toggleMenu('analytics')}
//             className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300 group
//                        ${openMenus.analytics ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
//                        ${collapsed ? 'justify-center' : ''}`}
//           >
//             <div className={iconWrapperClass}>
//               <FiTrendingUp size={20} className={openMenus.analytics ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'} />
//             </div>
//             {!collapsed && (
//               <>
//                 <span className="ml-3 text-sm font-medium flex-1 text-left">Analytics</span>
//                 <IoChevronDown className={`transition-transform duration-300 ${openMenus.analytics ? 'rotate-180' : ''}`} />
//               </>
//             )}
//           </button>

//           <AnimatePresence>
//             {openMenus.analytics && !collapsed && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4"
//               >
//                 <NavLink to="/hr/analytics/performance" className={subItemClass} onClick={handleSubmenuClick}>
//                   <AiOutlinePieChart size={16} />
//                   <span>Performance</span>
//                 </NavLink>
//                 <NavLink to="/hr/analytics/reports" className={subItemClass} onClick={handleSubmenuClick}>
//                   <TbReportAnalytics size={16} />
//                   <span>Reports</span>
//                 </NavLink>
//                 <NavLink to="/hr/analytics/insights" className={subItemClass} onClick={handleSubmenuClick}>
//                   <BsGraphUpArrow size={16} />
//                   <span>Insights</span>
//                 </NavLink>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Settings */}
//         <div>
//           <button
//             onClick={() => toggleMenu('settings')}
//             className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300 group
//                        ${openMenus.settings ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
//                        ${collapsed ? 'justify-center' : ''}`}
//           >
//             <div className={iconWrapperClass}>
//               <FiSettings size={20} className={openMenus.settings ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'} />
//             </div>
//             {!collapsed && (
//               <>
//                 <span className="ml-3 text-sm font-medium flex-1 text-left">Settings</span>
//                 <IoChevronDown className={`transition-transform duration-300 ${openMenus.settings ? 'rotate-180' : ''}`} />
//               </>
//             )}
//           </button>

//           <AnimatePresence>
//             {openMenus.settings && !collapsed && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: "auto", opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4"
//               >
//                 <NavLink to="/hr/settings/company" className={subItemClass} onClick={handleSubmenuClick}>
//                   <BsBuilding size={16} />
//                   <span>Company</span>
//                 </NavLink>
//                 <NavLink to="/hr/settings/departments" className={subItemClass} onClick={handleSubmenuClick}>
//                   <HiOutlineOfficeBuilding size={16} />
//                   <span>Departments</span>
//                 </NavLink>
//                 <NavLink to="/hr/settings/permissions" className={subItemClass} onClick={handleSubmenuClick}>
//                   <TbLockPassword size={16} />
//                   <span>Permissions</span>
//                 </NavLink>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </nav>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200">
//         <button
//           onClick={() => dispatch(logout())}
//           className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group w-full
//                      hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center' : ''}`}
//         >
//           <div className={iconWrapperClass}>
//             <TbLogout size={20} className="text-gray-600 group-hover:text-red-600" />
//           </div>
//           {!collapsed && (
//             <div className="ml-3 flex-1 text-left">
//               <span className="text-sm font-medium">Logout</span>
//               {/* <p className="text-xs text-gray-500 mt-0.5">Erşad Başbağ</p> */}
//             </div>
//           )}
//         </button>
//       </div>
//     </aside>
//   );
// }



import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebarCollapse } from '../features/ui/uislic';
import { logout } from '../features/auth/authSlice';
import {
  MdWork,
  MdPeople,
  MdCalendarToday,
  MdDescription,
  MdAssignment,
  MdLogin,
  MdFolder,
  MdDashboard,
  MdEmail,
  MdNotifications,
  MdChat
} from 'react-icons/md';
import {
  HiMenuAlt3,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import {
  FiUser,
  FiLogOut
} from 'react-icons/fi';
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram
} from 'react-icons/fa';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const dispatch = useDispatch();
  const location = useLocation();

  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Navigation items - only the ones you specified
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <MdDashboard />, path: '/hr/dashboard' },
    { id: 'job-openings', label: 'Job Openings', icon: <MdWork />, path: '/hr/job-openings' },
    { id: 'candidates', label: 'Candidates', icon: <MdPeople />, path: '/hr/candidates' },
    { id: 'interview-management', label: 'Interview Management', icon: <MdCalendarToday />, path: '/hr/interviews' },
    { id: 'offer-letter', label: 'Offer Letter', icon: <MdDescription />, path: '/hr/offer-letter' },
    { id: 'appointment-letter', label: 'Appointment Letter', icon: <MdAssignment />, path: '/hr/appointment-letter' },
    { id: 'joining', label: 'Joining', icon: <MdLogin />, path: '/hr/joining' },
    { id: 'documents', label: 'Documents', icon: <MdFolder />, path: '/hr/documents' }
  ];

  // Insight items (from reference image)
  const insightItems = [
    { id: 'inbox', label: 'Inbox', icon: <MdEmail />, path: '/hr/inbox' },
    { id: 'notifications', label: 'Notifications', icon: <MdNotifications />, path: '/hr/notifications' },
    { id: 'chat', label: 'Chat', icon: <MdChat />, path: '/hr/chat' }
  ];

  // ✅ FIX: Sync activeMenu with current URL on mount and location change
  useEffect(() => {
    // Find which menu item matches the current path
    const currentPath = location.pathname;

    // Check navigation items
    const navItem = navigationItems.find(item =>
      item.path === currentPath || currentPath.startsWith(item.path + '/')
    );

    if (navItem) {
      setActiveMenu(navItem.id);
      return;
    }

    // Check insight items
    const insightItem = insightItems.find(item =>
      item.path === currentPath || currentPath.startsWith(item.path + '/')
    );

    if (insightItem) {
      setActiveMenu(insightItem.id);
      return;
    }

    // Default to dashboard if no match
    setActiveMenu('dashboard');
  }, [location.pathname]);

  // Handle menu click for mobile
  const handleMenuClick = (itemId) => {
    setActiveMenu(itemId);
    toggleSidebar?.();
  };

  // ✅ FIX: Simplified navigation item styling - Only use NavLink's isActive
  const navItemClass = (isActive) =>
    `flex items-center px-5 py-3 my-1 rounded-xl transition-all duration-300 group
     ${isActive
      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg'
      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
    } ${collapsed ? 'justify-center px-4' : ''}`;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-100
        shadow-xl z-[200] transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "md:w-20" : "md:w-72"}
        md:translate-x-0 md:static flex flex-col
      `}
    >
      {/* Collapse Button */}
      <button
        onClick={() => dispatch(toggleSidebarCollapse())}
        className="hidden md:flex absolute -right-3 top-8 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 
                 border-2 border-white rounded-full items-center justify-center shadow-xl
                 cursor-pointer hover:shadow-2xl hover:scale-110 transition-all duration-300 z-10"
      >
        {collapsed ? <HiChevronRight className="text-white text-lg" /> : <HiChevronLeft className="text-white text-lg" />}
      </button>

      {/* Logo Section */}
      <div className="py-4 px-6 border-b border-gray-100">
        {!collapsed ? (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">HR</span>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
              <p className="text-xs text-gray-500">Waplia Digital Solutions</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Navigation Section Header */}
        {!collapsed && (
          <div className="px-4 mb-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              NAVIGATION
            </h2>
          </div>
        )}

        {/* Navigation Items - Using only NavLink's isActive */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => navItemClass(isActive)}
              onClick={() => handleMenuClick(item.id)}
               end={item.id === 'dashboard'} // This ensures exact matching for dashboard
            >
              <div className={`${collapsed ? '' : 'mr-3'} transition-all duration-300`}>
                <div className={`text-xl ${activeMenu === item.id ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`}>
                  {item.icon}
                </div>
              </div>
              {!collapsed && (
                <span className="font-medium text-[12px]">{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Insight Section */}
        {!collapsed && (
          <div className="mt-8">
            <div className="px-4 mb-4">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                INSIGHT
              </h2>
            </div>
            <nav className="space-y-1">
              {insightItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => navItemClass(isActive)}
                  onClick={() => handleMenuClick(item.id)}
                >
                  <div className="mr-3">
                    <div className={`text-xl ${activeMenu === item.id ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'}`}>
                      {item.icon}
                    </div>
                  </div>
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="p-5 border-t border-gray-100 bg-gray-50/50">
        {/* Logout Button */}
        <button
          onClick={() => dispatch(logout())}
          className={`
            w-full flex items-center justify-center py-3 rounded-xl 
            bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 
            font-medium hover:from-gray-200 hover:to-gray-300 
            transition-all duration-300 group
            ${collapsed ? 'px-4' : 'px-5'}
          `}
        >
          <FiLogOut className={`${collapsed ? '' : 'mr-2'} text-lg`} />
          {!collapsed && <span>Logout</span>}
        </button>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 HR Management System
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}