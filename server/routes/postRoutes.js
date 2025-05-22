import express from "express";
import {
  newPost,
  likeUnlikePost,
  deletePost,
  newComment,
  allPosts,
  getPostsOfFollowing,
  updateCaption,
  saveUnsavePost,
  getPostDetails,
  deleteComment,
} from "../controllers/postController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
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
    cb(
      new Error(
        'Sadece görüntü dosyaları yüklenebilir (".jpg", ".jpeg", ".png").'
      ),
      false
    ); // Uzantı izin verilenler listesinde değilse dosya reddedilir
  }
};

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/uploads/posts"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const postUpload = multer({
  storage: postStorage,
  fileFilter: imageFileFilter,
  limit: { fileSize: 1000000 * 10 },
}).single("post");

function uploadSinglePost(req, res, next) {
  postUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    // Everything went fine.
    next();
  });
}

router
  .route("/post/new")
  .post(isAuthenticated, restrictGuestUsers, uploadSinglePost, newPost);

router.route("/posts/all").get(allPosts);

router.route("/posts").get(getPostsOfFollowing);

router.route("/post/detail/:id").get(getPostDetails);

router
  .route("/post/:id")
  .get(isAuthenticated, restrictGuestUsers, likeUnlikePost)
  .post(isAuthenticated, restrictGuestUsers, saveUnsavePost)
  .put(isAuthenticated, restrictGuestUsers, updateCaption)
  .delete(isAuthenticated, restrictGuestUsers, deletePost);

router
  .route("/post/comment/:id")
  .post(isAuthenticated, restrictGuestUsers, newComment);
router
  .route("/post/:id/comments/:commentId")
  .delete(isAuthenticated, restrictGuestUsers, deleteComment);

export default router;
