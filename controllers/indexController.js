const passport = require("passport");
const { body, validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");
const errorMsg = require("../public/error");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const validateUser = [
  body("username").trim(),
  body("email").trim().isEmail().withMessage(`Email is ${errorMsg.emailErr}`),
  body("password").isLength({ min: 1 }),
  body("confirmPw")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

const validateFolderName = [body("newFolder").trim()];

async function indexPage(req, res) {
  const folders = await prisma.folders.findMany();
  res.render("index", {
    title: "Index Page",
    folders: folders,
  });
}

function signupPage(req, res) {
  res.render("signup", {
    title: "Signup Page",
  });
}

function loginPage(req, res) {
  res.render("login", {
    title: "Login Page",
  });
}

const loginUser = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

const createNewUser = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);

    const { username, email, password } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.render("index", {
        title: "Index Page",
        errors: errors.array(),
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: hashedPassword,
          folder: {
            create: [{ foldername: "Root" }],
          },
        },
      });

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];

async function uploadPage(req, res) {
  // console.log(req.params.folderId);
  res.render("upload", {
    title: "Upload page",
    folderId: req.params.folderId,
  });
}

const uploadFile = [
  // upload.single("upload"),
  (req, res) => {
    console.log(req.params.folderId);
    console.log(req.file);
    res.redirect("/");
  },
];

//gotta upload to prisma database instead of to the server

const createFolder = [
  validateFolderName,
  async (req, res) => {
    const { newFolder } = matchedData(req);

    try {
      await prisma.folders.create({
        data: { foldername: newFolder, userId: res.locals.user.id },
      });

      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];

module.exports = {
  indexPage,
  signupPage,
  createNewUser,
  loginPage,
  loginUser,
  logout,
  uploadPage,
  uploadFile,
  createFolder,
};
