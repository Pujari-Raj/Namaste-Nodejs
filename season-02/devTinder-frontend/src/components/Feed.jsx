import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store?.feed)
  // const navigate = useNavigate();
  // getting all feed data
  const getFeedData = async () => {
    //
    try {
      const res = await axios.get("http://localhost:8080/user/feed", {
        withCredentials: true,
      });

      if (res?.data) {
        const feedData = res?.data?.users;
        console.log("feed-data", feedData);
        dispatch(addFeed(feedData));
      }
    } catch (error) {
      console.log('error fetching user data',error.message);
    }
  };

  useEffect(() => {
    getFeedData();
  }, [])
  
  return (
    <>
      {feedData && (
        <UserCard userDetails={feedData[0]} />
      )}
    </>
  );
};

export default Feed;
