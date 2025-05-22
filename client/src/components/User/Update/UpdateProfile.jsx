import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  clearProfileErrors,
  updateProfile,
  updateProfileReset,
} from "../../../slices/profileSlice";
import { loadUser } from "../../../slices/userSlice";
import {
  BASE_PROFILE_IMAGE_URL,
  categories,
  competitions,
  allWeights,
  years,
  coachLevels,
  dans,
  places,
} from "../../../utils/constants";
import { IconButton } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarInput = useRef(null);

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [oldAvatar, setOldAvatar] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [weight, setWeight] = useState("");
  const [disableAddButton, setDisableAddButton] = useState(false);
  const [achievements, setAchievements] = useState([
    {
      year: "",
      category: "",
      competition: "",
      weight: "",
      place: "",
    },
  ]);
  const [coachLevel, setCoachLevel] = useState("");
  const [dan, setDan] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("bio", bio);
    formData.set("email", email);
    formData.set("avatar", avatar);

    if (user?.userType === "athlete") {
      formData.set("weight", weight);
      formData.set("achievements", JSON.stringify(achievements));
    } else if (user?.userType === "coach") {
      formData.set("coachLevel", coachLevel);
      formData.set("dan", dan);
    }

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
    setAchievements([
      ...achievements,
      {
        year: "",
        category: "",
        competition: "",
        weight: "",
        place: "",
      },
    ]);
  };

  const handleRemoveAchievement = (index) => {
    const newAchievements = [...achievements];
    newAchievements.splice(index, 1);
    setAchievements(newAchievements);
    setDisableAddButton(false);
  };

  const handleAchievementChange = (index, field, value) => {
    const updatedAchievements = [...achievements];
    updatedAchievements[index][field] = value;
    setAchievements(updatedAchievements);
  };

  useEffect(() => {
    if (user) {
      setBio(user.bio);
      setEmail(user.email);
      setOldAvatar(user.avatar);
      setWeight(user.weight);
      setAchievements(user.achievements);
      setCoachLevel(user.coachLevel);
      setDan(user.dan);
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
    } // eslint-disable-next-line
  }, [dispatch, user, error, isUpdated]);

  useEffect(() => {
    if (
      achievements.some((achievement) =>
        Object.values(achievement).some((value) => value === "")
      )
    ) {
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
        <div className="flex items-center gap-8 ml-20">
          <div className="w-11 h-11">
            <img
              draggable="false"
              className="w-full h-full rounded-full border object-cover"
              src={avatarPreview ? avatarPreview : BASE_PROFILE_IMAGE_URL + oldAvatar}
              alt="avatar"
            />
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-xl">
              {user.userType == "guest" ? user.fullname + " (Misafir)" : user.fullname}
            </span>
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
        {user?.userType === "athlete" && (
          <>
            <div className="flex w-full gap-8 text-right items-center">
              <span className="w-1/4 font-semibold">Siklet</span>
              <select
                className="border rounded p-1 w-3/4"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              >
                {allWeights.map((element, index) => (
                  <option key={index} value={element}>
                    {element}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-1/4 text-right mr-8">Başarılar</span>
              <div className="flex flex-col w-3/4 items-center justify-end">
                {achievements.map((achievement, index) => (
                  <div className="flex w-full" key={index}>
                    <select
                      className="border rounded p-1 w-full"
                      value={achievement.year}
                      onChange={(e) => handleAchievementChange(index, "year", e.target.value)}
                    >
                      {years.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded p-1 w-full"
                      value={achievement.category}
                      onChange={(e) =>
                        handleAchievementChange(index, "category", e.target.value)
                      }
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded p-1 w-full"
                      value={achievement.competition}
                      onChange={(e) =>
                        handleAchievementChange(index, "competition", e.target.value)
                      }
                    >
                      {competitions.map((competition) => (
                        <option key={competition}>{competition}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded p-1 w-full"
                      value={achievement.weight}
                      onChange={(e) =>
                        handleAchievementChange(index, "weight", e.target.value)
                      }
                    >
                      {allWeights.map((weight) => (
                        <option key={weight}>{weight}</option>
                      ))}
                    </select>
                    <select
                      className="border rounded p-1 w-full"
                      value={achievement.place}
                      onChange={(e) => handleAchievementChange(index, "place", e.target.value)}
                    >
                      {places.map((place) => (
                        <option key={place}>{place}</option>
                      ))}
                    </select>
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
          </>
        )}
        {user?.userType === "coach" && (
          <>
            <div className="flex w-full gap-8 text-right items-center">
              <span className="w-1/4 font-semibold">Kademe</span>
              <select
                className="border rounded p-1 w-3/4"
                value={coachLevel}
                onChange={(e) => setCoachLevel(e.target.value)}
              >
                {coachLevels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-full gap-8 text-right items-center">
              <span className="w-1/4 font-semibold">Dan</span>
              <select
                className="border rounded p-1 w-3/4"
                value={dan}
                onChange={(e) => setDan(e.target.value)}
              >
                {dans.map((dan, index) => (
                  <option key={index} value={dan}>
                    {dan}{" "}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
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
