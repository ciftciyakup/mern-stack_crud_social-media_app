import express from "express";
import User from "../models/userModel.js";

const app = express();

app.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Geçersiz doğrulama tokenı." });
    }

    user.isVerified = true;
    user.verificationToken = "";
    await user.save();

    return res.json({ message: "Hesap başarıyla doğrulandı." });
  } catch (error) {
    return res.status(500).json({ message: "Bir hata oluştu." });
  }
});

export default app;
