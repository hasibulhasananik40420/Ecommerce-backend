const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const bcrypt = require("bcryptjs");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const { jsonAccessKey, jsonRefreshKey } = require("../secret");
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../helper/cookie");

//handle login
const handleLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(email)
    if (!user) {
      throw createError(
        404,
        "User does not exist with this email.Please register first"
      );
    }

    //compaire bcryptjs password match
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Password did not match");
    }
    //isBanned

    if (user.isBanned) {
      throw new Error("You are banned.Please contact authority");
    }

    //token and cookie
    // Create JSON web token
    const accessToken = createJSONWebToken({ user }, jsonAccessKey, "5m");
     setAccessTokenCookie(res, accessToken)
   

    //refresh token and cookie
    // Create JSON web token
    const refreshToken = createJSONWebToken({ user }, jsonRefreshKey, "7d");
     setRefreshTokenCookie(res,refreshToken)

    const userWithoutPassword = user.toObject() 
    delete userWithoutPassword.password

    return successResponse(res, {
      statusCode: 200,
      message: "User login successfully",
      payload: {
        userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

//handle logout
const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return successResponse(res, {
      statusCode: 200,
      message: "User logout successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//handleRefreshToken
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    //verify refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jsonRefreshKey);
    if (!decodedToken) {
      throw new Error("Invalid refresh token.Please login.");
    }

    // Create JSON web token
    const accessToken = createJSONWebToken(
      decodedToken.user,
      jsonAccessKey,
      "5m"
    );
     
    setAccessTokenCookie(res,accessToken)

   

    return successResponse(res, {
      statusCode: 200,
      message: "New accress token generated",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

//handleProtectedRoute
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    //verify refresh token
    const decodedToken = jwt.verify(accessToken, jsonAccessKey);
    if (!decodedToken) {
      throw new Error("Invalid access token.Please login.");
    }

   
    return successResponse(res, {
      statusCode: 200,
      message: "Protected resourcess accessed successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};











module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
