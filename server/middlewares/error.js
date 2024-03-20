import ErrorHandler from "../utils/errorHandler.js";
import deleteFile from "../utils/deleteFile.js";

export default async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // mongodb id hatası
  if (err.name === "CastError") {
    const message = `Kaynak bulunamadı. Geçersiz: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // mongoose yinelenen anahtar hatası
  if (err.code === 11000) {
    const message = `Bu ${Object.keys(
      err.keyValue
    )} ile daha önce kayıt yapılmış`;
    if (req.file != null) await deleteFile("profiles/", req.file.filename);
    err = new ErrorHandler(message, 400);
  }

  // yanlış jwt hatası
  if (err.code === "JsonWebTokenError") {
    const message = "Token Hatası";
    err = new ErrorHandler(message, 400);
  }

  // jwt sona erme hatası
  if (err.code === "TokenExpiredError") {
    const message = "Oturum Süresi Doldu";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
