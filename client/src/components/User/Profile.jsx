import { Fragment, useEffect, useState } from "react";
import PostContainer from "./Posts/PostContainer";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { BASE_PROFILE_IMAGE_URL } from "../../utils/constants";
import {
  clearUserDetailsErrors,
  getUserDetails,
} from "../../slices/userDetailsSlice";
import { toast } from "react-hot-toast";
import BackdropLoader from "../Layouts/BackdropLoader";
import {
  metaballsMenu,
  postsIconFill,
  postsIconOutline,
  savedIconFill,
  savedIconOutline,
  settingsIcon,
} from "./SvgIcons";
import NotFound from "../Errors/NotFound";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const [savedTab, setSavedTab] = useState(false);

  const { user, error, loading } = useSelector((state) => state.userDetails);
  const { user: loggedInUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserDetailsErrors());
    }
    dispatch(getUserDetails(params.username));

    // return () => {
    //     dispatch({ type: USER_DETAILS_RESET })
    // }
  }, [dispatch, error, params.username]);

  return (
    <>
      {loading && <BackdropLoader />}
      {user ? (
        <div className="mt-16 xl:w-2/3 mx-auto max-[600px]:mt-[104px] max-[540px]:mt-36">
          <div className="sm:flex w-full sm:py-8">
            {/* profile picture */}
            <div className="sm:w-1/3 flex justify-center mx-auto sm:mx-0">
              <img
                draggable="false"
                className="w-40 h-40 rounded-full object-cover"
                src={BASE_PROFILE_IMAGE_URL + user.avatar}
                alt=""
              />
            </div>

            {/* profile details */}
            <div className="flex flex-col gap-6 p-4 sm:w-2/3 sm:p-1">
              <div className="flex items-center gap-8 sm:justify-start justify-between">
                <h2 className="text-2xl sm:text-3xl font-thin">
                  {user.fullname}
                </h2>
                {loggedInUser.username === user.username ? (
                  <div className="flex gap-3 items-center">
                    <Link
                      to="/sosyal/accounts/edit"
                      className="border font-medium hover:bg-gray-50 text-sm rounded px-2 py-1"
                    >
                      Profili Düzenle
                    </Link>
                    <Link to="/sosyal/accounts/edit">{settingsIcon}</Link>
                  </div>
                ) : (
                  <div className="flex gap-3 items-center">
                    <span className="sm:block hidden">{metaballsMenu}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center max-w-[21.5rem]">
                <div className="cursor-pointer">
                  <span className="font-semibold">{user.posts?.length}</span>{" "}
                  gönderi
                </div>
              </div>

              {/* bio */}
              <div className="max-w-full">
                <p className="font-medium">{user.fullname}</p>
                <p className="whitespace-pre-line">{user.bio}</p>
                {user?.weight && (
                  <Fragment>
                    <p className="font-medium">Siklet:</p>
                    <p className="whitespace-pre-line">{user?.weight}</p>
                  </Fragment>
                )}
                {user?.achievements?.length > 0 && (
                  <Fragment>
                    <span className="font-medium">Başarılar:</span>
                    {user?.achievements?.map((achievement, index) => (
                      <li key={index} className="list-none">
                        {achievement}
                      </li>
                    ))}
                  </Fragment>
                )}
              </div>
            </div>
          </div>

          <div className="border-t sm:ml-8 sm:mr-14">
            {/* tabs */}
            <div className="flex gap-12 justify-center">
              <span
                onClick={() => setSavedTab(false)}
                className={`${
                  savedTab ? "text-gray-400" : "border-t border-black"
                } py-3 cursor-pointer flex items-center text-[13px] gap-3 tracking-[1px] font-medium`}
              >
                {savedTab ? postsIconOutline : postsIconFill}{" "}
                {"gönderiler".toLocaleUpperCase("TR")}
              </span>
              {user._id === loggedInUser._id && (
                <span
                  onClick={() => setSavedTab(true)}
                  className={`${
                    savedTab ? "border-t border-black" : "text-gray-400"
                  } py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}
                >
                  {savedTab ? savedIconFill : savedIconOutline}{" "}
                  {"kaydedilenler".toLocaleUpperCase("TR")}
                </span>
              )}
            </div>

            {/* posts grid data */}
            {savedTab ? (
              <PostContainer posts={user?.saved} id={"saved"} />
            ) : user?.posts?.length > 0 ? (
              <PostContainer posts={user?.posts} id={"posts"} />
            ) : (
              <div className="bg-white mt-2 mb-10 drop-shadow-sm rounded flex sm:flex-row flex-col sm:gap-0 gap-5 sm:p-0 p-4 items-center justify-between">
                <img
                  draggable="false"
                  className="w-2/5 rounded-l"
                  src="https://www.instagram.com/static/images/mediaUpsell.jpg/6efc710a1d5a.jpg"
                  alt=""
                />
                <div className="mx-auto flex flex-col items-center">
                  <h4 className="font-medium text-lg sm:text-xl">
                    Anları yakalamaya ve paylaşmaya başlayın.
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Profile;
