import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const userDetails = useSelector((store) => store?.user);
  return <>{userDetails && <EditProfile user={userDetails} />}</>;
};

export default Profile;
