const { body } = require("express-validator");
// validation category
const validateCategory = [
  body("name")
    .trim() //jodi speces dei tahola bad deba
    .notEmpty()
    .withMessage("Category name is Required.")
    .isLength({ min: 3 })
    .withMessage("Category should be 3 characters long"),

 
];


module.exports ={validateCategory}