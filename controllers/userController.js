const Users = require("../models/userModel");
const Payments = require("../models/paymentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "The email already exists." });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });
      }

      // hash password
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      // save mongodb
      await newUser.save();

      // Then create jsonwebtoken to authentication
      const accesstoken = createAccessToken({ id: newUser.id });
      const refreshtoken = createRefreshToken({ id: newUser.id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const refresh_token = req.cookies.refreshtoken;
      if (!refresh_token) {
        return res.status(400).json({ msg: "Please Login or Register" });
      }

      jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        (error, user) => {
          if (error) {
            return res.status(400).json({ msg: "Please Login or Register" });
          }
          const accesstoken = createAccessToken({ id: user.id });

          return res.json({ accesstoken });
        }
      );
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Incorrect password." });
      }

      // if login success , create access token and refresh token
      const accesstoken = createAccessToken({ id: user.id });
      const refreshtoken = createRefreshToken({ id: user.id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({ accesstoken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  addCart: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          cart: req.body.cart,
        }
      );

      return res.json({ msg: "Added to cart." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  history: async (req, res) => {
    try {
      const history = await Payments.find({ user_id: req.user.id });

      return res.json(history);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userController;
