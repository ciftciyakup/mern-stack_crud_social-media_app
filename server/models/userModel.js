import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cryptoRandomString from "crypto-random-string";
import jwt from "jsonwebtoken";
import { allWeights } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: [true, "Bu kullanıcı adı ile daha önce kayıt yapılmış"],
      required: [true, "Kullanıcı adı gereklidir."],
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: false,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: [true, "Bu telefon numarası ile daha önce kayıt yapılmış"],
      trim: true,
    },
    userType: {
      type: String,
      enum: ["admin", "coach", "athlete", "guest", "turnuvaKayit"],
      default: "athlete",
    },
    expiresAt: {
      type: Date,
      default: function () {
        return this.userType === "guest" ? new Date(Date.now() + 12 * 60 * 60 * 1000) : null;
      },
    },
    // athlete
    gender: {
      type: String,
      enum: ["erkek", "kadin"],
    },
    weight: {
      type: String,
      enum: allWeights,
    },
    athleteType: {
      type: String,
      enum: ["milli", "kulup"],
    },
    achievements: [
      {
        year: { type: String },
        category: {
          type: String,
        },
        competition: {
          type: String,
        },
        weight: {
          type: String,
        },
        place: {
          type: String,
        },
      },
    ],
    // coach
    coachLevel: {
      type: String,
    },
    dan: {
      type: String,
    },
    ijfLevel: {
      type: String,
    },
    district: {
      type: String,
    },
    salon: {
      type: String,
    },
    // guest/turnuvaKayit
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    club: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: cryptoRandomString({ length: 64, type: "url-safe" }),
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      default: "Hi👋 Welcome To My Profile",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // Eğer password alanı değiştirilmediyse hashleme işlemini atla
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.getResetPasswordToken = async function () {
  const resetToken = cryptoRandomString({ length: 40, type: "hex" });

  this.resetPasswordToken = resetToken;
  this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
