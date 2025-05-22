import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  clearAllUsersErrors,
  getSuggestedUsers,
} from "../../../slices/allUsersSlice";
import { BASE_PROFILE_IMAGE_URL } from "../../../utils/constants";
import SkeletonUserItem from "../../Layouts/SkeletonUserItem";
import UserListItem from "./UserListItem";

const Sidebar = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const { error, users, loading } = useSelector((state) => state.allUsers);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUsersErrors());
    }
    dispatch(getSuggestedUsers());
  }, [dispatch, error]);

  return (
    <div className="fixed lg:right-32 xl:right-52 w-3/12 h-full hidden lg:flex flex-col flex-auto m-8 mt-12 pr-8 -z-1">
      <div className="ml-10 flex flex-col p-2">
        {/* <!-- self profile card --> */}
        <div className="flex justify-between items-center">
          <div className="flex flex-auto space-x-4 items-center">
            <Link to={`/sosyal/${user.username}`}>
              <img
                draggable="false"
                className="w-14 h-14 rounded-full object-cover"
                src={BASE_PROFILE_IMAGE_URL + user?.avatar}
                alt={user.fullname}
              />
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/sosyal/${user.username}`}
                className="text-black text-sm font-semibold"
              >
                {user.userType == "guest"
                  ? user.fullname + " (Misafir)"
                  : user.fullname}
              </Link>
            </div>
          </div>
        </div>

        {/* <!-- suggestions --> */}
        <div className="flex justify-between items-center mt-5">
          <p className="font-semibold text-gray-500 text-sm">
            Senin İçin Öneriler
          </p>
        </div>

        {/* <!-- suggested profile lists --> */}
        <div className="flex flex-col flex-auto mt-3 space-y-3.5">
          {loading
            ? Array(5)
                .fill("")
                .map((el, i) => <SkeletonUserItem key={i} />)
            : users
                ?.filter(
                  (el) =>
                    user._id !== el._id &&
                    el.userType !== "guest" &&
                    el.userType !== "turnuvaKayit"
                )
                .map((user) => <UserListItem {...user} key={user._id} />)}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
