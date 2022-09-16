const Products = require("../models/productModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString; // queryString = req.query
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => {
      console.log(match);
      return "$" + match;
    });

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      console.log(this.queryString.sort);
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // lastest
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

const productController = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;

      return res.json({
        success: true,
        result: products.length,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) {
        return res.status(400).json({ msg: "No image upload." });
      }

      const newProduct = new Products({
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      });

      await newProduct.save();
      return res.json({ msg: "Created a product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) {
        return res.status(400).json({ msg: "No image upload." });
      }

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          images,
          category,
        }
      );

      return res.json({ msg: "Updated a Product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      return res.json({ msg: "Deleted a Product" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  reviews: async (req, res) => {
    try {
      const { star } = req.body;
      if (star && star !== 0) {
        const product = await Products.findById(req.params.id);
        if (!product) {
          return res.status(400).json({ message: "Product does not exist." });
        }
        let productNumReviews = product.numReviews;
        let productStar = product.star;

        await Products.findOneAndUpdate(
          { _id: req.params.id },
          {
            star: productStar + star,
            numReviews: productNumReviews + 1,
          }
        );

        return res.json({ message: "Update success." });
      }
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productController;
