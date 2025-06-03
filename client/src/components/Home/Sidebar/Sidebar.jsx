import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearAllUsersErrors, getSuggestedUsers } from "../../../slices/allUsersSlice";
import { BASE_PROFILE_IMAGE_URL } from "../../../utils/constants";
import SkeletonUserItem from "../../Layouts/SkeletonUserItem";
import UserListItem from "./UserListItem";

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
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

  const handleClose = () => setMobileOpen(false);

  return (
    <Fragment>
      {/* Masaüstü için */}
      <div className="fixed lg:right-32 xl:right-52 w-3/12 h-full hidden lg:flex flex-col flex-auto m-8 mt-12 pr-8 -z-1 max-h-[calc(100vh-104px)]">
        <div className="ml-10 flex flex-col p-2 overflow-y-auto">
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
                  {user.userType == "guest" ? user.fullname + " (Misafir)" : user.fullname}
                </Link>
              </div>
            </div>
          </div>

          {/* <!-- suggestions --> */}
          <div className="flex justify-between items-center mt-5">
            <p className="font-semibold text-gray-500 text-sm">Senin İçin Öneriler</p>
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

      {/* Mobil için: sağdan açılır sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-40 flex lg:hidden">
          <div className="bg-white w-4/5 max-w-xs h-full flex flex-col border-l shadow-lg animate-slide-in-right ml-auto">
            <div className="flex items-center justify-between border-b p-4">
              <span className="mx-auto font-medium cursor-pointer">{user.fullname}</span>
              <button onClick={handleClose} className="ml-2 text-2xl font-bold">
                &times;
              </button>
            </div>
            <div className="flex flex-col flex-auto p-2 overflow-y-auto">
              {/* ...sidebar içeriği (profil, öneriler, kullanıcılar)... */}
              <div className="flex flex-auto space-x-4 items-center mb-4">
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
                    {user.userType === "guest" ? user.fullname + " (Misafir)" : user.fullname}
                  </Link>
                </div>
              </div>
              <div className="flex justify-between items-center mt-5">
                <p className="font-semibold text-gray-500 text-sm">Senin İçin Öneriler</p>
              </div>
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
          {/* Tıklayınca sidebar'ı kapatmak için boş alan */}
          <div className="flex-1" onClick={handleClose}></div>
        </div>
      )}
    </Fragment>
  );
};

export default Sidebar;
