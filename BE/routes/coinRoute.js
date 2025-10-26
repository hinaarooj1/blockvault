let express = require("express");

const { authorizedRoles, isAuthorizedUser } = require("../middlewares/auth");
const {
  addCoins,
  getCoins,
  updateCoinAddress,
  createTransaction,
  updateTransaction,
  getTransactions,
  getEachUser,
  getCoinsUser, UnassignUser,
  getUserCoin,
  deleteEachUser,
  createUserTransaction,
  deleteTransaction,
  createUserTransactionWithdrawSwap,
  createUserTransactionDepositSwap,
  createUserStocks,
  deleteUserStocksApi, updateNewCoinAddress, updateAdditionalCoinsForAllUsers,
  exportExcel, markTrxClose,
  getStakingSettings, updateStakingSettings, getStakingRewards
} = require("../controllers/coinsController");

let router = express.Router();

router.route("/updateCoins").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),updateAdditionalCoinsForAllUsers);
router.route("/addCoins/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),addCoins);
router.route("/updateCoinAddress/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),updateCoinAddress);
router.route("/updateNewCoinAddress/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),updateNewCoinAddress);
router.route("/getCoins/:id").get(isAuthorizedUser, getCoins);
router.route("/getUserCoin/:id").get(isAuthorizedUser, getUserCoin);
router.route("/markTrxClose/:id/:Coinid").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),markTrxClose);

router.route("/getCoinsUser/:id").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),getCoinsUser);
router.route("/exportExcel").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),exportExcel);
router
  .route("/deleteTransaction/:userId/:transactionId")
  .get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),deleteTransaction);
router
  .route("/deleteUserStocksApi/:id/:coindId")
  .delete(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),deleteUserStocksApi);

router.route("/createTransaction/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),createTransaction);
router.route("/createUserStocks/:id").post(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),createUserStocks);
router.route("/createUserTransaction/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),createUserTransaction);
router
  .route("/createUserTransactionWithdrawSwap/:id")
  .patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),createUserTransactionWithdrawSwap);
router
  .route("/createUserTransactionDepositSwap/:id")
  .patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),createUserTransactionDepositSwap);
router.route("/updateTransaction/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),updateTransaction);
router.route("/getTransactions").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),getTransactions);
router.route("/getEachUser/:id").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),getEachUser);
router.route("/deleteEachUser/:id").delete(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin" ),deleteEachUser);
router.route("/UnassignUser/:id").delete(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"),UnassignUser);

router.route("/getStakingSettings/:id").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),getStakingSettings);
router.route("/updateStakingSettings/:id").patch(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),updateStakingSettings);
router.route("/getStakingRewards/:id/stakings").get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin","user"),getStakingRewards);
module.exports = router;
