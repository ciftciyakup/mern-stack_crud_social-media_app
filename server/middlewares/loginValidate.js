import { body } from "express-validator";

const loginValidate = [
  body("email")
    .notEmpty()
    .withMessage("E-posta adresi zorunludur. ")
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi girin. "),
  body("password").notEmpty().withMessage("Şifre zorunludur."),
];

export default loginValidate;
