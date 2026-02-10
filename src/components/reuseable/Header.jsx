import { useState, useEffect, useRef } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { FaBars, FaSun, FaMoon, FaUser, FaSignOutAlt, FaCog, FaChevronDown } from "react-icons/fa";
import { HiOutlineBell } from "react-icons/hi";
import { IoSettingsOutline } from "react-icons/io5";

const Header = ({ toggleSidebar, goToProfile, dispatch, logout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [avatarSeed, setAvatarSeed] = useState("");

  const [user, setUser] = useState({
    username: "",
    lastName: "",
    profilePic: "",
    email: "",
    role: "HEAD OF HR"
  });
  const [avatarSvg, setAvatarSvg] = useState("");
  const menuRef = useRef(null);

  // Load user data and generate avatar
  useEffect(() => {
    const userData = localStorage.getItem("hr");
    console.log("userData",userData);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log("parsedUser",parsedUser);
      setUser(parsedUser);
      
      // Generate professional avatar based on user data
      generateAvatar(parsedUser);
    } else {
      // Default fallback avatar
      generateDefaultAvatar();
    }
    
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);
useEffect(() => {
  const randomSeed = Math.random().toString(36).substring(2, 10);
  setAvatarSeed(randomSeed);
}, []);

  const generateAvatar = (userData) => {
    const avatar = createAvatar(avataaars, {
      seed: userData.name || userData.username || "Admin",
      backgroundColor: ["0ea5e9", "0284c7", "0369a1"],
      backgroundType: ["gradientLinear"],
      clothesColor: ["ffffff", "f8fafc"],
      clothes: ["shirt", "blazer", "sweater"],
      eyes: ["happy", "default", "wink"],
      eyebrows: ["default", "defaultNatural", "flatNatural"],
      mouth: ["smile", "twinkle", "default"],
      hair: ["long", "bob", "curly"],
      hairColor: ["4a5568", "2d3748", "1a202c"],
      facialHairProbability: 0,
      accessories: ["round", "prescription01", "prescription02"],
      accessoriesProbability: 50,
      accessoriesColor: ["64748b"],
      skinColor: ["f8d9b7", "d08b5b", "ae5d29"],
      style: ["circle"],
    });

    setAvatarSvg(avatar.toString());
  };

  const generateDefaultAvatar = () => {
    const avatar = createAvatar(avataaars, {
      seed: "Hr Manager",
      backgroundColor: ["0ea5e9"],
      backgroundType: ["gradientLinear"],
      clothes: ["blazer"],
      clothesColor: ["ffffff"],
      eyes: ["default"],
      eyebrows: ["defaultNatural"],
      mouth: ["smile"],
      hair: ["long"],
      hairColor: ["2d3748"],
      facialHairProbability: 0,
      accessories: ["round"],
      accessoriesColor: ["64748b"],
      skinColor: ["f8d9b7"],
      style: ["circle"],
    });

    setAvatarSvg(avatar.toString());
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user.email ? user.email.charAt(0).toUpperCase() : "A";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
  <header
  className="
    h-20 w-full flex items-center justify-between
    px-6 md:px-8 border-b transition-colors
    bg-[var(--bg-surface)]
    border-[var(--border-color)]
    text-[var(--text-primary)]
  "
>

      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl md:hidden text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Toggle sidebar"
        >
          <FaBars size={22} />
        </button>
        
        <div className="hidden md:block">
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                HR<span className="text-blue-600 ml-1">Management</span>
              </h1>
              <p className="text-xs text-blue-500 font-medium mt-0.5">
                {user.role || "Head of HR"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:hidden">
          <h1 className="text-xl font-bold text-gray-800">
            Admin<span className="text-blue-600">Panel</span>
          </h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6" ref={menuRef}>
        {/* Notifications */}
        {/* <button className="relative p-2.5 rounded-xl text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:outline-none group">
          <HiOutlineBell size={22} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            3
          </span>
          <div className="absolute -bottom-10 right-0 w-64 bg-white shadow-xl rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-bottom-12 transition-all duration-300 z-10">
            <p className="text-sm font-medium text-gray-700 px-2 py-1">You have 3 new notifications</p>
          </div>
        </button> */}

        {/* Settings */}
        {/* <button className="p-2.5 rounded-xl text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 focus:outline-none">
          <IoSettingsOutline size={22} />
        </button> */}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-offset-2"
          aria-label="Toggle theme"
        >
          {theme === "light" ? <FaMoon size={15} /> : <FaSun size={15} />}
        </button>

        {/* Separator */}
        <div className="h-8 w-px bg-blue-200 hidden md:block"></div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-4 cursor-pointer group focus:outline-none"
          >
            <div className="text-right hidden lg:block">
              <p className="font-semibold text-gray-800 text-sm">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[14px] font-medium text-blue-500">
                Hr {user.username.charAt(0).toUpperCase() + user.username.slice(1) || "HR"}
              </p>
            </div>

            {/* Modern Avatar with Badge */}
            <div className="relative">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white ring-offset-2 ring-offset-blue-50 shadow-lg group-hover:ring-blue-100 transition-all duration-300">
                {avatarSvg ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: avatarSvg }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials()}
                  </div>
                )}
              </div>
              
              {/* Online Status Badge */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            {/* Chevron with Animation */}
            <FaChevronDown 
              className={`text-blue-400 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""} group-hover:text-blue-600`}
              size={16}
            />
          </button>

          {/* Modern Dropdown Menu */}
          {menuOpen && (
            <div  className="absolute right-0 mt-3 w-64 border border-blue-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-slideDown">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-13 h-12 rounded-2xl overflow-hidden ring-2 ring-white shadow-lg">
                      {avatarSvg ? (
                        <div 
                          dangerouslySetInnerHTML={{ __html: avatarSvg }}
                          className="w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                          {getInitials()}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium">
                      {user.username.charAt(0).toUpperCase() + user.username.slice(1) || "HR"}
                    </p>
                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {user.role || "Head of HR"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4">
               

                {/* Logout Button */}
                <div className="mt-1 pt-1 border-t border-blue-100">
                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-8 h-6 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <FaSignOutAlt className="text-red-600" size={18} />
                    </div>
                    <div>
                      <p className="font-medium cursor-pointer text-gray-800">Logout</p>
                      {/* <p className="text-sm text-red-500">Sign out of your account</p> */}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;