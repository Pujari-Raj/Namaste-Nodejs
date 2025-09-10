import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLoginForm
        ? "http://localhost:8080/login"
        : "http://localhost:8080/signup";

      const payload = isLoginForm
        ? { emailId: email, password }
        : { firstName, lastName, emailId: email, password };

      const res = await axios.post(url, payload, {
        withCredentials: true,
      });

      if (isLoginForm) {
        const userData = res?.data?.data;
        dispatch(addUser(userData));
        navigate("/");
      } else {
        alert("signup successful");
        setIsLoginForm(true);
      }
    } catch (error) {
      console.error(`${isLoginForm ? "Login" : "Signup"}`, error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">
            {isLoginForm ? "Login" : "SignUp"}
          </h2>
          <form onSubmit={handleSubmit}>
            {!isLoginForm && (
              <>
                <label className="form-control w-full mb-4">
                  <div className="label">
                    <span className="label-text">FirstName</span>
                  </div>
                  <input
                    type="name"
                    placeholder="Enter your name"
                    className="input input-bordered w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>
                <label className="form-control w-full mb-4">
                  <div className="label">
                    <span className="label-text">LastName</span>
                  </div>
                  <input
                    type="name"
                    placeholder="Enter your LastName"
                    className="input input-bordered w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </>
            )}
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

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-2 border rounded-lg pr-10"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-4"
              // onClick={handleLogin}
            >
              {isLoginForm ? "Login" : "SignUp"}
            </button>

            <p
              onClick={() => setIsLoginForm(!isLoginForm)}
              className="mt-4 text-center text-sm text-blue-600 cursor-pointer hover:underline"
            >
              {isLoginForm
                ? "New user? Create an account"
                : "Already have an account? Log in"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
