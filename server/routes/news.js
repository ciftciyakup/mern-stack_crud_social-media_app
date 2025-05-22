import express from "express";
import multer from "multer";
import path from "path";
import News from "../models/news.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { body, validationResult } from "express-validator";
import slugify from "slugify";
import { fileURLToPath } from "url";
import deleteFile from "../utils/deleteFile.js";
import renameFile from "../utils/renameFile.js";
import { restrictGuestUsers } from "../middlewares/restrictGuestUsers.js";

const router = express.Router();

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

// Multer ayarları
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../../public/uploads/news")); // Görüntülerin yükleneceği klasörü belirtin
  },
  filename: function (req, file, cb) {
    cb(
      null,
      slugify(req.body.title, { lower: true }) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter, // Görüntü dosya uzantısı kontrolü için filtre
}).single("image");

function uploadSingleImage(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: err.message });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }
    // Everything went fine.
    next();
  });
}

// Tüm haberleri getiren endpoint
router.get("/news", async (req, res) => {
  const fields = req.query.fields || "url title image date content"; // varsayılan olarak tüm alanları alır
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4; // Her sayfada kaç haber gösterileceği

  try {
    const totalCount = await News.countDocuments(); // Toplam haber sayısını al

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const newsList = await News.find({}, fields)
      .sort({ _id: -1 }) // Yeniden eskiye doğru sırala
      .skip(startIndex)
      .limit(limit);

    res.json({
      news: newsList,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni bir haber ekleyen endpoint
router.post(
  "/news",
  isAuthenticated,
  restrictGuestUsers,
  restrictGuestUsers,
  uploadSingleImage,
  [
    // Veri doğrulama kurallarını burada tanımlayın
    body("title").notEmpty().withMessage("Başlık boş olamaz. "),
    body("date").isDate().withMessage("Geçerli bir tarih girin. "),
    body("content").notEmpty().withMessage("İçerik boş olamaz. "),
    // Görüntü (image) için validasyon ekleyin
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("Görüntü yüklemesi zorunludur.");
      }

      return true;
    }),
  ],
  async (req, res) => {
    if (req.user.userType !== "admin") {
      return res.status(403).json({
        message: "Erişim reddedildi. Sadece admin kullanıcılara izin verilir.",
      });
    }
    // Doğrulama hatalarını kontrol edin
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, date, content } = req.body;

    const url = slugify(title, { lower: true });

    try {
      const newNews = new News({
        url,
        title,
        image: req.file.filename, // Görüntü dosyasının yolu
        date,
        content,
      });

      const createdNews = await newNews.save();
      res.status(201).json(createdNews);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Belirli bir haber getiren endpoint
router.get("/news/:url", getNews, (req, res) => {
  res.json(res.news);
});

// Bir haber güncelleyen endpoint
router.patch(
  "/news/:url",
  isAuthenticated,
  restrictGuestUsers,
  restrictGuestUsers,
  getNews,
  uploadSingleImage,
  [
    // Veri doğrulama kurallarını burada tanımlayın
    body("title").optional().notEmpty().withMessage("Başlık boş olamaz. "),
    body("date").optional().isDate().withMessage("Geçerli bir tarih girin. "),
    body("content").optional().notEmpty().withMessage("İçerik boş olamaz. "),
  ],
  async (req, res) => {
    if (req.user.userType !== "admin") {
      return res.status(403).json({
        message: "Erişim reddedildi. Sadece admin kullanıcılara izin verilir.",
      });
    }
    // Doğrulama hatalarını kontrol edin
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req?.body.title != null) {
      res.news.title = req?.body.title;
      res.news.url = slugify(req?.body.title, { lower: true });
    }
    if (req.file != null) {
      // Eski görüntü dosyasını sil
      if (res.news.image) {
        deleteFile("news/", res.news.image);
      }

      // Yeni görüntüyü kaydet
      res.news.image = req.file.filename;
    } else if (req?.body.title != null) {
      if (res.news.image) {
        const newName =
          res.news.url + "-" + Date.now() + path.extname(res.news.image);
        renameFile("news/", res.news.image, newName);
        res.news.image = newName;
      }
    }
    if (req?.body.date != null) {
      res.news.date = req?.body.date;
    }
    if (req?.body.content != null) {
      res.news.content = req?.body.content;
    }
    try {
      const updatedNews = await res.news.save();
      res.json(updatedNews);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Bir haber silen endpoint
router.delete(
  "/news/:url",
  isAuthenticated,
  restrictGuestUsers,
  restrictGuestUsers,
  getNews,
  async (req, res) => {
    if (req.user.userType !== "admin") {
      return res.status(403).json({
        message: "Erişim reddedildi. Sadece admin kullanıcılara izin verilir.",
      });
    }
    try {
      // Haberin resmini sil
      if (res.news.image) {
        deleteFile("news/", res.news.image);
      }
      await res.news.deleteOne();
      res.json({ id: res.news._id, message: "Haber silindi" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Middleware: URL'ye göre haber getiren yardımcı fonksiyon
async function getNews(req, res, next) {
  try {
    const news = await News.findOne({ url: req.params.url });
    if (news == null) {
      return res.status(404).json({ message: "Haber bulunamadı" });
    }
    res.news = news;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export default router;
