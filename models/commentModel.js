const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    star: {
      type: Number,
      default: 0,
    },
    product_id: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comments", commentSchema);
