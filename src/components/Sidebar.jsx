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


import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebarCollapse } from "../features/ui/uislic";
import { logout } from "../features/auth/authSlice";
import {
  MdWork, MdPeople, MdCalendarToday, MdDescription,
  MdAssignment, MdLogin, MdFolder, MdDashboard,
  MdSettings, MdHelpOutline
} from "react-icons/md";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard />, path: "/hr/dashboard" },
    { id: "job-openings", label: "Job Openings", icon: <MdWork />, path: "/hr/job-openings" },
    { id: "candidates", label: "Candidates", icon: <MdPeople />, path: "/hr/candidates" },
    { id: "interviews", label: "Interviews", icon: <MdCalendarToday />, path: "/hr/interviews" },
    { id: "offer-letter", label: "Offer Letter", icon: <MdDescription />, path: "/hr/offer-letter" },
    { id: "appointment-letter", label: "Appointment Letter", icon: <MdAssignment />, path: "/hr/appointment-letter" },
    { id: "joining", label: "Onboarding", icon: <MdLogin />, path: "/hr/joining" },
    { id: "documents", label: "Documents", icon: <MdFolder />, path: "/hr/documents" }
  ];

  const systemItems = [
    { id: "settings", label: "Settings", icon: <MdSettings />, path: "/hr/settings" },
    { id: "help", label: "Help & Support", icon: <MdHelpOutline />, path: "/hr/help" }
  ];

  useEffect(() => {
    const all = [...navigationItems, ...systemItems];
    const found = all.find(i => location.pathname.startsWith(i.path));
    setActiveMenu(found?.id || "dashboard");
  }, [location.pathname]);

  const navItem = (active) =>
    `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
     ${active
      ? "bg-[var(--primary-soft)] text-[var(--primary)] border-l-4 border-[var(--primary)]"
      : "text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--text-primary)]"
     }
     ${collapsed ? "justify-center px-3" : ""}
    `;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-[999]
        bg-[var(--bg-surface)]
        border-r border-[var(--border-color)]
        transition-all duration-300 w-60
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${collapsed ? "md:w-20" : "md:w-72"}
        md:translate-x-0 md:static flex flex-col
      `}
    >
      {/* Collapse Button */}
      <button
        onClick={() => dispatch(toggleSidebarCollapse())}
        className="
          hidden md:flex absolute -right-3.5 top-24 w-7 h-7
          bg-gradient-to-br from-blue-500 to-blue-600
          rounded-full items-center justify-center
          border-2 border-white shadow-lg
        "
      >
        {collapsed ? <HiChevronRight className="text-white" /> : <HiChevronLeft className="text-white" />}
      </button>

      {/* Logo */}
      <div className="px-6 py-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            HR
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-[var(--text-primary)]">HR Portal</h1>
              <p className="text-xs text-[var(--text-secondary)]">Waplia Digital</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 overflow-y-auto">
        <nav className="space-y-1">
          {navigationItems.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={navItem(activeMenu === item.id)}
              onClick={() => toggleSidebar?.()}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <>
            <div className="mt-8 mb-2 px-3 text-[11px] uppercase tracking-widest text-[var(--text-secondary)]">
              System
            </div>
            <nav className="space-y-1">
              {systemItems.map(item => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={navItem(activeMenu === item.id)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <button
          onClick={() => dispatch(logout())}
          className="
            w-full flex items-center justify-center py-3 rounded-xl
            bg-[var(--primary-soft)] text-[var(--text-primary)]
            hover:text-red-500 transition-all
          "
        >
          <FiLogOut className={`${collapsed ? "" : "mr-3"}`} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {!collapsed && (
          <p className="mt-4 text-xs text-center text-[var(--text-secondary)]">
            v2.4.1 © 2024
          </p>
        )}
      </div>
    </aside>
  );
}
