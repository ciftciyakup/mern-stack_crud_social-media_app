import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import {
  clearForgotErrors,
  forgotPassword,
} from "../../slices/forgotPasswordSlice";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import BackdropLoader from "../Layouts/BackdropLoader";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
    setEmail("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearForgotErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  return (
    <>
      {loading && <BackdropLoader />}
      <Container maxWidth="sm" className="py-5 flex-grow flex items-center">
        <div className="w-full max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-md shadow-md">
          <Typography variant="h4" align="center">
            Şifremi Unuttum
          </Typography>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-3 m-3 md:m-8"
          >
            <TextField
              label="E-posta"
              variant="outlined"
              size="small"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary-blue font-medium py-2 rounded text-white w-full"
            >
              Gönder
            </button>
          </form>
          <span className="flex justify-center mt-3 flex-wrap">
            Hesabınız yok mu? &nbsp;
            <Link to="/signup" className="text-primary-blue">
              Kayıt olun
            </Link>
          </span>
        </div>
      </Container>
    </>
  );
};

export default ForgotPassword;
