import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import axios from "axios";

const EditProfile = ({ user }) => {
  const [email, setEmail] = useState(user?.emailId);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [age, setAge] = useState(user?.age);

  const dispatch = useDispatch();

  // edit profile details
  const editProfileDetails = async (e) => {
    e.preventDefault();
    console.log("edit-profile clicked");

    try {
      const res = await axios.patch(
        "http://localhost:8080/profile/edit",
        {
          firstName,
          lastName,
          age,
          //   photoUrl,
          //   gender,
          //   about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      //   setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      // setError(err.response.data);
    }
  };

  return (
    <div className="flex justify-center my-10 gap-5">
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-center">Edit Profile</h2>
            <form>
              <div className="">
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
              </div>

              <div className="">
                <label className="form-control w-full mt-12">
                  <div className="label">
                    <span className="label-text">firstName</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>
              </div>

              <div className="">
                <label className="form-control w-full mt-12">
                  <div className="label">
                    <span className="label-text">lastName</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="">
                <label className="form-control w-full mt-12">
                  <div className="label">
                    <span className="label-text">age</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </label>
              </div>

              <button
                className="btn btn-primary w-full mt-4"
                onClick={editProfileDetails}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
      <UserCard userDetails={{ firstName, lastName, age }} />
    </div>
  );
};

export default EditProfile;
