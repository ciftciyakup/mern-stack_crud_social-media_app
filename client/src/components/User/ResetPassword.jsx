import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  clearForgotErrors,
  resetPassword,
} from "../../slices/forgotPasswordSlice";
import { useDispatch, useSelector } from "react-redux";
import BackdropLoader from "../Layouts/BackdropLoader";
import kocaeliJudoSosyal from "../../img/kocaeliJudoSosyal.png";
import { Container } from "@mui/material";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Parola uzunluğu en az 8 karakter olmalıdır");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Parolalar Eşleşmiyor");
      return;
    }
    dispatch(resetPassword({token: params.token, password: newPassword}));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearForgotErrors());
    }
    if (success) {
      toast.success("Parola Başarıyla Güncellendi");
      navigate("/login");
    }
  }, [dispatch, error, success, navigate]);

  return (
    <>
      {loading && <BackdropLoader />}
      <Container maxWidth="sm" className="py-5 flex-grow flex items-center">
        <div className="w-full max-w-md mx-auto bg-white p-8 border border-gray-300 rounded-md shadow-md">
          <div className="bg-white border flex flex-col gap-2 p-4 pt-10">
            <img
              draggable="false"
              className="mx-auto h-30 w-36 object-contain"
              src={kocaeliJudoSosyal}
              alt=""
            />
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center gap-3 m-3 md:m-8"
            >
              <TextField
                fullWidth
                size="small"
                label="Yeni Parola"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <TextField
                fullWidth
                size="small"
                label="Yeni Parolayı Onayla"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-primary-blue font-medium py-2 rounded text-white w-full"
              >
                Gönder
              </button>
              <span className="my-3 text-gray-700">Veya</span>
              <Link
                to="/password/forgot"
                className="text-sm font-medium text-blue-800"
              >
                Parolanızı mı unuttunuz?
              </Link>
            </form>
          </div>

          <div className="bg-white border p-5 text-center">
            <span>
              Zaten hesabınız var mı? &nbsp;
              <Link to="/login" className="text-primary-blue">
                Giriş yap
              </Link>
            </span>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ResetPassword;
