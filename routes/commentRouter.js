const router = require("express").Router();
const commentController = require("../controllers/commentController");

router
  .route("/comments/:productId")
  .get(commentController.getCommentsByProductId);

module.exports = router;
