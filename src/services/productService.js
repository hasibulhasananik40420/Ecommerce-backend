const slugify = require("slugify");
const Product = require("../models/productModel");

//create product
const createProduct = async (productData) => {
  const {
    name,
    description,
    price,
    category,
    quantity,
    shipping,
    imageBufferString,
  } = productData;

  //create product
  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw new Error("Product with this name allready exists");
  }

  // Create product

  const products = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: imageBufferString,
    category: category,
  });

  return products;
};

//get all product
const getAllProduct = async (page=1, limit=4,filter={}) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (!products) {
    throw new Error("Products not found");
  }

  const count = await Product.find(filter).countDocuments();

  return { products, count, totalPages: Math.ceil(count / limit) };
};



//get single product
const getProduct = async (slug) => {
  const product = await Product.findOne({slug}).populate('category')

  if (!product) {
    throw new Error("Product not found");
  }
  return product
};



//get delete product
const deleteSingleProduct = async (slug) => {
  const product = await Product.deleteOne({slug})

  if (!product) {
    throw new Error("Product not found");
  }
  return product
};


// update single product

const updateSingleProduct = async (slug,req) => {
     try {
      
      const product = await Product.findOne({slug:slug})

       if(!product){
           throw new Error('Product not found')
       }

      const updateOptions = { new: true, runValidators: true, context: "query" };
    
      let updates = {};
  
      const allowedFields = ["name", "description", "price", "sold", "quantity","shipping"];
  
  
      for (let key in req.body) {
        if (allowedFields.includes(key)) {
           if(key ==='name'){
            updates.slug = slugify(req.body[key])
           }
          updates[key] = req.body[key];
        }
      }
  
          const image = req.file?.path;
          if(image){
             if(image.size > 1024 * 1024 * 2){
                 throw new Error('File to lagre.Must be less then 2 mb')
             }
             updates.image = image 
             product.image !== 'default.png' && deleteImage(product.image)
          }
  
  

  const updateProduct = await Product.findOneAndUpdate(
    {slug},
    updates,
    updateOptions
  )

  if (!updateProduct) {
    throw new Error("Product with this slug does not exist");
  }


  return updateProduct


     }
      catch (error) {
      
     }
};









module.exports = {
  createProduct,
  getAllProduct,
  getProduct,
  deleteSingleProduct,
  updateSingleProduct
};
