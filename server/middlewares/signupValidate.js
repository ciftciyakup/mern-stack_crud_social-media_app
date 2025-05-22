import { body } from "express-validator";
import { coachLevels, dans, districts, salons, allWeights } from "../utils/constants.js";

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
  body("gender").optional().isIn(["erkek", "kadin"]).withMessage("Geçersiz cinsiyet. "),
  body("weight").optional().isIn(allWeights).withMessage("Geçersiz kategori. "),
  body("athleteType")
    .optional()
    .isIn(["milli", "kulup"])
    .withMessage("Geçersiz sporcu tipi. "),
  body("coachLevel").optional().isIn(coachLevels).withMessage("Kademe seçimi zorunludur. "),
  body("dan").optional().isIn(dans).withMessage("Geçerli bir dan girin. "),
  body("ijfLevel")
    .optional()
    .isIn(["Yok", "Level 1", "Level 2"])
    .withMessage("Var ise IJF Seviyesi girin. "),
  body("district").optional().isIn(districts).withMessage("Geçerli bir ilçe girin. "),
  body("salon").optional().isIn(salons).withMessage("Geçerli bir salon girin. "),
  body("avatar").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Görüntü yüklemesi zorunludur.");
    }
    return true;
  }),
];

export default signupValidate;
