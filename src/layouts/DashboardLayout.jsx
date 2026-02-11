
import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Avatar, { genConfig } from "react-nice-avatar";
import { logout } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/reuseable/Header";


export default function AdminLayout() {
  const dispacth = useDispatch();
  const baseurl = import.meta.env.VITE_API_BASE_URL;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
const getStoredUser = () => {
  const user = localStorage.getItem("hr");
  return user ? JSON.parse(user) : null;
};

  // const user = JSON.parse(localStorage.getItem("user") || "{}");
const storedUser = getStoredUser();

const { data } = useQuery({
  queryKey: ["adminDetails"],
  queryFn: () => apiGet(apiPath.getAdminProfile),
  initialData: storedUser
    ? { results: storedUser }
    : undefined,
  staleTime: 5 * 60 * 1000,
});

const user = data?.results || {};
console.log("user",user);
let username = user?.username?.charAt(0).toUpperCase();
console.log("username",username);

  // console.log("user",user);
  const config = genConfig({ sex: "man", faceColor: "#d2a679", bgColor: "yellow" });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const goToProfile = () => {
    navigate("/hr/profile");
    setMenuOpen(false);
  };

  // Close menu on outside click
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
    <div className="flex h-screen w-full bg-[var(--color-neutral)]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && (
  <div
    className="fixed inset-0 bg-black/40 z-[4] md:hidden"
    onClick={() => setSidebarOpen(false)}
  />
)}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}

<Header toggleSidebar={toggleSidebar} goToProfile={goToProfile} dispatch={dispacth} logout={logout} />
        {/* Page Content */}
        <main className="flex-1 bg-[var(--bg-surface)] overflow-auto">
          <div className="w-full bg-[var(--bg-surface)]  md:p-4 overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
