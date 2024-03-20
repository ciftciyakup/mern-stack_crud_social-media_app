import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cryptoRandomString from "crypto-random-string";
import jwt from "jsonwebtoken";
import {
  categories,
  coachLevels,
  competitions,
  dans,
  weights,
  years,
} from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Bu e-posta adresi ile daha önce kayıt yapılmış"],
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
      enum: ["admin", "coach", "athlete"],
      default: "athlete",
    },
    // athlete
    gender: {
      type: String,
    },
    weight: {
      type: String,
    },
    athleteType: {
      type: String,
    },
    achievements: [
      {
        year: { type: String, enum: years },
        category: {
          type: String,
          enum: categories,
        },
        competition: {
          type: String,
          enum: competitions,
        },
        weights: {
          type: String,
          enum: weights,
        },
        place: {
          type: String,
          enum: ["1.", "2.", "3."],
        },
      },
    ],
    // coach
    coachLevel: {
      type: String,
      enum: coachLevels,
    },
    dan: {
      type: String,
      enum: dans,
    },
    ijfLevel: {
      type: String,
      enum: ["Level 1", "Level 2"],
    },
    district: {
      type: String,
    },
    salon: {
      type: String,
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

// Parolanın hashlenmesi
userSchema.pre("save", async function (next) {
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

// Parola doğrulama
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
