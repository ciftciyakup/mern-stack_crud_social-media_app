import React, { useEffect, useState } from "react";
import {
  Logo,
  homeFill,
  homeOutline,
  messageFill,
  messageOutline,
  postUploadOutline,
} from "./SvgIcons";
import { Link, useLocation } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import NewPost from "./NewPost";
import { useSelector } from "react-redux";
import { BASE_PROFILE_IMAGE_URL } from "../../utils/constants";
import SearchBox from "./SearchBar/SearchBox";
import kocaeliJudoSosyal from "../../img/kocaeliJudoSosyal.png";

const Header = () => {
  const { user } = useSelector((state) => state.user);

  const [profileToggle, setProfileToggle] = useState(false);
  const [newPost, setNewPost] = useState(false);

  const location = useLocation();
  const [onHome, setOnHome] = useState(false);
  const [onChat, setOnChat] = useState(false);

  useEffect(() => {
    setOnHome(location.pathname === "/sosyal");
    setOnChat(location.pathname.startsWith("/sosyal/direct"));
  }, [location]);

  return (
    <nav className="fixed top-0 w-full border-b bg-white z-10">
      {/* <!-- navbar container --> */}
      <div className="flex flex-row max-[600px]:flex-wrap justify-between max-sm:justify-center items-center py-2 px-3.5 sm:w-full sm:py-2 sm:px-4 md:w-full md:py-2 md:px-6 xl:w-4/6 xl:py-3 xl:px-8 mx-auto">
        {/* <!-- logo --> */}
        <Link to="/sosyal" className="max-[600px]:flex-grow">
          <img
            draggable="false"
            className="mt-1.5 w-full h-full object-contain max-[600px]:mb-1.5 max-h-[29px]"
            src={kocaeliJudoSosyal}
            alt=""
          />
        </Link>

        <SearchBox params={{ userType: ["admin", "coach", "athlete"] }} />

        {/* <!-- icons container  --> */}
        <div className="flex items-center space-x-6 sm:mr-5  max-[600px]:flex-grow  max-[600px]:justify-around">
          <Link to="/">{Logo}</Link>
          <Link to="/sosyal">{profileToggle || !onHome ? homeOutline : homeFill}</Link>

          <Link to="/sosyal/direct/inbox">{onChat ? messageFill : messageOutline}</Link>

          <div onClick={() => setNewPost(true)} className="cursor-pointer">
            {postUploadOutline}
          </div>

          <div
            onClick={() => setProfileToggle(!profileToggle)}
            className={`${
              (profileToggle && "border-black border") ||
              (!onHome && !onChat && "border-black border")
            } rounded-full cursor-pointer h-7 w-7 p-[0.5px] relative`}
          >
            <img
              draggable="false"
              loading="lazy"
              className="w-full h-full rounded-full object-cover"
              src={BASE_PROFILE_IMAGE_URL + user?.avatar}
              alt=""
            />

            {profileToggle && <ProfileDetails setProfileToggle={setProfileToggle} />}
          </div>
        </div>
        <NewPost newPost={newPost} setNewPost={setNewPost} />
      </div>
    </nav>
  );
};

export default Header;
