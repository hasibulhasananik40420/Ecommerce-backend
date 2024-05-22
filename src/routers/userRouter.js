const express = require("express");
const {
  getUser,
  getSingleUserById,
  deleteSingleUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/userController");

const {validateUserRegistation, validateUserPasswordUpdate, validateForgetPassword, validateResetPassword} = require('../validators/auth')
const uploadUserImage = require("../middlewares/uploadFile");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const userRouter = express.Router();



userRouter.post(
  "/process-register",
  uploadUserImage.single("image"),
  isLoggedOut,
  validateUserRegistation,
  runValidation,
  processRegister
); 



userRouter.post("/activate",isLoggedOut, activateUserAccount);
userRouter.get("/", isLoggedIn,isAdmin, getUser);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getSingleUserById);
userRouter.delete("/:id([0-9a-fA-F]{24})",isLoggedIn, deleteSingleUserById);
//reset password
userRouter.put("/reset-password",validateResetPassword,runValidation, handleResetPassword);
userRouter.put("/:id([0-9a-fA-F]{24})", uploadUserImage.single("image"),isLoggedIn, updateUserById);
userRouter.put("/ban-user/:id([0-9a-fA-F]{24})",isLoggedIn, isAdmin, handleBanUserById);
userRouter.put("/unban-user/:id([0-9a-fA-F]{24})",isLoggedIn, isAdmin, handleUnbanUserById);
//update password
userRouter.put("/update-password/:id([0-9a-fA-F]{24})",validateUserPasswordUpdate,runValidation, isLoggedIn, handleUpdatePassword);

//forget password
userRouter.post("/forget-password",validateForgetPassword,runValidation, handleForgetPassword);



module.exports = userRouter;

