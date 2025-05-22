import ErrorHandler from "../utils/errorHandler.js";

export const restrictGuestUsers = (req, res, next) => {
  if (req.user.userType === "guest") {
    return next(
      new ErrorHandler("Misafir kullanıcılar bu işlemi yapamaz.", 403)
    );
  }
  next();
};
