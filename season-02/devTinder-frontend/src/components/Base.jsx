import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Base = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = useSelector((store) => store?.user)
  console.log('userdetails-base',userDetails);
  

  //checking if we have userData
  // edgcase, if user is loggedIn and token is set in cookie , and if user goes manually to /login routes then its still showing login page
  const fetchUserData = async () => {
    console.log("fetching userData");
    if (userDetails) return;

    try {
      const res = await axios.get("http://localhost:8080/profile/view", {
        withCredentials: true,
      });

      console.log("res", res);

      if (res?.data) {
        const userData = res?.data?.data;
        dispatch(addUser(userData));
      }
    } catch (error) {
      if (error.status === 401) {
        navigate("/login");
      }
      console.log("error fetching user data", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Base;
