import { Link } from "react-router-dom";
import { BASE_PROFILE_IMAGE_URL } from "../../../utils/constants";

const UserListItem = ({ _id, username, fullname, avatar }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3 items-center">
        <Link to={`/sosyal/${username}`}>
          <img
            draggable="false"
            className="w-9 h-9 rounded-full object-cover"
            src={BASE_PROFILE_IMAGE_URL + avatar || null}
            alt="avatar"
          />
        </Link>
        <div className="flex flex-col gap-0.5">
          <Link
            to={`/sosyal/${username}`}
            className="text-black text-sm font-semibold hover:underline"
          >
            {fullname}
          </Link>
          <span className="text-gray-400 text-xs">Yeni</span>
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
