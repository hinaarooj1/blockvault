let express = require("express");

const { authorizedRoles } = require("../middlewares/auth");
const {
  uploadFiles,
  getAllData,
  deleteSingleFile,
} = require("../controllers/filesController");
const singleUpload = require("../middlewares/multer");

let router = express.Router();

router.route("/uploadFiles/:id").post(singleUpload, uploadFiles);
router.route("/getAllData/:id").get(getAllData);
router.route("/deleteSingleFile/:_id").get(deleteSingleFile);

module.exports = router;
