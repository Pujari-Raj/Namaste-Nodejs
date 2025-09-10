import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import axios from "axios";

const UserCard = ({ userDetails }) => {
  console.log("userDetails-card", userDetails);
  const { firstName, lastName, gender, skills, age, _id } = userDetails;

  console.log('loggedIn-user-id',_id);
  

  const user = useSelector((store) => store?.feed);
  console.log("user-from redux", user);
  const dispatch = useDispatch();

  //
  const handleFeedRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/request/send/${status}/${_id}`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch(removeUserFromFeed(_id));
    } catch (error) {
      console.log("error sending/ignoring request", error);
    }
  };

  return (
    <>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {`${firstName} ${lastName}`} {age}
          </h2>
          <p>
            A card component has a figure, a body part, and inside body there
            are title and actions parts
          </p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => handleFeedRequest("IGNORED", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleFeedRequest("INTERESTED", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
