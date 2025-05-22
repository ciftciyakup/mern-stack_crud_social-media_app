import React from "react";
import { Link } from "react-router-dom";
import { BASE_PROFILE_IMAGE_URL } from "../../utils/constants";

const UserListItem = ({ _id, avatar, username, fullname }) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex space-x-3 items-center">
        <Link to={`/sosyal/${username}`}>
          <img
            draggable="false"
            loading="lazy"
            className="w-10 h-10 rounded-full object-cover"
            src={BASE_PROFILE_IMAGE_URL + avatar}
            alt=""
          />
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/sosyal/${username}`}
            className="text-black text-sm font-semibold hover:underline"
          >
            {fullname}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
