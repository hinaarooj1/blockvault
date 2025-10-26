let express = require("express");

const { authorizedRoles, isAuthorizedUser } = require("../middlewares/auth");
const {
  uploadFiles,
  getAllData,
  deleteSingleFile,
} = require("../controllers/filesController");
const singleUpload = require("../middlewares/multer");

let router = express.Router();

router.route("/uploadFiles/:id").post(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),singleUpload, uploadFiles);
router.route("/getAllData/:id").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),getAllData);
router.route("/deleteSingleFile/:_id").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),deleteSingleFile);

module.exports = router;
