const db = require("../models");
const User = db.user;
const Image = db.image; 


exports.getImg = (req, res,next) => {
    const imgData=Image.find({ user: req.query.userId})
    console.log(req.query.userId) 
    imgData.exec(function(err, result) {
    if (err) throw err;
    console.log(result);
    return res.json(result);
    });
  }
