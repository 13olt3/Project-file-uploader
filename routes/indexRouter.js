const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.indexPage);
indexRouter.get("/signup", indexController.signupPage);
indexRouter.get("/login", indexController.loginPage);
indexRouter.get("/logout", indexController.logout);
indexRouter.get("/upload", indexController.uploadPage);

indexRouter.post("/signup", indexController.createNewUser);
indexRouter.post("/login", indexController.loginUser);
indexRouter.post("/upload", indexController.uploadFile);

module.exports = indexRouter;
