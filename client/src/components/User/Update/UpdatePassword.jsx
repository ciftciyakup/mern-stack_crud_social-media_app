import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  clearProfileErrors,
  updatePassword,
  updateProfileReset,
} from "../../../slices/profileSlice";
import { loadUser } from "../../../slices/userSlice";
import { BASE_PROFILE_IMAGE_URL } from "../../../utils/constants";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Parola uzunluğu en az 8 karakter olmalı");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Parolalar eşleşmiyor");
      return;
    }

    dispatch(updatePassword({ oldPassword, newPassword }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileErrors());
    }
    if (isUpdated) {
      toast.success("Parola Güncellendi");
      dispatch(loadUser());
      navigate(`/sosyal/${user?.username}`);

      dispatch(updateProfileReset());
    } // eslint-disable-next-line
  }, [dispatch, error, isUpdated, navigate]);

  return (
    <>
      <form
        onSubmit={handlePasswordUpdate}
        className="flex flex-col gap-4 py-8 px-16 sm:w-3/4"
      >
        <div className="flex items-center gap-8 ml-24 max-[425px]:ml-4">
          <img
            draggable="false"
            className="w-11 h-11 rounded-full border object-cover"
            src={BASE_PROFILE_IMAGE_URL + user.avatar}
            alt=""
          />
          <span className="text-2xl">
            {user.userType == "guest" ? user.fullname + " (Misafir)" : user.fullname}
          </span>
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Mevcut Parola</span>
          <input
            className="border rounded p-1 w-3/4"
            type="password"
            placeholder="Mevcut Parola"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Yeni Parola</span>
          <input
            className="border rounded p-1 w-3/4"
            type="password"
            placeholder="Yeni Parola"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex w-full gap-8 text-right items-center">
          <span className="w-1/4 font-semibold">Yeni Parolayı Doğrula</span>
          <input
            className="border rounded p-1 w-3/4"
            type="password"
            placeholder="Yeni Parolayı Doğrula"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-blue font-medium rounded text-white py-2 w-40 mx-auto text-sm"
        >
          Parolayı Değiştir
        </button>
      </form>
    </>
  );
};

export default UpdatePassword;
