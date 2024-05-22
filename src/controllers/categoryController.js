const { successResponse } = require("./responseController");
const {
  createCategory,
  getCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../services/categoryService");

//handleCreateCategory
const handleCreateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCategory = await createCategory(name);

    return successResponse(res, {
      statusCode: 201,
      message: "Category was create successfully",
      payload: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

//handleGetCategory
const handleGetCategory = async (req, res, next) => {
  try {
    const allCategory = await getCategory();
    if (!allCategory) {
      throw new Error("No Category was found");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Category was return successfully",
      payload: allCategory,
    });
  } catch (error) {
    next(error);
  }
};

//handleSingleCategory
const handleSingleCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const singleCategory = await getSingleCategory(slug);
    if (!singleCategory) {
      throw new Error("Single Category was not returned");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "Single Category was return successfully",
      payload: singleCategory,
    });
  } catch (error) {
    next(error);
  }
};

//handleUpdateCategory
const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const category = await updateCategory(name, slug);
    if (!category) {
      throw new Error("NoCategory was found with this slug");
    }
    return successResponse(res, {
      statusCode: 200,
      message: " Category was update successfully",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

//handleDeleteCategory
const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await deleteCategory(slug);
    if (!result) {
      throw new Error("Category was not deleted ");
    }
    return successResponse(res, {
      statusCode: 200,
      message: " Category was delete successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};








module.exports = {
  handleCreateCategory,
  handleGetCategory,
  handleSingleCategory,
  handleUpdateCategory,
  handleDeleteCategory
};
