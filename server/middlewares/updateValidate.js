import { body } from "express-validator";
import { coachLevels, dans, districts, allWeights } from "../utils/constants.js";

const updateValidate = [
  body("email").optional().isEmail().withMessage("Geçerli bir e-posta adresi girin."),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır. "),
  body("phoneNumber")
    .optional()
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage("Geçerli bir telefon numarası girin."),
  body("weight").optional().isIn(allWeights).withMessage("Geçersiz kategori."),
  body("athleteType").optional().isIn(["milli", "kulup"]).withMessage("Geçersiz sporcu tipi."),
  body("coachLevel").optional().isIn(coachLevels).withMessage("Geçerli bir kademe girin. "),
  body("dan").optional().isIn(dans).withMessage("Geçerli bir dan girin. "),
  body("ijfLevel")
    .optional()
    .isIn(["Yok", "Level 1", "Level 2"])
    .withMessage("Var ise IJF Seviyesi girin. "),
  body("district").optional().isIn(districts).withMessage("Geçerli bir ilçe girin. "),
];

export default updateValidate;
