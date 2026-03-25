const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router({ mergeParams: true });

indexRouter.get("/", indexController.indexPage);
indexRouter.get("/signup", indexController.signupPage);
indexRouter.get("/login", indexController.loginPage);
indexRouter.get("/logout", indexController.logout);
indexRouter.get("/upload/:folderId", indexController.uploadPage);
indexRouter.get("/files", indexController.showUploads);
indexRouter.get("/allFiles", indexController.showAllFiles);
indexRouter.get("/files/:id", indexController.specificFolder);

indexRouter.post("/signup", indexController.createNewUser);
indexRouter.post("/login", indexController.loginUser);
indexRouter.post("/upload/:folderId", indexController.uploadFile);
indexRouter.post("/createFolder", indexController.createFolder);

// indexRouter.post("/upload", indexController.uploadFile);

module.exports = indexRouter;
