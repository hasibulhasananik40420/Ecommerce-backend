const Category = require("../models/categoryModel");
const slugify = require("slugify");

const createCategory = async (name) => {
  //create category
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });

  return newCategory;
};

//get all categories
const getCategory = async () => {
  // get category
  return await Category.find({}).select("name slug").lean();
};

//get single categories
const getSingleCategory = async (slug) => {
  // get category
  return await Category.find({ slug }).select("name slug").lean();
};

//update category
const updateCategory = async (name, slug) => {
  // update category

  const filter = { slug };
  const updates = { $set: { name: name, slug: slugify(name) } };
  option = { new: true };

  const updatedCategory = await Category.findOneAndUpdate(
    filter,
    updates,
    option
  );
  return updatedCategory;
};



//delete category
const deleteCategory = async (slug) => {
  // get category
  const deleteCategory =  await Category.findOneAndDelete({slug})
  return deleteCategory
};






module.exports = {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
