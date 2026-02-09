import React from "react";

import Forbidden from "../../Forbidden/Forbidden";
import useUserRole from "../../../hook/useUserRole";
import UserDashbord from "./UserDashbord";
import RaiderDashbord from "./RaiderDashbord";
import AdminDashbord from "./AdminDashbord";

const Dashbordhome = () => {
  const { role, isRoleLoading } = useUserRole();

  if (isRoleLoading) {
    return <span className="loading loading-dots loading-xl"></span>;
  }

  if (role === "user") {
    return <UserDashbord />;
  } else if (role === "rider") {
    return <RaiderDashbord />;
  } else if (role === "admin") {
    return <AdminDashbord />;
  } else {
    return <Forbidden />;
  }
};

export default Dashbordhome;
