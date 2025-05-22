import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { profileIcon, settingsIcon } from "./SvgIcons";
import { logoutUser } from "../../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ClickAwayListener } from "@mui/material";

const ProfileDetails = ({ setProfileToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const tabs = [
    {
      title: "Profil",
      icon: profileIcon,
      redirect: `sosyal/${user.username}`,
    },
    {
      title: "Hesap Ayarları",
      icon: settingsIcon,
      redirect: "sosyal/accounts/edit",
    },
    {
      title: "Parola Ayarları",
      icon: settingsIcon,
      redirect: "sosyal/accounts/password/change",
    },
    ...(user.userType === "admin"
      ? [
          {
            title: "Kullanıcı Oluştur",
            icon: profileIcon,
            redirect: "sosyal/accounts/user/create",
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    toast.success("Çıkış Başarılı");
  };

  return (
    <ClickAwayListener onClickAway={() => setProfileToggle(false)}>
      <div className="absolute w-56 bg-white rounded  drop-shadow top-10 -right-4 border">
        <div className="absolute right-5 -top-2 rotate-45 h-4 w-4 bg-white rounded-sm border-l border-t"></div>

        <div className="flex flex-col w-full overflow-hidden">
          {tabs.map((el, i) => (
            <Link
              to={el.redirect}
              className="flex items-center gap-3 p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50"
              key={i}
            >
              {el.icon}
              {el.title}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex rounded-b border-t-2 items-center gap-3 p-2.5 text-sm pl-4 cursor-pointer hover:bg-gray-50"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default ProfileDetails;
