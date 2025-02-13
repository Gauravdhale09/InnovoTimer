import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import SPLoader from "./Loading/SpinnerLoader";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };

    setIsLoading(true);
    const { data } = await axios.post(
      "http://127.0.0.1:8001/auth/login/",
      user
    );
    setIsLoading(false);
    Cookies.set("access_token", data.access_token, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refresh_token", data.refresh_token, {
      secure: true,
      sameSite: "Strict",
    });

    navigate("/");
  };
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <SPLoader isLoading={isLoading} />
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">

            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              required
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="mb-3">

            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
