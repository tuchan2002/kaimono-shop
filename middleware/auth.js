const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Access token not found!" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(400).json({ msg: error.message });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = auth;
