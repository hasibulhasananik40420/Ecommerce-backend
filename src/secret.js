require("dotenv").config();
const port = process.env.PORT || 8080;
const mongodbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017";

const defaultImagePath =
  process.env.Defalut_User_Image_Path || "public/images/users/default.png";

const jsonActivationKey =
  process.env.JWT_ACTIVATION_KEY ||
  "hsgdddddddddddddddduuuuuueeeeeeeeeeeeeeekm";

const jsonAccessKey =
  process.env.JWT_ACCESS_KEY || "hsgdddddddddddddddduuuuuueeeeeee";

const jsonRefreshKey =
  process.env.JWT_REFRESH_KEY || "hsgdddddddddddddddduuuuuuee";

const jsonResetpasswordKey =
  process.env.JWT_RESET_PASSWORD_KEY || "hsgddddddddddd";

const smptUserName = process.env.SMPT_USERNAME || "";
const smptPassword = process.env.SMPT_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";




module.exports = {
  port,
  mongodbUrl,
  defaultImagePath,
  jsonActivationKey,
  smptUserName,
  smptPassword,
  jsonAccessKey,
  clientUrl,
  jsonResetpasswordKey,
  jsonRefreshKey
};
