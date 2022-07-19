const mongoose = require("mongoose");

const Image = mongoose.model(
  "Image",
  new mongoose.Schema({
    name: String,
    user:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
      }
    
  })
);

module.exports = Image;
