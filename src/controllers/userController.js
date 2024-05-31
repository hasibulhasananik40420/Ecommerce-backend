const createError = require("http-errors");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { createJSONWebToken } = require("../helper/jsonWebToken");
const {
  jsonActivationKey,
  clientUrl,
  jsonResetpasswordKey,
} = require("../secret");
const emailWithNodemiller = require("../helper/email");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const checkUserExists = require("../helper/checkUserExists");
const sendEmail = require("../helper/sendEmail");
const cloudinary = require('../config/cloudinary')



//all user
const getUser = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "No users found");

    return successResponse(res, {
      statusCode: 200,
      message: "users found successfully",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / page),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / page) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//get single user by id
const getSingleUserById = async (req, res, next) => {
  try {
    // console.log(req.user)
    const id = req.params.id;
    const options = { password: 0 };
    const singleUser = await findWithId(User, id, options);

     if(!singleUser){
        throw createError(404,'User does not exist')
     }

    return successResponse(res, {
      statusCode: 200,
      message: "single user found successfully",
      payload: {
        singleUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

//delete single user by id
const deleteSingleUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };

    await findWithId(User, id, options);

    //delete user
    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: " User delete successfully",
    });
  } catch (error) {
    next(error);
  }
};





const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const image = req.file;

    if (!image) {
      throw createError(400, "Image file is required");
    }

    // Validate image size
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File too large. It must be less than 2 MB");
    }

    const userExists = await checkUserExists(email);
    if (userExists) {
      throw createError(409, "User already exists. Please login.");
    }

    // Create JSON web token with user data and image path
    const token = createJSONWebToken(
      { name, email, password, phone, address, imagePath: image.path },
      jsonActivationKey,
      "15m"
    );
   
    // Load environment variables
const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL;
//${clientUrl}/api/users/activate/${token}
    // Prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2>Hello ${name}</h2>
        
        <button>Please click here to <a href="${clientUrl}/activate/${token}" target="_blank">Activate your account</a>.</button>
      `,
    };

    // Send email with nodemailer
    await sendEmail(emailData);

    return successResponse(res, {
      payload: token,
      statusCode: 200,
      message: `Please check your ${email} for completing your registration process.`,
    });
  } catch (error) {
    next(error);
  }
};



const activateUserAccount = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) throw createError(404, "Token not found");

    try {
      const decoded = jwt.verify(token, jsonActivationKey);

      if (!decoded) throw createError(401, "Unable to verify user");

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(409, "User already exists. Please login.");
      }

      // Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(decoded.imagePath, {
        folder: 'ecommerce'
      });

      // Create new user with the decoded data and Cloudinary image URL
      const newUser = new User({
        name: decoded.name,
        email: decoded.email,
        password: decoded.password,
        phone: decoded.phone,
        address: decoded.address,
        image: uploadResponse.secure_url
      });

      await newUser.save();

      return successResponse(res, {
        statusCode: 201,
        message: "User registered successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};





//update single user by id
const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };

    await findWithId(User, userId, options);

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};
    const allowedFields = ["name", "password", "phone", "address"];

    for (let key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw new Error("Email cannot be updated");
      }
    }

    const image = req.file;
    if (image) {
      // Validate image size
      if (image.size > 1024 * 1024 * 2) {
        throw createError(400, "File too large. It must be less than 2 MB");
      }

      // Upload new image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image.path, {
        folder: 'ecommerce'
      });
      updates.image = uploadResponse.secure_url;
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw new Error("User with this id does not exist");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User updated successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};






const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: true };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createError(400, "User was not banned.");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was banned successfully",
    });
  } catch (error) {
    next(error);
  }
};

//handle unban user  by id
const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updateUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createError(400, "User was not unbanned successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was unbanned successfully",
      payload: updateUser,
    });
  } catch (error) {
    next(error);
  }
};



const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldpassword, newpassword } = req.body;
    const userId = req.params.id;

    // Find the user by _id
    const user = await findWithId(User, userId);

    // Compare bcryptjs password match
    const isPasswordMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isPasswordMatch) {
      throw new Error("Old Password did not match");
    }

    // Update the user's password
    const updateUser = await User.findByIdAndUpdate(
      userId, // Use userId instead of filter object
      { password: newpassword }, // Update only the password field
      { new: true } // Return the updated document
    ).select("-password");

    if (!updateUser) {
      throw createError(400, "User password was not updated");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User password was updated successfully",
      payload: { updateUser },
    });
  } catch (error) {
    next(error);
  }
};



//handle handleForgetPassword
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw new Error("Email is incorrect.Register first");
    }

    // Create JSON web token
    const token = createJSONWebToken({ email }, jsonResetpasswordKey, "15m");

    // Prepare email
    const emailData = {
      email,
      subject: "Reset password Email",
      html: `
        <h2>Hello ${userData.name}</h2>
        <p>Please click here to <a href="${clientUrl}/api/user/reset-password/${token}" target="_blank">Reset your password</a>.</p>
      `,
    };

    // Send email with nodemailer
    sendEmail(emailData)

    return successResponse(res, {
      statusCode: 200,

      message: `Please go to your ${email} for reseting passsword.`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

//handle handleResetPassword
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, jsonResetpasswordKey);

    if (!decoded) {
      throw new Error("Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const update = { $set: { password: password } };
    const updateOptions = { new: true };

    const updateUser = await User.findOneAndUpdate(
      filter,
      update,
      updateOptions
    ).select("-password");

    if (!updateUser) {
      throw createError(400, "Password reset failed");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Password reset successfully.",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
