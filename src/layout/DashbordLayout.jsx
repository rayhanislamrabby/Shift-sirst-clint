import React from 'react';
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, NavLink, Outlet } from "react-router-dom";
import { FaBars ,FaHome, } from "react-icons/fa";
import ShiftFirstLogo from '../pages/shared/Navbar/ShiftFirstLogo';
import { LuShoppingBasket } from "react-icons/lu";



const DashbordLayout = () => {

 const [collapsed] = useState(false);
  const [toggled, setToggled] = useState(false); // for mobile

    return (
        <div>
            <ShiftFirstLogo></ShiftFirstLogo>
             <div className="flex min-h-screen mt-3">


      {/* Sidebar */}
      <Sidebar
        breakPoint="lg"
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        className="bg-base-200"
      >
  

        <Menu>
          <MenuItem icon={<FaHome />} >
            <NavLink>Home</NavLink>
          </MenuItem>
        
        <MenuItem icon={<LuShoppingBasket />}>
        <NavLink to="/dashbord/myparcels"> My Parcel</NavLink>
        </MenuItem>
        </Menu>
      </Sidebar>

      {/* Main Area */}
      <div className="flex flex-col flex-1">

        {/* Top bar */}
        <div className="navbar bg-base-200 shadow lg:hidden">
          <button
            className="btn btn-square btn-ghost"
            onClick={() => setToggled(true)}
          >
            <FaBars />
          </button>
          <span className="ml-3 font-bold"> Dashboard</span>
        </div>

        {/* Desktop topbar */}
        <div className="hidden lg:flex navbar bg-base-200 shadow justify-between px-6">
          
          <span className="font-bold">Dashbord</span>
        </div>

        {/* Content */}
        <div className="p-6 bg-base-100 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
        </div>
    );
};

export default DashbordLayout;