import React from "react";
import useAxiosSecures from "./useAxiosSecures";

const useTrackingLogger = () => {
  const axiosSecures = useAxiosSecures();

  const logTracking = async ({
    tracking_id,
    status,
    details,
    location,
    updated_by,
  }) => {
    try {
      const payload = {
        tracking_id,
        status,
        details,
        location,
        updated_by,
      };

      await axiosSecures.post("/trackings", payload);
    } catch (error) {
      console.error("Failed to log tracking:", error);
    }
  };

  return { logTracking };
};

export default useTrackingLogger;
