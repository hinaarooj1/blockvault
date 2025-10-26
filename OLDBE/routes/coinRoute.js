let express = require("express");

const { authorizedRoles } = require("../middlewares/auth");
const {
  addCoins,
  getCoins,
  updateCoinAddress,
  createTransaction,
  updateTransaction,
  getTransactions,
  getEachUser,
  getCoinsUser,UnassignUser,
  getUserCoin,
  deleteEachUser,
  createUserTransaction,
  deleteTransaction,
  createUserTransactionWithdrawSwap,
  createUserTransactionDepositSwap,
  createUserStocks,
  deleteUserStocksApi, updateNewCoinAddress, updateAdditionalCoinsForAllUsers,
  exportExcel,markTrxClose
} = require("../controllers/coinsController");

let router = express.Router();

router.route("/updateCoins").patch(updateAdditionalCoinsForAllUsers);
router.route("/addCoins/:id").patch(addCoins);
router.route("/updateCoinAddress/:id").patch(updateCoinAddress);
router.route("/updateNewCoinAddress/:id").patch(updateNewCoinAddress);
router.route("/getCoins/:id").get(getCoins);
router.route("/getUserCoin/:id").get(getUserCoin);
router.route("/markTrxClose/:id/:Coinid").patch(markTrxClose);

router.route("/getCoinsUser/:id").get(getCoinsUser);
router.route("/exportExcel").get(exportExcel);
router
  .route("/deleteTransaction/:userId/:transactionId")
  .get(deleteTransaction);
router
  .route("/deleteUserStocksApi/:id/:coindId")
  .delete(deleteUserStocksApi);
router.route("/createTransaction/:id").patch(createTransaction);
router.route("/createUserStocks/:id").post(createUserStocks);
router.route("/createUserTransaction/:id").patch(createUserTransaction);
router
  .route("/createUserTransactionWithdrawSwap/:id")
  .patch(createUserTransactionWithdrawSwap);
router
  .route("/createUserTransactionDepositSwap/:id")
  .patch(createUserTransactionDepositSwap);
router.route("/updateTransaction/:id").patch(updateTransaction);
router.route("/getTransactions").get(getTransactions);
router.route("/getEachUser/:id").get(getEachUser);
router.route("/deleteEachUser/:id").delete(deleteEachUser);
router.route("/UnassignUser/:id").delete(UnassignUser);

module.exports = router;
