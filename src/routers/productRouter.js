const express = require("express");
const { handleCreateProduct, handleGetProducts, handleGetProduct, handleDeleteProduct, handleUpdateProduct } = require("../controllers/productController");
const uploadUserImage = require("../middlewares/uploadFile");
const { validateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");
const productRouter = express.Router();

//create product
productRouter.post(
  "/",
  uploadUserImage.single("image"),
  validateProduct,
  runValidation,
  isLoggedIn,
  isAdmin,
  handleCreateProduct
);


//get all product
productRouter.get(
  "/",
  handleGetProducts
);

//get single product
productRouter.get(
  "/:slug",
  handleGetProduct
);

//update product
productRouter.put(
  "/:slug",
  uploadUserImage.single("image"),
  isLoggedIn,
  isAdmin,
  handleUpdateProduct
);

//delete single product
productRouter.delete(
  "/:slug",
  isLoggedIn,
  isAdmin,
  handleDeleteProduct
);

module.exports = productRouter;
