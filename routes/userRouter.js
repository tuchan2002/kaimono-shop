const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.get("/refresh_token", userController.refreshToken);
router.get("/information", auth, userController.getUser);
router.patch("/add_cart", auth, userController.addCart);
router.get("/history", auth, userController.history);

module.exports = router;
