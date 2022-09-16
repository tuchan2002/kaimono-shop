const Category = require("../models/categoryModel");
const Products = require("../models/productModel");

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category) {
        return res.status(400).json({ msg: "This category already exists." });
      }

      const newCategory = new Category({ name });

      await newCategory.save();
      return res.json({ msg: "Created a category." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });

      return res.json({ msg: "Updated a category." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      console.log("products", products);
      if (products) {
        return res.status(400).json({
          msg: "Please delete all products with a relationship.",
        });
      }

      await Category.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Deleted a Category." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = categoryController;
