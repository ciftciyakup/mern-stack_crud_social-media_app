import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsync from "./catchAsync.js";

export const isAuthenticated = catchAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler(
        "İşlem yapmak için lütfen giriş yapın. Oturum süreniz dolmuş olabilir",
        401
      )
    );
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData.id);

  next();
});
