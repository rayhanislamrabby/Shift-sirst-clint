import { NavLink, Outlet } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaChartPie,
  FaBox,
  FaMoneyCheckAlt,
  FaSearchLocation,
  FaUserCog,
  FaCrown,
  FaMotorcycle,
  FaUserClock,
  FaUsers,
} from "react-icons/fa";

import { useState } from "react";
import ShiftFirstLogo from "../pages/shared/Navbar/ShiftFirstLogo";
import useUserRole from "../hook/useUserRole";

const DashbordLayout = () => {
  const { role, isRoleLoading } = useUserRole();

  console.log("User role:", role);

  const [collapsed, setCollapsed] = useState(false); // desktop
  const [mobileOpen, setMobileOpen] = useState(false); // mobile

  return (
    <div className="flex min-h-screen bg-[#F4F7FB] text-slate-700">
      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          z-50 bg-white border-r h-full

          /* MOBILE */
          fixed md:relative
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
          md:translate-x-0 md:transition-none

          /* DESKTOP */
          ${collapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2 overflow-hidden">
            <ShiftFirstLogo />
          </div>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-lg"
          >
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 text-sm">
          <NavItem
            to="/dashbord"
            icon={<FaChartPie />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <NavItem
            to="/dashbord/myparcels"
            icon={<FaBox />}
            label="My Parcels"
            collapsed={collapsed}
          />
          <NavItem
            to="/dashbord/PaymentHistory"
            icon={<FaMoneyCheckAlt />}
            label="Payments"
            collapsed={collapsed}
          />
          <NavItem
            to="/dashbord/track"
            icon={<FaSearchLocation />}
            label="Tracking"
            collapsed={collapsed}
          />
          <NavItem
            to="/dashbord/profile"
            icon={<FaUserCog />}
            label="Settings"
            collapsed={collapsed}
          />

          {!isRoleLoading && role === "admin" && (
            <>
              <NavItem
                to="/dashbord/assign-raider"
                icon={<FaMotorcycle />}
                label="Assign Raider"
                collapsed={collapsed}
              />

              <NavItem
                to="/dashbord/ActiveRider"
                icon={<FaMotorcycle />}
                label="Active Riders"
                collapsed={collapsed}
              />

              <NavItem
                to="/dashbord/pendingRiders"
                icon={<FaUserClock />}
                label="Pending Riders"
                collapsed={collapsed}
              />

              <NavItem
                to="/dashbord/MakeAdmin"
                icon={<FaUsers />}
                label="Make Admin"
                collapsed={collapsed}
              />
            </>
          )}
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-slate-100"
            >
              <FaBars />
            </button>

            {/* Desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex p-2 rounded-md hover:bg-slate-100"
            >
              <FaBars />
            </button>

            <h1 className="text-base md:text-lg font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashbordLayout;

/* ===== NAV ITEM ===== */
const NavItem = ({ to, icon, label, collapsed }) => {
  const isActive = false; // Define a default value for isActive

  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `
      relative group flex items-center gap-3 px-3 py-2 rounded-md text-sm
      transition-colors duration-200
      ${
        isActive
          ? "text-blue-600 bg-blue-50 font-semibold"
          : "text-slate-600 hover:text-blue-600 hover:bg-slate-100"
      }
    `
      }
    >
      {/* Left active indicator */}
      <span
        className={`absolute left-0 top-0 h-full w-1 rounded-r-md
        ${isActive ? "bg-blue-600" : "bg-transparent"}
      `}
      />

      <span className="text-lg shrink-0">{icon}</span>

      {!collapsed && (
        <span className="whitespace-nowrap tracking-tight">{label}</span>
      )}
    </NavLink>
  );
};

/* ===== NAVBAR ===== */
const Navbar = () => {
  return (
    <div className="navbar bg-base-200 shadow justify-between px-6">
      <ShiftFirstLogo />
      <div className="flex items-center">
        <span className="font-bold mr-4">Premium</span>
        <FaCrown className="text-yellow-500" size={24} />
      </div>
    </div>
  );
};
