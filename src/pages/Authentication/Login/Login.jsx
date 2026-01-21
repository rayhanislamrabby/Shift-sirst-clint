import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocalLogin from "../SocalLogin/SocalLogin";
import useAuth from "../../../hook/useAuth";


const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
const {singIn} =useAuth()
const location = useLocation();
const navigate = useNavigate();

const from = location.state?.from || "/"

  const onsubmit = (data) => {
singIn(data.email, data.password)
.then( result => {
console.log(result.user)
navigate(from)

})
.catch( error => console.log(error))
  };





  return (
    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
      <div className="card-body">
             <h1 className="text-xl font-semibold mb-4"> Login a account!</h1>
        <form onSubmit={handleSubmit(onsubmit)}>
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="Email"
            />

            <label className="label">Password</label>

            <input
              type="password"
              {...register("password", { required: true, minLength: 6 })}
              className="input"
              placeholder="Password"
            />

            {errors.password?.type === "required" && (
              <p className=" text-red-600">Password is required</p>
            )}

            {errors.password?.type === "minLength" && (
              <p className="text-red-400">
                Password must be 6 charactor and longers
              </p>
            )}
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
          </fieldset>
          <button className="btn btn-neutral mt-4 w-full">Login</button>
        </form>
          <p>Already have a account?<Link className="btn text-red-600 btn-link" to="/register">Register</Link> </p>
          <SocalLogin></SocalLogin>
      </div>
    </div>
  );
};

export default Login;
