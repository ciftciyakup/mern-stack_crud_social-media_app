import React from "react";
import { Link } from "react-router-dom";
import { BASE_PROFILE_IMAGE_URL } from "../../../utils/constants";

const SearchUserItem = ({
  _id,
  username,
  fullname,
  avatar,
  params,
  userType,
}) => {
  return (
    <Link
      to={
        !params
          ? `/sosyal/${username}`
          : params?.athleteType === "milli"
          ? `/milli_sporcularimiz/${username}`
          : `/sporcularimiz/${username}`
      }
      className="flex items-center hover:bg-gray-50 py-2 px-4 cursor-pointer"
    >
      <div className="flex space-x-3 items-center">
        <img
          className="w-11 h-11 rounded-full object-cover"
          src={BASE_PROFILE_IMAGE_URL + avatar}
          alt="avatar"
        />
        <div className="flex flex-col items-start">
          <span className="text-black text-sm font-semibold">
            {userType == "guest" ? fullname + " (Misafir)" : fullname}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SearchUserItem;
