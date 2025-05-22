import { body } from "express-validator";

const loginValidate = [
  body("email").notEmpty().withMessage("E-posta adresi zorunludur. "),
  body("password").notEmpty().withMessage("Şifre zorunludur."),
];

export default loginValidate;
