import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import catchAsync from "../middlewares/catchAsync.js";
import sendCookie from "../utils/sendCookie.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import deleteFile from "../utils/deleteFile.js";
import nodemailer from "nodemailer";
import slugify from "slugify";
import cryptoRandomString from "crypto-random-string";
import { validationResult } from "express-validator";

// Doğrulama e-postası gönderme fonksiyonu
const sendVerificationEmail = async (
  fullname,
  email,
  phoneNumber,
  verificationToken,
  userType,
  avatarFilename
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: "E-posta Doğrulama",
    text: `${fullname} isimli, ${email} e-posta adresli ve ${phoneNumber} telefon numaralı ${
      userType === "admin"
        ? "admin (yetkiliyi)"
        : userType === "coach"
        ? "antrenörü"
        : "sporcuyu"
    } doğrulamak için aşağıdaki bağlantıya tıklayın: http://localhost:${
      process.env.PORT
    }/verify/${verificationToken}`,
    attachments: [
      {
        filename: "avatar.jpg", // Dilediğiniz dosya adını ve uzantısını belirleyebilirsiniz
        path: `public/uploads/profiles/${avatarFilename}`, // avatar'ın bulunduğu dosya yolu
        cid: "unique@avatar.com", // Content ID
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

// Signup User
export const signupUser = catchAsync(async (req, res) => {
  // Validation hatalarını kontrol et
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file != null) await deleteFile("profiles/", req.file.filename);
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname,
    email,
    password,
    phoneNumber,
    userType,
    gender,
    weight,
    athleteType,
    achievements,
    coachLevel,
    dan,
    ijfLevel,
    district,
    salon,
  } = req.body;

  // Kullanıcı adını oluştur
  const username = slugify(fullname, {
    replacement: "_", // Boşluk yerine alt çizgi kullan
    lower: true, // Küçük harfe çevir
    remove: /[*+~.()'"!:@]/g, // Türkçe karakterleri kaldır
  });

  let userData = {
    username, // Kullanıcı adını ekleyin
    fullname,
    email,
    password,
    phoneNumber,
    userType,
    avatar: req.file.filename,
  };

  if (userType === "athlete") {
    userData = {
      ...userData,
      gender,
      weight,
      athleteType,
      achievements: JSON.parse(achievements),
    };
  } else if (userType === "coach") {
    userData = {
      ...userData,
      coachLevel,
      dan,
      ijfLevel,
      district,
      salon,
    };
  }

  // Yeni kullanıcı oluşturma
  const user = new User(userData);

  // Kullanıcıyı kaydet
  await user.save();

  // Kullanıcıya e-posta doğrulama bağlantısı gönderme işlemi
  await sendVerificationEmail(
    user.fullname,
    user.email,
    user.phoneNumber,
    user.verificationToken,
    user.userType,
    user.avatar // Avatar dosya adını fonksiyona gönder
  );

  res.status(200).json({ message: "Kayıt başarılı" });
});

export const loginUser = catchAsync(async (req, res) => {
  // Validation hatalarını kontrol et
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // Kullanıcıyı email veya username ile bul
  const user = await User.findOne({
    $or: [{ email }, { username: email }], // email veya username eşleşmesi
  });

  // Eğer kullanıcı bulunamazsa veya parola eşleşmezse hata döndür
  if (!user || !(await user.comparePassword(password))) {
    return res
      .status(401)
      .json({ message: "Geçersiz e-posta/kullanıcı adı veya şifre." });
  }

  // Misafir kullanıcı süresi dolmuşsa giriş yapmasına izin verme
  if (
    user.userType === "guest" &&
    user.expiresAt &&
    new Date() > user.expiresAt
  ) {
    return res
      .status(403)
      .json({ message: "Misafir kullanıcı süreniz doldu." });
  }

  sendCookie(user, 201, res);
});

// Logout User
export const logoutUser = catchAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Çıkış Başarılı",
  });
});

// Get User Details --Logged In User
export const getAccountDetails = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate({
    path: "posts",
    populate: {
      path: "postedBy",
    },
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Misafir/Turnuva Kayıt hesabı oluşturma
export const createUser = catchAsync(async (req, res) => {
  const {
    userType,
    fullname,
    username,
    phoneNumber,
    password,
    country,
    city,
    club,
  } = req.body;

  // Gerekli alanların kontrolü
  if (!userType || !fullname || !username || !phoneNumber || !password) {
    return res.status(400).json({ message: "Tüm alanlar gereklidir." });
  }

  // Kullanıcı verileri
  const userData = {
    userType,
    fullname,
    username,
    phoneNumber,
    password,
    avatar: "user.jpeg", // Varsayılan avatar
    isVerified: true, // Varsayılan doğrulama durumu
  };

  // Turnuva kayıt kullanıcıları için ek alanlar
  if (userType === "turnuvaKayit") {
    userData.country = country;
    userData.city = city;
    userData.club = club;
  }

  // Yeni kullanıcı oluşturma
  const user = await User.create(userData);

  res.status(201).json({
    success: true,
    message: "Kullanıcı başarıyla oluşturuldu.",
    user: {
      fullname: user.fullname,
      username: user.username,
      phoneNumber: user.phoneNumber,
      userType: user.userType,
      country: user.country || null,
      city: user.city || null,
      club: user.club || null,
    },
  });
});

// Misafir/Turnuva Kayıt hesapları listeleme
export const listUsers = catchAsync(async (req, res) => {
  const { userType } = req.query;

  // Kullanıcı türü kontrolü
  if (!userType) {
    return res
      .status(400)
      .json({ message: "userType parametresi gereklidir." });
  }

  // Kullanıcıları filtrele
  const users = await User.find({ userType });

  if (users.length === 0) {
    return res.status(404).json({ message: "Hiç kullanıcı bulunamadı." });
  }

  res.status(200).json({
    success: true,
    message: "Kullanıcılar başarıyla listelendi.",
    users,
  });
});

// Get User Details
export const getUserDetails = catchAsync(async (req, res, next) => {
  if (req.query.fields) {
    // İzin verilen alanlardan oluşan bir sorgu nesnesi oluşturun
    const query = req.query.fields;

    // Kullanıcıları bul
    const user = await User.findOne(
      {
        username: req.query.username,
      },
      query
    );
    res.status(200).json({
      success: true,
      user,
    });
  } else {
    const user = await User.findOne({ username: req.params.username })
      .populate({
        path: "posts",
        populate: {
          path: "comments",
          populate: {
            path: "user",
          },
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "postedBy",
        },
      })
      .populate({
        path: "saved",
        populate: {
          path: "comments",
          populate: {
            path: "user",
          },
        },
      })
      .populate({
        path: "saved",
        populate: {
          path: "postedBy",
        },
      });

    res.status(200).json({
      success: true,
      user,
    });
  }
});

// Get User Details By Id
export const getUserDetailsById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Get All Users
export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ _id: -1 });

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Athletes
export const getAthletes = catchAsync(async (req, res, next) => {
  // İzin verilen alanlardan oluşan bir sorgu nesnesi oluşturun
  const query = req.query.fields;

  // Kullanıcıları bul
  const users = await User.find(
    {
      userType: req.query.userType,
      gender: req.query.gender,
      athleteType: req.query.athleteType,
    },
    query
  ).limit(parseInt(req.query.limit));

  // Başarılı yanıtı gönder
  res.status(200).json({
    success: true,
    users,
  });
});

// Get Coaches
export const getCoaches = catchAsync(async (req, res, next) => {
  // İzin verilen alanlardan oluşan bir sorgu nesnesi oluşturun
  const query = req.query.fields;

  // Kullanıcıları bul
  const users = await User.find(
    {
      userType: req.query.userType,
    },
    query
  ).limit(parseInt(req.query.limit));

  // Başarılı yanıtı gönder
  res.status(200).json({
    success: true,
    users,
  });
});

// Update Password
export const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Geçersiz Eski Şifre", 401));
  }

  user.password = newPassword;
  await user.save();
  sendCookie(user, 201, res);
});

// Update Profile
export const updateProfile = catchAsync(async (req, res, next) => {
  // Validation hatalarını kontrol et
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bio, email, weight, achievements, coachLevel, dan } = req.body;

  let newUserData = {
    bio,
    email,
  };

  if (req.user.userType == "athlete") {
    newUserData = {
      ...newUserData,
      weight,
      achievements: JSON.parse(achievements),
    };
  } else if (req.user.userType == "coach") {
    newUserData = {
      ...newUserData,
      coachLevel,
      dan,
    };
  }

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user._id);

    await deleteFile("profiles/", user.avatar);
    newUserData.avatar = req.file.filename;
  }

  await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete Profile ⚠️⚠️
export const deleteProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const posts = user.posts;

  // delete post & user images ⚠️⚠️

  // Kullanıcının avatar'ı user.jpeg değilse avatar dosyasını sil
  if (user.avatar !== "user.jpeg") {
    await deleteFile("profiles/", user.avatar);
  }

  // Kullanıcıyı sil
  await user.deleteOne();

  if (req.user.userType !== "admin") {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
  }

  for (let i = 0; i < posts.length; i++) {
    const post = await Post.findById(posts[i]);
    await post.deleteOne();
    await deleteFile("posts/", post[i].image);
  }

  res.status(200).json({
    success: true,
    message: "Profil Silindi",
  });
});

// Forgot Password
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("Kullanıcı Bulunamadı", 404));
  }

  const resetPasswordToken = await user.getResetPasswordToken();

  await user.save();

  const resetPasswordUrl = `http://localhost:${process.env.CLI_PORT}/password/reset/${resetPasswordToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Parola Sıfırlama Linki",
      text: resetPasswordUrl,
    });

    res.status(200).json({
      success: true,
      message: `${user.email} adresine e-posta gönderildi`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsync(async (req, res, next) => {
  const resetPasswordToken = req.params.token;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Kullanıcı Bulunamadı", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();
  sendCookie(user, 200, res);
});

// User Search
export const searchUsers = catchAsync(async (req, res, next) => {
  const { keyword, userType, athleteType, fields } = req.query;

  const query = {};

  if (userType) {
    if (Array.isArray(userType)) {
      query.userType = { $in: userType };
    } else {
      query.userType = userType;
    }
  }

  if (athleteType) {
    query.athleteType = athleteType;
  }

  if (keyword) {
    query.fullname = { $regex: keyword, $options: "i" };
  }

  const users = await User.find(query, fields ? fields.split(" ") : null);

  res.status(200).json({
    success: true,
    users,
  });
});
