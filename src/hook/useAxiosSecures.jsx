import axios from "axios";
import React from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
});

const useAxiosSecures = () => {
  const { user, logOut } = useAuth();

  const navigate = useNavigate();

  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;

      return config;
    },
    (eroor) => {
      return Promise.reject(eroor);
    },
  );
  axiosSecure.interceptors.response.use(
    (res) => {
      return res;
    },
    (eroor) => {
      const status = eroor.status;
      if (status === 403) {
        navigate("/forbidden");
      } else if (status === 401) {
        logOut()
          .then(() => {
            navigate("/login");
          })
          .catch(() => {});
      }

      return Promise.reject(eroor);
    },
  );

  return axiosSecure;
};

export default useAxiosSecures;
