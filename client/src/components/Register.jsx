import { registerUser, clearError, clearStatus } from "@/store/authSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "/assets/logo-color.png";
import { IoCloudUpload } from "react-icons/io5";

const RegisterComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authStatus, status, error } = useSelector((state) => state.auth);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const avatarFile = watch("avatar");

  useEffect(() => {
    if (authStatus) navigate("/");
    dispatch(clearError());
    dispatch(clearStatus());
  }, [authStatus, navigate]);

  useEffect(() => {
    if (status === "succeeded") {
      navigate("/login");
    }
  }, [status]);

  //for avatarFile preview
  useEffect(() => {
    if (avatarFile && avatarFile[0]) {
      const file = avatarFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }, [avatarFile]);

  const handleRegister = async (data) => {
    const fullName = data?.firstName.trim() + " " + data?.lastName.trim();

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]);
    }

    if (status !== "loading") {
      dispatch(registerUser(formData));
    }
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
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-6 h-screen w-[70%] self-center justify-center "
        >
          <img src={logo} alt="logo" className="w-56 mb-6" />
          <p className="text-slate-400 ">
            Already have an account?{" "}
            <Link to="/login" className="text-slate-950 font-medium">
              Log in
            </Link>{" "}
            .
          </p>
          <div className="w-full flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  className="py-2 px-3 rounded-tl-xl bg-slate-200 w-full"
                />
                {errors.firstName && (
                  <p className="text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  className="py-2 px-3 rounded-tr-xl bg-slate-200 w-full"
                />
                {errors.lastName && (
                  <p className="text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Username"
                {...register("username", {
                  required: "username is required",
                })}
                className="py-2 px-3 bg-slate-200 w-full"
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Email"
                {...register("email", {
                  required: "email is required",
                  validate: {
                    matchPattern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
                  },
                })}
                className="py-2 px-3 bg-slate-200 w-full"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
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
            <div className="mt-3">
              <label className="text-slate-400">
                Upload Avatar image <span>(optional)</span>
              </label>
              <label
                htmlFor="avatar-image"
                className="
                flex flex-col items-center border-2 py-5 mt-1 text-center w-full bg-slate-200 border-slate-400 rounded-xl"
              >
                {avatarPreview && (
                  <div className="w-1/3">
                    <img src={avatarPreview} alt="avatar preview" />
                  </div>
                )}
                {avatarFile && avatarFile.length > 0 ? (
                  avatarFile[0].name
                ) : (
                  <>
                    <IoCloudUpload className="text-2xl" />
                    <span className="underline underline-offset-1 text-slate-700">
                      Click to upload
                    </span>{" "}
                    <span className="block text-slate-400">PNG, JPG, JPEG</span>
                  </>
                )}
              </label>
              {/* The below file input element is hidden using css */}
              <input
                id="avatar-image"
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("avatar", {
                  required: "Avatar image is required",
                })}
                className={`${errors.image ? "border-red-500 mb-1" : "mb-4"}
                py-2 mt-3 hidden bg-slate-200 w-full rounded-xl`}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 text-white"
          >
            {status === "loading" ? "Registering.." : "Register"}
          </button>
          {status === "loading" && <p>Submitting...</p>}
          {error && <p>Error: {error}</p>}
          {status === "succeeded" && <p>User has been registered</p>}
        </form>
      </div>
    </div>
  );
};

export default RegisterComponent;
