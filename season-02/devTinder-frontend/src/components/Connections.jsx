import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionsSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  //api call
  const getConnections = async () => {
    try {
      const res = await axios.get("http://localhost:8080/user/connections", {
        withCredentials: true,
      });
      if (res?.data) {
        const connectionsData = res?.data?.data;

        console.log("connections-data", connectionsData);
        dispatch(addConnections(connectionsData));
      }
    } catch (error) {
      console.log("error fetching user data", error.message);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-gray-600 text-3xl">Connections</h1>

      {connections?.map((connection) => {
        const { _id, firstName, lastName, age, gender, about } = connection;

        return (
          <div
            key={_id}
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              {age && gender && <p>{age + ", " + gender}</p>}
              <p>{about}</p>
            </div>
            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary">Chat</button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
