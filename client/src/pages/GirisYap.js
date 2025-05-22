import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, TextField, Button, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearUserErrors, loginUser } from "../slices/userSlice";
import BackdropLoader from "../components/Layouts/BackdropLoader";
import { useTranslation } from "react-i18next"; // Çoklu dil desteği için ekleme

const GirisYap = () => {
  const { t } = useTranslation(); // useTranslation hook'u
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        if (data.user.isVerified && data.user.userType === "admin") {
          navigate("/");
          toast.success(t("login_success")); // Çoklu dil desteği
        } else if (data.user.isVerified) {
          navigate("/sosyal");
          toast.success(t("login_success")); // Çoklu dil desteği
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error(t("login_error"), error); // Çoklu dil desteği
      });
  };

  useEffect(() => {
    if (error) {
      dispatch(clearUserErrors());
    }
    if (isAuthenticated) {
      navigate(`/sosyal`);
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    <Fragment>
      {loading && <BackdropLoader />}
      <Container maxWidth="sm" className="py-5 flex-grow flex items-center">
        <div className="w-full max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-md shadow-md">
          <Typography variant="h4" align="center" className="mb-8">
            {t("login")} {/* Çoklu dil desteği */}
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label={t("email_or_username")} // Çoklu dil desteği
              type="text"
              variant="outlined"
              className="mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label={t("password")} // Çoklu dil desteği
              type="password"
              variant="outlined"
              className="mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-center mt-3">
              <Button
                variant="contained"
                type="submit"
                sx={{ textTransform: "none" }}
                className="bg-primary-blue"
              >
                {t("login")} {/* Çoklu dil desteği */}
              </Button>
            </div>
          </form>
          <div className="flex justify-center mt-3 flex-wrap">
            {t("no_account")} &nbsp;
            <MuiLink component={Link} to="/signup" className="text-primary no-underline">
              {t("signup")} {/* Çoklu dil desteği */}
            </MuiLink>
          </div>
          <div className="flex justify-center mt-3">
            <MuiLink
              component={Link}
              to="/password/forgot"
              className="text-primary no-underline"
            >
              {t("forgot_password")} {/* Çoklu dil desteği */}
            </MuiLink>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default GirisYap;
