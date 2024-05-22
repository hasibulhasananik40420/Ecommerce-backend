const express = require("express");

const runValidation = require("../validators");
const { handleCreateCategory, handleGetCategory, handleSingleCategory, handleUpdateCategory, handleDeleteCategory } = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const categoryRouter = express.Router();

// /api/categories
categoryRouter.post(
  "/",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateCategory
);


//get all /api/categories
categoryRouter.get(
  "/",
  handleGetCategory
);


//single category /api/categories
categoryRouter.get(
  "/:slug",
  handleSingleCategory
);


//update category /api/categories
categoryRouter.put(
  "/:slug",
  validateCategory,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleUpdateCategory
);


//delete category /api/categories
categoryRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  handleDeleteCategory
);





module.exports = categoryRouter;
