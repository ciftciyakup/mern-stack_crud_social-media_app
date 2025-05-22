import express from "express";
import {
  deleteProfile,
  forgotPassword,
  getAccountDetails,
  getAllUsers,
  getAthletes,
  getUserDetails,
  getUserDetailsById,
  loginUser,
  resetPassword,
  searchUsers,
  signupUser,
  logoutUser,
  updatePassword,
  updateProfile,
  getCoaches,
  createUser,
  listUsers,
} from "../controllers/userController.js";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import signupValidate from "../middlewares/signupValidate.js";
import loginValidate from "../middlewares/loginValidate.js";
import updateValidate from "../middlewares/updateValidate.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";

const router = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Görüntü dosya uzantılarını kontrol eden fonksiyon
const imageFileFilter = (req, file, cb) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"]; // İzin verilen dosya uzantıları
  const extname = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(extname)) {
    cb(null, true); // Uzantı izin verilenler listesinde ise dosya kabul edilir
  } else {
    cb(new Error('Sadece görüntü dosyaları yüklenebilir (".jpg", ".jpeg", ".png").'), false); // Uzantı izin verilenler listesinde değilse dosya reddedilir
  }
};

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/uploads/profiles"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "_" + uniqueSuffix + path.extname(file.originalname));
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limit: { fileSize: 1000000 * 2 },
}).single("avatar");

function uploadSingleAvatar(req, res, next) {
  avatarUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    // Everything went fine.
    next();
  });
}

router.route("/signup").post(uploadSingleAvatar, signupValidate, signupUser);
router.route("/login").post(loginValidate, loginUser);
router.route("/logout").get(logoutUser);
router.route("/create-user").post(isAuthenticated, restrictGuestUsers, createUser);
router.route("/list-users").get(isAuthenticated, restrictGuestUsers, listUsers);

router.route("/me").get(isAuthenticated, restrictGuestUsers, getAccountDetails);

router.route("/user/:username").get(getUserDetails);
router
  .route("/userdetails/:id")
  .get(getUserDetailsById)
  .delete(isAuthenticated, restrictGuestUsers, deleteProfile);

router.route("/users/suggested").get(getAllUsers);
router.route("/users").get(searchUsers);

router
  .route("/update/profile")
  .put(isAuthenticated, restrictGuestUsers, uploadSingleAvatar, updateValidate, updateProfile);
router.route("/update/password").put(isAuthenticated, restrictGuestUsers, updatePassword);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/list-athletes").get(getAthletes);
router.route("/coaches").get(getCoaches);

export default router;
