const router = require("express").Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/authAdmin");

router
  .route("/products")
  .get(productController.getProducts)
  .post(auth, authAdmin, productController.createProduct);

router
  .route("/products/:id")
  .delete(auth, authAdmin, productController.deleteProduct)
  .put(auth, authAdmin, productController.updateProduct)
  .patch(auth, productController.reviews);

module.exports = router;
