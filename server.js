const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const dbConfig = require("./app/config/db.config");
const path=require("path")
const app = express();
const { v4: uuidv4 } = require('uuid');
uuidv4();
const multer=require("multer")
const DIR = './public/';
const db = require("./app/models");
const User = db.user;
const Image = db.image; 

// app.use(express.static('public'))
// app.use(express.static('files'))
app.use('/public', express.static('public'))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, uuidv4() + '-' + fileName)
  }
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
  }
});
var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcom " });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}


app.post('/user-profile', upload.single('profileImg'), async (req, res, next) => {
  const imgData=Image.find({ user: req.body.userId })
  const url = req.protocol + '://' + req.get('host')
  console.log(req.body.userId)
  const user=await User.findOne({
    _id: req.body.userId,
  })
  user.profileImgs= url + '/public/'+req.file.filename
  console.log(user)

  const image = new Image({
      name: url + '/public/'+req.file.filename,
      user:req.body.userId
  });

  image.save(err => {
    if (err) {
      console.log("error", err);
    }

    console.log("added 'image' to image collection");
  });
  console.log(image)
  user.profileImgs=user.profileImgs.concat(image._id);

  user.save(err => {
    if (err) {
      console.log("error", err);
    }

    console.log("added 'image' to user");
    imgData.exec(function(err, result) {
      if (err) throw err;
      console.log(result);
      return res.json(result);
      });
  });
  

})


