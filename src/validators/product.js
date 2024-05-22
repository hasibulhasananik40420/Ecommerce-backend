const { body } = require("express-validator");
// validation category
const validateProduct = [
  body("name")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Product name is Required.")
    .isLength({ min: 3 })
    .withMessage("Product should be 3 characters long"),

  body("description")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Product description is Required.")
    .isLength({ min: 3 })
    .withMessage("Product description should be 3 characters long"),

  body("price")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Product price is Required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be positive number"),

  body("category")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Product category is Required."),

  body("quantity")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Product quantity is Required.")
    .isInt({ min: 1 })
    .withMessage(" Quantity must be  integer."),
];

module.exports = { validateProduct };
