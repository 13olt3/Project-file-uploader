const passport = require("passport");
const { body, validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");
const errorMsg = require("../public/error");

const validateUser = [
  body("username").trim(),
  body("email")
    .trim()
    .isEmail()
    .withMessage(`Email is ${errorMsg.emailErr}`)
    .custom(async (value) => {
      // const user = await dbQuery.checkEmail(value);
      // if (user) {
      //   throw new Error(errorMsg.emailInUseErr);
      // }

      ///FIX THIS
      return true;
    }),
  body("password").isLength({ min: 1 }),
  body("confirmPw")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

async function indexPage(req, res) {
  // const tests = await prisma.tester.findMany();
  // console.log(tests);

  res.render("index", {
    title: "Index Page",
  });
}

function signupPage(req, res) {
  res.render("signup", {
    title: "Signup Page",
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
        },
      });
      res.redirect("/");
    } catch (err) {
      next(err);
    }
  },
];

// const textTest = [
//   validateTest,
//   async (req, res, next) => {
//     const { tester } = matchedData(req);

//     try {
//       await prisma.tester.create({
//         data: {
//           message: tester,
//         },
//       });
//     } catch (err) {
//       next(err);
//     }
//     res.redirect("/");
//   },
// ];

module.exports = {
  indexPage,
  signupPage,
  createNewUser,
};
