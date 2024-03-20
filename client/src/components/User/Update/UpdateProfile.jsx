import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  clearProfileErrors,
  updateProfile,
  updateProfileReset,
} from "../../../slices/profileSlice";
import { loadUser } from "../../../slices/userSlice";
import { BASE_PROFILE_IMAGE_URL, weights } from "../../../utils/constants";
import { FormHelperText, IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarInput = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [fullname, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [oldAvatar, setOldAvatar] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [weight, setWeight] = useState("");
  const [achievements, setAchievements] = useState([""]);
  const [disableAddButton, setDisableAddButton] = useState(false);

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("fullname", fullname);
    formData.set("bio", bio);
    formData.set("email", email);
    formData.set("avatar", avatar);
    formData.set("weight", weight);
    formData.set("achievements", JSON.stringify(achievements));

    dispatch(updateProfile(formData));
  };

  const handleAvatarChange = (e) => {
    const reader = new FileReader();
    setAvatar("");
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
    setAvatar(e.target.files[0]);
  };

  const handleAddAchievement = () => {
    setAchievements([...achievements, ""]);
    if (achievements[achievements.length - 1] === "") {
      setDisableAddButton(true);
    }
  };

  const handleRemoveAchievement = (index) => {
    const newAchievements = [...achievements];
    newAchievements.splice(index, 1);
    setAchievements(newAchievements);
    setDisableAddButton(false);
  };

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setAchievements(newAchievements);
  };

  useEffect(() => {
    if (user) {
      setName(user.fullname);
      setBio(user.bio);
      setEmail(user.email);
      setOldAvatar(user.avatar);
      setWeight(user.weight);
      setAchievements(user.achievements);
    }
    if (error) {
      toast.error(error);
      dispatch(clearProfileErrors());
    }
    if (isUpdated) {
      toast.success("Profil Güncellendi");
      dispatch(loadUser());
      navigate(`/sosyal/${user.username}`);

      dispatch(updateProfileReset());
    }
  }, [dispatch, user, error, isUpdated]);

  useEffect(() => {
    if (achievements.some((achievement) => achievement === "")) {
      setDisableAddButton(true);
    } else {
      setDisableAddButton(false);
    }
  }, [achievements]);

  return (
    <>
      <form
        onSubmit={handleUpdate}
        encType="multipart/form-data"
        className="flex flex-col gap-4 py-4 px-4 sm:py-10 sm:px-24 sm:max-[900px]:px-[calc((100vw-640px)/3.25+16px)] sm:w-3/4"
      >
        {/* Avatar kısmı */}
        <div className="flex items-center gap-8 ml-20">
          <div className="w-11 h-11">
            <img
              draggable="false"
              className="w-full h-full rounded-full border object-cover"
              src={
                avatarPreview
                  ? avatarPreview
                  : BASE_PROFILE_IMAGE_URL + oldAvatar
              }
              alt="avatar"
            />
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-xl">{fullname}</span>
            <label
              onClick={(e) => avatarInput.current.click()}
              className="text-sm font-medium text-primary-blue cursor-pointer"
            >
              Profil Fotoğrafını Değiştir
            </label>
            <input
              type="file"
              accept="image/*"
              name="avatar"
              ref={avatarInput}
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        {/* Diğer bilgiler */}
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">İsim</span>
          <input
            className="border rounded p-1 w-3/4"
            type="text"
            placeholder="İsim"
            value={fullname}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full gap-8 text-right items-start">
          <span className="w-1/4 font-semibold">Bio</span>
          <textarea
            className="border rounded outline-none resize-none p-1 w-3/4"
            name="bio"
            placeholder="Bio"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">E-posta</span>
          <input
            className="border rounded p-1 w-3/4"
            type="email"
            placeholder="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Siklet</span>
          <select
            className="border rounded p-1 w-3/4"
            defaultValue={weight}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          >
            {weights.map((element, index) => (
              <option key={index} value={element}>
                {element}{" "}
              </option>
            ))}
          </select>
        </div>
        <div className="flex w-full gap-8 text-right items-center justify-end">
          <div className="w-1/4"></div>
          <FormHelperText className="w-3/4">
            Türkiye Şampiyonası ve resmi uluslararası müsabakalardaki başarılar
            (Yıl Yaş kategorisi Müsabaka adı Siklet Derece şeklinde)
          </FormHelperText>
        </div>
        {/* Başarılar kısmı */}
        <div className="flex items-center">
          <span className="font-semibold w-1/4 text-right mr-8">Başarılar</span>
          <div className="flex flex-col w-3/4 items-center justify-end">
            {achievements.map((achievement, index) => (
              <div className="flex w-full" key={index}>
                <input
                  className="border rounded p-1 w-full"
                  type="text"
                  value={achievement}
                  onChange={(e) =>
                    handleAchievementChange(index, e.target.value)
                  }
                />
                {index === achievements.length - 1 ? (
                  <>
                    <IconButton
                      disabled={disableAddButton}
                      onClick={handleAddAchievement}
                      className="font-medium rounded p-1 text-sm"
                    >
                      <Add />
                    </IconButton>
                    {index > 0 && (
                      <IconButton
                        onClick={() => handleRemoveAchievement(index)}
                        className="font-medium rounded p-1 text-sm"
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        {/* Gönder butonu */}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-blue font-medium rounded text-white py-2 w-40 mx-auto text-sm"
        >
          Gönder
        </button>
      </form>
    </>
  );
};

export default UpdateProfile;
