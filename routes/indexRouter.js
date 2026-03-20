const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.indexPage);
indexRouter.get("/signup", indexController.signupPage);

indexRouter.post("/signup", indexController.createNewUser);

module.exports = indexRouter;
