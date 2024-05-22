const { Schema, model } = require("mongoose");
const Category = require("./categoryModel");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      unique: true,
      minlength: [3, "Product name can be minimun 3 characters"],
    },

    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [3, "Product description can be minimun 3 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not valid price.Price must be greater than 0.`,
      },
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not valid quantity.Quantity must be greater than 0.`,
      },
    },

    sold: {
      type: Number,
      required: [true, "Sold quantity is required"],
      trim: true,
      default: 0,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: props => `${props.value} is not valid sold. Sold must be greater than or equal to 0.`,
      },
    },


 shipping: {
      type: Number,
       default:0, 

    },

    image:{
        type:String,
        required:[true,'Product image is required'],
     },

   

     category:{
        type:Schema.Types.ObjectId ,
        ref:Category ,
        required:true
     }
    









  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
