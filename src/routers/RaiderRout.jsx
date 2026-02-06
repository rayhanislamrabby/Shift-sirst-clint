import React from "react";
import useAuth from "../hook/useAuth";
import useUserRole from "../hook/useUserRole";
import GridLoader from "react-spinners/GridLoader";

const RaiderRout = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, isRoleLoading } = useUserRole();

  if (loading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GridLoader color="#0B3F45" size={15} />
      </div>
    );
  }

  if (!user || role !== "rider") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default RaiderRout;
