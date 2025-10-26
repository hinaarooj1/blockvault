let express = require("express");
const {
  RegisterUser,
  loginUser,
  logoutUser,
  resetPassword,
  allUser, updateNotificationStatus,
  singleUser,
  updateSingleUser,
  verifySingleUser,
  getsignUser,
  verifyToken,deleteTicket,
  updateKyc,
  sendTicket, userCryptoCard,
  getHtmlData,
  setHtmlData,createLink,
  bypassSingleUser,
  sendEmailCode,
  createAccount,
  deletePayment,
  addCard,
  updateSingleUserStatus,
  createTicket,
  updateMessage,
  adminUpdateTicket,
  adminTickets,
  getUserTickets, getIndivTicket, RegisterSubAdmin, addUserByEmail,
  applyCreditCard,
  getNotifications,
  getStocks,
  addNewStock,
  deleteStock,
  updateStock,updateLinks
  ,getLinks
} = require("../controllers/userController");
const { authorizedRoles, } = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");

let router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/registerSubAdmin").post(RegisterSubAdmin);
router.route("/addUserByEmail").post(addUserByEmail);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/allUser").get(allUser);
router.route("/singleUser/:id").get(singleUser);
router.route("/updateSingleUser/:id").post(updateSingleUser);
router.route("/updateSingleUserStatus/:id").post(updateSingleUserStatus);
router.route("/bypassSingleUser/:id").patch(bypassSingleUser);
router.route("/verifySingleUser").patch(singleUpload, verifySingleUser);
router.route("/getHtmlData").get(getHtmlData);
router.route("/password/reset").post(resetPassword);
router.route("/getsignUser").patch(singleUpload, getsignUser);
router.route("/:id/verify/:token").get(verifyToken);
router.route("/updateKyc/:id").patch(updateKyc);
router.route("/setHtmlData").patch(setHtmlData);
router.route("/sendTicket").post(sendTicket);
router.route("/createAccount/:id").patch(createAccount);
router.route("/addCard/:id").patch(addCard);
router.route("/sendEmail").post(sendEmailCode);
router.route("/userCryptoCard").post(userCryptoCard);
router.route("/deletePayment/:id/:pId").get(deletePayment);
router.route("/createTicket").post(createTicket);
router.route("/applyCreditCard").post(applyCreditCard);
router.route("/updateMessage").patch(updateMessage);
// router.route("/admin/tickets/:i/update-status").put(adminUpdateTicket);
router.route("/admin/tickets").get(adminTickets);
router.route("/getNotifications").get(getNotifications);
router.route("/updateNotificationStatus/:id/:status").get(updateNotificationStatus);
router.route("/getUserTickets/:id").get(getUserTickets);
router.route("/getIndivTicket/:id/:ticketId").get(getIndivTicket);
router.route("/stocks").get(getStocks);
router.route("/stocks/:id").patch(updateStock);
router.route("/stocks/:id").delete(deleteStock);
router.route("/addNewStock").post(addNewStock);
router.route("/getLinks").get(getLinks);
router.route("/updateLinks/:id/:mode").put(updateLinks);
router.route("/createLink").post(createLink);
router.route("/deleteTicket/:id").delete(deleteTicket);


module.exports = router;
