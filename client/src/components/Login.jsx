import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/authSlice";

const LoginComponent = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const status = useSelector((state) => state.auth.status);
  const error = useSelector((state) => state.auth.error);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = () => {
    dispatch(login(credentials));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      {authStatus ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
      {status === "loading" && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default LoginComponent;
