import { Fragment, useEffect, useState } from "react";
import PostContainer from "./Posts/PostContainer";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import axios from "axios";
import { Dialog } from "@mui/material";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const [savedTab, setSavedTab] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { user, error, loading } = useSelector((state) => state.userDetails);
  const { user: loggedInUser } = useSelector((state) => state.user);

  const handleDeleteProfile = async (id) => {
    const { data } = await axios.delete(`/userdetails/${id}`);
    setDeleteModal(false);
    navigate("/sosyal");
    toast.success(data.message);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserDetailsErrors());
    }
    dispatch(getUserDetails(params.username));
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
                  {user.userType == "guest"
                    ? user.fullname + " (Misafir)"
                    : user.fullname}
                </h2>
                {loggedInUser.username === user.username && (
                  <div className="flex gap-3 items-center">
                    <Link
                      to="/sosyal/accounts/edit"
                      className="border font-medium hover:bg-gray-50 text-sm rounded px-2 py-1"
                    >
                      Profili Düzenle
                    </Link>
                    <Link to="/sosyal/accounts/edit">{settingsIcon}</Link>
                  </div>
                )}
                {loggedInUser.userType === "admin" && (
                  <Fragment>
                    <div className="flex gap-3 items-center">
                      <span
                        onClick={() => setDeleteModal(true)}
                        className="cursor-pointer"
                      >
                        {metaballsMenu}
                      </span>
                    </div>
                    <Dialog
                      open={deleteModal}
                      onClose={closeDeleteModal}
                      maxWidth="xl"
                    >
                      <div className="flex flex-col items-center w-80 max-[425px]:w-60">
                        <button
                          onClick={() => handleDeleteProfile(user._id)}
                          className="text-red-600 font-medium border-b py-2.5 w-full hover:bg-red-50"
                        >
                          Profili Sil
                        </button>
                        <button
                          onClick={closeDeleteModal}
                          className="py-2.5 w-full hover:bg-gray-50"
                        >
                          İptal
                        </button>
                      </div>
                    </Dialog>
                  </Fragment>
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

                {user.userType === "athlete" && (
                  <>
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
                            {achievement.year} {achievement.category}{" "}
                            {achievement.competition} {achievement.weight}{" "}
                            {achievement.place}
                          </li>
                        ))}
                      </Fragment>
                    )}
                  </>
                )}

                {user.userType === "coach" && (
                  <Fragment>
                    <p className="whitespace-pre-line">
                      {user.coachLevel} Antrenör
                    </p>
                    <p className="whitespace-pre-line">{user.dan}</p>
                    {user.ijfLevel !== "Yok" && (
                      <Fragment>
                        <p className="font-medium">IJF Seviyesi:</p>
                        <p className="whitespace-pre-line">{user.ijfLevel}</p>
                      </Fragment>
                    )}
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
              <div class="relative flex flex-col items-center justify-start bg-transparent box-border overflow-visible">
                <div class="relative flex flex-col items-center justify-start bg-transparent box-border overflow-visible mt-16 mx-[44px]">
                  <svg
                    aria-label="Kamera"
                    fill="currentColor"
                    height="62"
                    role="img"
                    viewBox="0 0 96 96"
                    width="62"
                    class="block relative text-primary"
                  >
                    <title>Kamera</title>
                    <circle
                      cx="48"
                      cy="48"
                      fill="none"
                      r="47"
                      stroke="currentColor"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    ></circle>
                    <ellipse
                      cx="48.002"
                      cy="49.524"
                      fill="none"
                      rx="10.444"
                      ry="10.476"
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="2.095"
                    ></ellipse>
                    <path
                      d="M63.994 69A8.02 8.02 0 0 0 72 60.968V39.456a8.023 8.023 0 0 0-8.01-8.035h-1.749a4.953 4.953 0 0 1-4.591-3.242C56.61 25.696 54.859 25 52.469 25h-8.983c-2.39 0-4.141.695-5.181 3.178a4.954 4.954 0 0 1-4.592 3.242H32.01a8.024 8.024 0 0 0-8.012 8.035v21.512A8.02 8.02 0 0 0 32.007 69Z"
                      fill="none"
                      stroke="currentColor"
                      stroke-linejoin="round"
                      stroke-width="2"
                    ></path>
                  </svg>
                  <div class="relative flex flex-col items-stretch justify-start bg-transparent box-border overflow-visible mt-8 mb-12">
                    <span
                      dir="auto"
                      class="block relative font-bold leading-[36px] text-primary break-words"
                    >
                      Henüz Hiç Gönderi Yok
                    </span>
                  </div>
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
