const sendCookie = (user = {}, statusCode, res) => {
  const token = user.generateToken();

  // Misafir kullanıcı için cookie'nin expires değerini user.expiresAt olarak ayarla
  const options = {
    expires:
      user.userType === "guest" && user.expiresAt
        ? user.expiresAt
        : new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
  });
};

export default sendCookie;
