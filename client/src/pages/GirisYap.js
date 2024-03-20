import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { clearUserErrors, loginUser } from "../slices/userSlice";
import BackdropLoader from "../components/Layouts/BackdropLoader";

const GirisYap = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then((data) => {
        if (data.user.isVerified && data.user.userType === "admin") {
          navigate("/");
          toast.success("Giriş Başarılı");
        } else if (data.user.isVerified) {
          navigate("/sosyal");
          toast.success("Giriş Başarılı");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Giriş hatası:", error);
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
            Giriş Yap
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="E-posta Adresi"
              type="email"
              variant="outlined"
              className="mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Şifre"
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
                Giriş Yap
              </Button>
            </div>
          </form>
          <div className="flex justify-center mt-3 flex-wrap">
            Hesabınız yok mu? &nbsp;
            <MuiLink
              component={Link}
              to="/signup"
              className="text-primary no-underline"
            >
              Kayıt olun.
            </MuiLink>
          </div>
          <div className="flex justify-center mt-3">
            <MuiLink
              component={Link}
              to="/password/forgot"
              className="text-primary no-underline"
            >
              Şifremi Unuttum
            </MuiLink>
          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default GirisYap;
