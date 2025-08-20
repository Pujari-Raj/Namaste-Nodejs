import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("prasad@gmail.com");
  const [password, setPassword] = useState("Venky@007");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // login api
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      console.log("calling handlelogin functn");

      const res = await axios.post(
        "http://localhost:8080/login",
        {
          emailId: email,
          password: password,
        },
        { withCredentials: true } // why do I need to add this
      );

      console.log("res", res?.data?.data);
      const userData = res?.data?.data;
      dispatch(addUser(userData));
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Login</h2>
          <form>
            <label className="form-control w-full mb-4">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="form-control w-full mt-12">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
