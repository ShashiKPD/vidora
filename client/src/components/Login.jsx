import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import logo from "/assets/logo-color.png";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authStatus, status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (authStatus) navigate("/");
  }, [authStatus, navigate]);

  const handleLogin = async (data) => {
    dispatch(login(data));
  };

  return (
    <div className="flex h-screen">
      {/* left half */}
      <div className="w-1/2 hidden sm:block">
        <img
          src="https://images.pexels.com/photos/1115816/pexels-photo-1115816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="left banner image"
          className="object-cover h-full overflow-hidden"
        />
      </div>
      {/* right half */}
      <div className="flex w-full sm:w-1/2 justify-center">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col gap-6 h-screen w-[70%] self-center justify-center "
        >
          <img src={logo} alt="logo" className="w-56 mb-6" />
          <p className="text-slate-400 ">
            Log in Below or{" "}
            <Link to="/register" className="text-slate-950 font-medium">
              sign up
            </Link>{" "}
            to create a Videora account
          </p>
          <div className="w-full flex flex-col gap-1">
            <div className="w-full">
              <input
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "username is required",
                })}
                className="py-2 px-3 rounded-t-xl bg-slate-200 w-full"
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "password is required",
                })}
                className="py-2 px-3 rounded-b-xl bg-slate-200 w-full"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 text-white"
          >
            {status === "loading" ? "Logging in.." : "Login"}
          </button>
          {status === "loading" && <p>Submitting...</p>}
          {error && <p>Error: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
