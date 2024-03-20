import { body } from "express-validator";
import { weights } from "../utils/constants.js";

const updateValidate = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi girin."),
  body("phoneNumber")
    .optional()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage("Geçerli bir telefon numarası girin."),
  body("userType")
    .optional()
    .isIn(["admin", "coach", "athlete"])
    .withMessage("Geçersiz kullanıcı tipi."),
  body("weight").optional().isIn(weights).withMessage("Geçersiz kategori."),
  body("athleteType")
    .optional()
    .isIn(["milli", "kulup"])
    .withMessage("Geçersiz kullanıcı tipi."),
];

export default updateValidate;
