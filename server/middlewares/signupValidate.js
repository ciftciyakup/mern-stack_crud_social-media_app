import { body } from "express-validator";
import { weights } from "../utils/constants.js";

const signupValidate = [
  body("fullname").notEmpty().withMessage("Ad ve soyad alanı zorunludur. "),
  body("email")
    .notEmpty()
    .withMessage("E-posta adresi zorunludur. ")
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi girin. "),
  body("password")
    .notEmpty()
    .withMessage("Şifre zorunludur.")
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır. "),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Telefon numarası zorunludur. ")
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage("Geçerli bir telefon numarası girin. "),
  body("userType")
    .notEmpty()
    .withMessage("Kullanıcı türü seçimi zorunludur. ")
    .isIn(["admin", "coach", "athlete"])
    .withMessage("Geçersiz kullanıcı tipi. "),
  body("gender")
    .isIn(["erkek", "kadin", null])
    .withMessage("Geçersiz cinsiyet. "),
  body("weight")
    .optional()
    .isIn([...weights, null])
    .withMessage("Geçersiz kategori. "),
  body("athleteType")
    .optional()
    .isIn(["milli", "kulup", null])
    .withMessage("Geçersiz sporcu tipi. "),
  body("avatar").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Görüntü yüklemesi zorunludur.");
    }

    return true;
  }),
];

export default signupValidate;
