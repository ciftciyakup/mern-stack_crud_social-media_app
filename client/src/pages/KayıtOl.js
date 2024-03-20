import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Container,
  TextField,
  Grid,
  Typography,
  MenuItem,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-number-input";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearUserErrors, signupUser } from "../slices/userSlice";
import BackdropLoader from "../components/Layouts/BackdropLoader";

import "react-phone-number-input/style.css";
import { weights } from "../utils/constants";

const KayıtOl = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState();
  const [userType, setUserType] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [athleteType, setAthleteType] = useState("");
  const [achievements, setAchievements] = useState([""]);
  const [disableAddButton, setDisableAddButton] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state?.user
  );

  const handleDataChange = (e) => {
    const reader = new FileReader();

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
    // Eğer son başarı alanı boşsa, butonu devre dışı bırak
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Şifreler uyuşmuyor");
      return;
    }

    // Boş stringleri filtrele
    const filteredAchievements = achievements.filter(
      (achievement) => achievement.trim() !== ""
    );

    const formData = new FormData();
    formData.set("fullname", fullname);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("phoneNumber", phoneNumber);
    formData.set("avatar", avatar);
    formData.set("userType", userType);
    formData.set("gender", gender);
    formData.set("weight", weight);
    formData.set("athleteType", athleteType);
    formData.set("achievements", JSON.stringify(filteredAchievements));

    dispatch(signupUser(formData))
      .unwrap()
      .then(() => {
        toast.success(
          "Kayıt başarılı, lütfen hesabınızın yönetici (Galip Şentürk) tarafından onaylanmasını bekleyin.",
          { duration: 10000 }
        );
        navigate("/login");
      })
      .catch((error) => {
        console.error("Kayıt Hatası: ", error);
      });
  };

  useEffect(() => {
    // Başarı alanlarından herhangi biri boşsa butonu devre dışı bırak
    if (achievements.some((achievement) => achievement === "")) {
      setDisableAddButton(true);
    } else {
      setDisableAddButton(false);
    }

    if (error) {
      dispatch(clearUserErrors());
    }
    if (isAuthenticated) {
      navigate(`/sosyal`);
    }
  }, [dispatch, error, isAuthenticated, navigate, achievements]);

  return (
    <Fragment>
      {loading && <BackdropLoader />}
      <Container maxWidth="sm" className="py-5 flex-grow flex items-center">
        <div className="w-full max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-md shadow-md">
          <Typography
            variant="h4"
            align="center"
            mb={4}
            className="text-2xl font-bold"
          >
            Kayıt Ol
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ad ve Soyad"
                  variant="outlined"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="E-posta Adresi"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Şifre"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Şifre Tekrarı"
                  variant="outlined"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mb-4"
                />
              </Grid>
              <Grid item xs={12}>
                <PhoneInput
                  defaultCountry="TR"
                  placeholder="Telefon numaranızı girin"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  className="mb-4 rounded-[4px] border border-solid border-1 border-[#0000003b] py-4 px-[14px]"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Kullanıcı Türü"
                  variant="outlined"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="mb-4"
                >
                  <MenuItem value="coach">Antrenör</MenuItem>
                  <MenuItem value="athlete">Sporcu</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar
                    alt="Avatar Önizlemesi"
                    src={avatarPreview}
                    sx={{ width: 48, height: 48, marginRight: 3 }}
                  />
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      name="avatar"
                      onChange={handleDataChange}
                      className="block w-full text-sm text-gray-400
                    file:mr-3 file:py-2 file:px-6
                    file:rounded-full file:border-0
                    file:text-sm file:cursor-pointer file:font-semibold
                    file:bg-blue-100 file:text-blue-700
                    hover:file:bg-blue-200"
                    />
                  </label>
                </div>
              </Grid>
              {userType === "athlete" && (
                <Fragment>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Cinsiyet"
                      variant="outlined"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mb-4"
                    >
                      <MenuItem value="erkek">Erkek</MenuItem>
                      <MenuItem value="kadin">Kadın</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Siklet"
                      variant="outlined"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="mb-4"
                    >
                      {weights.map((element, index) => (
                        <MenuItem key={index} value={element}>
                          {element}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Sporcu Türü"
                      variant="outlined"
                      value={athleteType}
                      onChange={(e) => setAthleteType(e.target.value)}
                      className="mb-4"
                    >
                      <MenuItem value="milli">Milli Sporcu</MenuItem>
                      <MenuItem value="kulup">Kulüp Sporcusu</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12}>
                        <FormHelperText>
                          Türkiye Şampiyonası ve resmi uluslararası
                          müsabakalardaki başarılar (Yıl Yaş kategorisi Müsabaka
                          adı Siklet Derece şeklinde)
                        </FormHelperText>
                      </Grid>
                      {achievements.map((achievement, index) => (
                        <Fragment key={index}>
                          <Grid
                            item
                            xs={
                              achievements.length === 1
                                ? 10
                                : index === achievements.length - 1
                                ? 8
                                : 12
                            }
                          >
                            <TextField
                              fullWidth
                              label="Başarı"
                              variant="outlined"
                              value={achievement}
                              className="mb-4"
                              onChange={(e) =>
                                handleAchievementChange(index, e.target.value)
                              }
                            />
                          </Grid>
                          {index === achievements.length - 1 && (
                            <Grid item xs={2}>
                              <IconButton
                                disabled={disableAddButton}
                                onClick={handleAddAchievement}
                              >
                                <Add />
                              </IconButton>
                            </Grid>
                          )}
                          {index > 0 && (
                            <Grid item xs={2}>
                              <IconButton
                                onClick={() => handleRemoveAchievement(index)}
                                className="font-medium rounded p-1 text-sm"
                              >
                                <Remove />
                              </IconButton>
                            </Grid>
                          )}
                        </Fragment>
                      ))}
                    </Grid>
                  </Grid>
                </Fragment>
              )}
            </Grid>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ textTransform: "none" }}
              className="mt-4"
            >
              Kayıt Ol
            </Button>
          </form>
        </div>
      </Container>
    </Fragment>
  );
};

export default KayıtOl;
