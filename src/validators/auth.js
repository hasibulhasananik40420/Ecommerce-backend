const { body } = require("express-validator");

//registation validation
const validateUserRegistation = [
  body("name")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Name is Required.")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be 3-31 characters long"),

  body("email")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Email is Required.")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Password is Required.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  //  .matches(aikne bosbe Regular Expression)
  // .withMessage("")
  //Password Regular Expression added
  body("phone")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Phone number is Required."),

  body("address")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Address is Required.")
    .isLength({ min: 3 })
    .withMessage("Address should be at least 3 characters long"),



    body("image")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("User image is required");
      }
      return true;
    })
    .withMessage("User image is required"),

];

//login validation
const validateUserLogin = [
  body("email")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Email is Required.")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Password is Required.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
  //  .matches(aikne bosbe Regular Expression)
  // .withMessage("")
  //Password Regular Expression added
];

//validateUserPasswordUpdate validation
const validateUserPasswordUpdate = [
  body("oldpassword")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Old Password is Required.")
    .isLength({ min: 6 })
    .withMessage("Old Password should be at least 6 characters long"),
  //  .matches(aikne bosbe Regular Expression)
  // .withMessage("")
  //Password Regular Expression added

  body("newpassword")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("New Password is Required.")
    .isLength({ min: 6 })
    .withMessage("New Password should be at least 6 characters long"),

  body("confirmedpassword").custom((value, { req }) => {
    if (value !== req.body.newpassword) {
      throw new Error("password did not match");
    }

    return true;
  }),
];

//validateForgetPassword
const validateForgetPassword = [
  body("email")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Email is Required.Enter your email")
    .isEmail()
    .withMessage("Invalid email address"),
];

//validateResetPassword validation
const validateResetPassword = [
  body("token")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("token is Required."),

  body("password")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Password is Required.")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters long"),
];














module.exports = {
  validateUserRegistation,
  validateUserLogin,
  validateUserPasswordUpdate,
  validateForgetPassword,
  validateResetPassword,
  
};
