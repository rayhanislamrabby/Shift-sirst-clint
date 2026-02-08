// import axios from "axios";
// import React from "react";
// import useAuth from "./useAuth";
// import { useNavigate } from "react-router";

// const axiosSecure = axios.create({
//   baseURL: `http://localhost:5000`,
// });

// const useAxiosSecures = () => {
//   const { user, logOut } = useAuth();

//   const navigate = useNavigate();

//   axiosSecure.interceptors.request.use(
//     (config) => {
//       config.headers.Authorization = `Bearer ${user.accessToken}`;

//       return config;
//     },
//     (eroor) => {
//       return Promise.reject(eroor);
//     },
//   );
//   axiosSecure.interceptors.response.use(
//     (res) => {
//       return res;
//     },
//     (eroor) => {
//       const status = eroor.status;
//       if (status === 403) {
//         navigate("/forbidden");
//       } else if (status === 401) {
//         logOut()
//           .then(() => {
//             navigate("/login");
//           })
//           .catch(() => {});
//       }

//       return Promise.reject(eroor);
//     },
//   );

//   return axiosSecure;
// };

// export default useAxiosSecures;
import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: "http://localhost:5000",
});

const useAxiosSecures = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken(); // ✅ correct token
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status; // ✅ correct status

        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // cleanup interceptors
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecures;
