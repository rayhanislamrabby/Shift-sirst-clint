import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hook/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocalLogin from "../SocalLogin/SocalLogin";
import Swal from "sweetalert2";
import axios from "axios";
import useAxios from "../../../hook/useAxios";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createUser, updateUserProfile } = useAuth();
  const [profilePic, setprofilePic] = useState("");
  const axiosinstance = useAxios();
 const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";


  const onsubmit = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);

        // update userinfo in tha dataves

        const userInfo = {
          email: data.email,
          role: "user", // default role
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosinstance.post("/users", userInfo);
        console.log(userRes.data);

        // update user profile in firebase
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };
        updateUserProfile(userProfile)
          .then(() => {
            console.log("profile name pic pdate ");
            navigate(from);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelImageUpload = async (e) => {
    const image = e.target.files[0];

    const formData = new FormData();
    formData.append("image", image);

    const imgUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;

    const res = await axios.post(imgUploadUrl, formData);
    // ✅ ONLY STRING URL
    setprofilePic(res.data.data.display_url);
    // setprofilePic(res.data);
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
        <h1 className="text-xl font-semibold mb-4">Create a new account!</h1>

        <fieldset className="fieldset">
          <form onSubmit={handleSubmit(onsubmit)}>
            {/* ===== NAME (ADDED) ===== */}
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input"
              placeholder="Your Name"
            />
            {errors.name && (
              <p className="text-red-700 text-sm">Name is required</p>
            )}

            <label className="label">Photo </label>
            <input
              type="file"
              onChange={handelImageUpload}
              className="input"
              placeholder="Yout Name"
            />

            {/* email find  */}

            <label className="label">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-700 text-sm">Email is required</p>
            )}

            <label className="label">Password</label>
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: 6,
              })}
              className="input"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600 text-sm">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-700 text-sm">
                Password must be at least 6 characters
              </p>
            )}

            <button type="submit" className="btn btn-neutral mt-4 w-full">
              Register
            </button>
          </form>
        </fieldset>
        <p>
          Already have a account?
          <Link className="btn text-red-600 btn-link" to="/login">
            Login
          </Link>{" "}
        </p>
        <SocalLogin></SocalLogin>
      </div>
    </div>
  );
};

export default Register;
