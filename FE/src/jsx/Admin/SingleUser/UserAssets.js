import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import './styleNew.css'
import {
  createTransactionApi,
  deletePaymentApi,
  getCoinsApi,
  patchCoinsApi,
  signleUsersApi,
  updateCoinAddressApi, updateNewCoinAddressApi
} from "../../../Api/Service";
import { toast } from "react-toastify";
import axios from "axios";
import AdminHeader from "../adminHeader";
const UserAssets = () => {
  const [modal1, setModal1] = useState(false);

  const [isDisable1, setisDisable1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const [activeStatus, setactiveStatus] = useState(false);
  const [usdtAddressModal, setusdtAddressModal] = useState(false);
  const [ethAddressModal, setethAddressModal] = useState(false);
  const [newModal, setnewModal] = useState({
    state: false,
    Coinname: "", address: ""

  });
  const [isLoading, setisLoading] = useState(true);
  const [allCoins, setallCoins] = useState("");
  const [userData, setUserData] = useState(null);
  const [newUserCoins, setnewUserCoins] = useState(null);

  const [status, setStatus] = useState("");
  const [btcBalance, setbtcBalance] = useState(0);
  const [ethBalance, setethBalance] = useState(0);
  const [usdtBalance, setusdtBalance] = useState(0);
  const [depositName, setdepositName] = useState("");
  const [coinAddress, setcoinAddress] = useState({
    btcAddress: "",
    ehtAddress: "",
    usdtAddress: "",
  });

  const [newCoinAddress, setnewCoinAddress] = useState({
    coinSymbol: "",  // Currently selected coin symbol
    address: {},     // Object to store addresses for each coin
  });
  const getSignleUser = async () => {
    try {
      const signleUser = await signleUsersApi(id);

      if (signleUser.success) {
        setUserData(signleUser.signleUser);
      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
    }
  };
  const [transactionDetail, settransactionDetail] = useState({
    amount: "",
    amountMinus: "",
    txId: "",
    fromAddress: "",
    note: "", reference: '', clientMessage: ""
  });
  let handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setcoinAddress({ ...coinAddress, [name]: value });
  };

  const handleInputNewAddress = (e) => {
    setnewCoinAddress(prev => ({ ...prev, address: e.target.value }));  // Update address in state
  };
  let handleTransaction = (e) => {
    let name = e.target.name;

    let value = e.target.value;
    settransactionDetail({ ...transactionDetail, [name]: value });
  };

  let { id } = useParams();
  let authUser = useAuthUser();
  let Navigate = useNavigate();
  const [isDisable, setisDisable] = useState(false);

  let toggleAddress = () => {
    setModal1(true);
  };
  let closeToggle = () => {
    setModal1(false);
    setusdtAddressModal(false);
    setethAddressModal(false);
    setnewModal({ state: false, Coinname: "", address: "", coinId: '' });
    setnewCoinAddress({ address: {}, coinSymbol: '' });

  };
  let setNewModal = (e, name, tokenAddress, coinSymbol, coinid) => {
    console.log('coinid: ', coinid);
    setnewCoinAddress({ coinSymbol, address: tokenAddress });
    setnewModal({ state: true, Coinname: name, address: tokenAddress, coinId: coinid })

  }

  const [liveBtc, setliveBtc] = useState(null);
  const [userCoins, setuserCoins] = useState('');
  const [User, setUser] = useState("");
  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  const getCoins = async () => {
    try {
      // const response = await axios.get(
      //   "https://api.coindesk.com/v1/bpi/currentprice.json"
      // );
      const userCoins = await getCoinsApi(id);
      if (userCoins.success) {
        setisLoading(false);
        let val = 0;
        if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {

          val = userCoins.btcPrice.quote.USD.price
        } else {
          val = 96075.25
        }
        setliveBtc(val);
        setuserCoins(userCoins)
        console.log('userCoins.getCoin.additionalCoins: ', userCoins.getCoin.additionalCoins);
        setnewUserCoins(userCoins.getCoin.additionalCoins)
        // tx
        console.log('userCoins.getCoin: ',);
        const btc = userCoins.getCoin.transactions.filter((transaction) =>
          transaction.trxName.includes("bitcoin")
        );
        const btccomplete = btc.filter((transaction) =>
          transaction.status.includes("completed")
        );
        let btcCount = 0;
        let btcValueAdded = 0;
        for (let i = 0; i < btccomplete.length; i++) {
          const element = btccomplete[i];
          btcCount = element.amount;
          btcValueAdded += btcCount;
        }
        setbtcBalance(btcValueAdded);
        // tx
        // tx
        const eth = userCoins.getCoin.transactions.filter((transaction) =>
          transaction.trxName.includes("ethereum")
        );
        const ethcomplete = eth.filter((transaction) =>
          transaction.status.includes("completed")
        );
        let ethCount = 0;
        let ethValueAdded = 0;
        for (let i = 0; i < ethcomplete.length; i++) {
          const element = ethcomplete[i];
          ethCount = element.amount;
          ethValueAdded += ethCount;
        }
        setethBalance(ethValueAdded);
        // tx
        // tx
        const usdt = userCoins.getCoin.transactions.filter((transaction) =>
          transaction.trxName.includes("tether")
        );
        const usdtcomplete = usdt.filter((transaction) =>
          transaction.status.includes("completed")
        );
        let usdtCount = 0;
        let usdtValueAdded = 0;
        for (let i = 0; i < usdtcomplete.length; i++) {
          const element = usdtcomplete[i];
          usdtCount = element.amount;
          usdtValueAdded += usdtCount;
        }
        setusdtBalance(usdtValueAdded);
        // tx

        setcoinAddress({
          btcAddress: userCoins.getCoin.btcTokenAddress,
          ehtAddress: userCoins.getCoin.ethTokenAddress,
          usdtAddress: userCoins.getCoin.usdtTokenAddress,
        });
        setallCoins(userCoins.getCoin);

        return;
      } else {
        toast.dismiss();
        toast.error(userCoins.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
    }
  };
  const getCoinPrice = (coinSymbol) => {
    switch (coinSymbol) {
      case "bnb": return 210.25; // Example price
      case "xrp": return 0.5086; // Example price
      case "doge": return 0.1163; // Example price
      case "sol": return 245.01; // Example price
      case "eur": return 1.08; // Example price
      case "ton": return 5.76; // Example price
      case "link": return 12.52; // Example price
      case "dot": return 4.76; // Example price
      case "near": return 5.59; // Example price
      case "usdc": return 0.99; // Example price
      case "trx": return 0.1531; // Example price
      default: return 0; // Unknown coin price
    }
  };
  const getTransactionsForCoin = (coinSymbol, transactions) => {
    console.log('coinSymbol: ', coinSymbol);
    // Filter transactions for the specific coin symbol
    const coinTransactions = transactions.filter((transaction) =>
      transaction.trxName.includes(coinSymbol)
    );
    console.log("coinTransactionsas", coinTransactions);
    // Filter completed transactions
    const completedTransactions = coinTransactions.filter((transaction) =>
      transaction.status.includes("completed")
    );

    // Calculate total balance (assuming each transaction has a 'value' property)
    const totalBalance = completedTransactions.reduce((acc, transaction) => {
      console.log('transactionsa: ', transaction);
      console.log('acc: ', acc);
      return acc + transaction.amount; // Adjust according to your transaction structure
    }, 0);

    return totalBalance;
  };
  const patchCoins = async () => {
    try {
      const userCoins = await patchCoinsApi(id);

      if (userCoins.success) {
        getCoins();
      } else {
        toast.dismiss();
        toast.error(userCoins.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
    }
  };
  let updateNewCoin = async (e) => {
    e.preventDefault();
    console.log(newCoinAddress);
    try {
      setisDisable(true);
      let body = {
        newCoinAddress
      };

      const newAddress = await updateNewCoinAddressApi(id, body);

      if (newAddress.success) {
        toast.dismiss();
        toast.success(newAddress.msg);
        closeToggle();
        getCoins()
      } else {
        toast.dismiss();
        toast.error(newAddress.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  }
  const updateCoinsAddress = async (e) => {
    e.preventDefault();
    try {
      setisDisable(true);
      let body = {
        btcTokenAddress: coinAddress.btcAddress,
        ethTokenAddress: coinAddress.ehtAddress,
        usdtTokenAddress: coinAddress.usdtAddress,
      };

      const newAddress = await updateCoinAddressApi(id, body);

      if (newAddress.success) {
        toast.dismiss();
        toast.success(newAddress.msg);

        closeToggle();
      } else {
        toast.dismiss();
        toast.error(newAddress.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  };
  // Transaction
  let tetherDeposit = () => {
    setdepositName("tether");
    setModal2(true);
  };
  let NewCoinDeposit = (e) => {
    console.log('e: ', e);
    setdepositName(e.coinName);
    setModal2(true);
  };
  let NewCoinDepositMinus = (e) => {
    console.log('e: ', e);
    setdepositName(e.coinName);
    setModal3(true);
  };

  let btcDeposit = () => {
    setdepositName("bitcoin");
    setModal2(true);
  };
  let ethDeposit = () => {
    setdepositName("ethereum");

    setModal2(true);
  };
  let tetherDepositMinus = () => {
    setdepositName("tether");
    setModal3(true);
  };

  let btcDepositMinus = () => {
    setdepositName("bitcoin");
    setModal3(true);
  };
  let ethDepositMinus = () => {
    setdepositName("ethereum");

    setModal3(true);
  };
  let closeDeposit = () => {
    setdepositName("");
    setStatus("");
    settransactionDetail({
      amount: 0,
      txId: "",
      fromAddress: "",
      note: "", reference: '', clientMessage: ""
    });
    setModal2(false);
    setModal3(false);
    setactiveStatus(false);
  };
  let toggleStatus = () => {
    if (activeStatus === true) {
      setactiveStatus(false);
    } else {
      setactiveStatus(true);
    }
  };
  const createTransaction = async (e) => {
    e.preventDefault();
    try {
      setisDisable(true);
      let finalAmount;
      let type;
      if (transactionDetail.amount != 0) {
        finalAmount = transactionDetail.amount;
        type = "deposit";
      } else if (transactionDetail.amountMinus != 0) {
        finalAmount = -transactionDetail.amountMinus;
        type = "withdraw";
      } else if (
        transactionDetail.amount === 0 ||
        transactionDetail.amountMinus === 0
      ) {
        toast.dismiss();
        toast.error("Transaction amount cannot be equal to zero");
        return;
      }

      let body = {

        trxName: depositName,
        amount: finalAmount,
        txId: transactionDetail.txId,
        fromAddress: transactionDetail.fromAddress,
        note: transactionDetail.note,
        reference: transactionDetail.reference,
        subjectLine: transactionDetail.clientMessage,
        status: status,
        type: type,
      };
      console.log('body: ', body);

      if (
        !body.trxName ||
        !body.amount ||
        !body.status ||
        !body.type ||

        (depositName !== "Euro" && (!body.txId || !body.fromAddress))
      ) {
        toast.dismiss();
        toast.error("Fill all the required fields");
        return;
      }
      if (transactionDetail.note && transactionDetail.note.trim()) {
        if (transactionDetail.clientMessage.trim() === "") {

          return toast.error("Please add subject line for client email")
        }
      }
      const newTransaction = await createTransactionApi(id, body);

      if (newTransaction.success) {
        toast.dismiss();
        toast.success(newTransaction.msg);
        getCoins();
        closeDeposit();
      } else {
        toast.dismiss();
        toast.error(newTransaction.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  };
  const deletePayment = async (pId) => {
    try {
      setisDisable1(true);
      let id = userData._id;
      const deleteAccount = await deletePaymentApi(id, pId);

      if (deleteAccount.success) {
        toast.success(deleteAccount.msg);
        getSignleUser();

        return;
      } else {
        toast.dismiss();
        toast.error(deleteAccount.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisable1(false);
    }
  };
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
    getSignleUser();
    patchCoins();
    // console.log(btcBalance);
  }, []);
  return (
    <div className="admin">
      <div>
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            <div className="mx-auto w-full max-w-7xl">

              <AdminHeader toggle={toggleBar} pageName="User Management" />
              <div
                className="nuxt-loading-indicator"
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  left: "0px",
                  pointerEvents: "none",
                  width: "auto",
                  height: "3px",
                  opacity: 0,
                  background: "var(--color-primary-500)",
                  transform: "scaleX(0)",
                  transformOrigin: "left center",
                  transition:
                    "transform 0.1s ease 0s, height 0.4s ease 0s, opacity 0.4s ease 0s",
                  zIndex: 999999,
                }}
              />
              <seokit />
              <div className="min-h-screen overflow-hidden">
                <div className="grid gap-8 sm:grid-cols-12">
                  <UserSideBar userid={id} />
                  <div className="col-span-12 sm:col-span-8">
                    <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-md">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p
                            className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                            tag="h2"
                          >
                            {" "}
                            Manage Assets{" "}
                          </p>
                        </div>
                      </div>
                      {isLoading ? (
                        <div className="  p-5">Loading Assets...</div>
                      ) : (
                        <div className="pt-6">
                          <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg last:rounded-b-lg [&:not(:first-child)]:border-t-0">
                            <div className="flex w-full flex-col sm:flex-row sm:items-center">
                              <div style={{ width: "30%", flexGrow: "0" }} className="relative mb-4 flex grow items-center gap-2 px-6 sm:mb-0 sm:px-2 h-10">
                                <span className="text-muted-400 absolute hidden font-sans text-xs font-medium uppercase sm:-top-10 sm:start-2 sm:block">
                                  currency
                                </span>
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                  icon="cryptocurrency:btc"
                                >
                                  <svg
                                    data-v-cd102a71
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    className="icon h-5 w-5"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 32 32"
                                  >
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m7.189-17.98c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84l-1.728-.43l-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009l-2.384-.595l-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045l-1.13 4.532c-.086.212-.303.531-.793.41c.018.025-1.256-.313-1.256-.313l-.858 1.978l2.25.561c.418.105.828.215 1.231.318l-.715 2.872l1.727.43l.708-2.84c.472.127.93.245 1.378.357l-.706 2.828l1.728.43l.715-2.866c2.948.558 5.164.333 6.097-2.333c.752-2.146-.037-3.385-1.588-4.192c1.13-.26 1.98-1.003 2.207-2.538m-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11m.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                    <span>Bitcoin</span>
                                  </h4>
                                  <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                    <span>BTC</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center kkass" >
                                <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto">
                                  <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0">
                                    balance
                                  </span>
                                  <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                    {`${btcBalance.toFixed(8)} (${(
                                      btcBalance * liveBtc
                                    ).toFixed(2)} USD)`}
                                  </span>
                                </div>
                                <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-60">
                                  <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0">
                                    action
                                  </span>
                                  <button
                                    onClick={toggleAddress}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M93 180l71-71l11 11l-71 71Zm-17-17l-11-11l71-71l11 11Zm-24 10l15.51 15.51L83 204H52Zm140-70l-39-39l18.34-18.34l39 39Z"
                                      />
                                    </svg>
                                    <span>Update</span>
                                  </button>
                                  <button
                                    onClick={btcDeposit}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M204 88v104a12 12 0 0 1-12 12H88a12 12 0 0 1 0-24h75L55.51 72.48a12 12 0 0 1 17-17L180 163V88a12 12 0 0 1 24 0"
                                      />
                                    </svg>
                                    <span>Deposit</span>
                                  </button>
                                  <button
                                    onClick={btcDepositMinus}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                      />
                                    </svg>
                                    <span>Withdrawal</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg last:rounded-b-lg [&:not(:first-child)]:border-t-0">
                            <div className="flex w-full flex-col sm:flex-row sm:items-center">
                              <div style={{ width: "30%", flexGrow: "0" }} className="relative mb-4 flex grow items-center gap-2 px-6 sm:mb-0 sm:px-2 h-10">
                                <span className="text-muted-400 absolute hidden font-sans text-xs font-medium uppercase sm:-top-10 sm:start-2 sm:block sm:hidden">
                                  currency
                                </span>
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                  icon="cryptocurrency:eth"
                                >
                                  <svg
                                    data-v-cd102a71
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    className="icon h-5 w-5"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 32 32"
                                  >
                                    <g fill="currentColor" fillRule="evenodd">
                                      <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m7.994-15.781L16.498 4L9 16.22l7.498 4.353zM24 17.616l-7.502 4.351L9 17.617l7.498 10.378z" />
                                      <g fillRule="nonzero">
                                        <path
                                          fillOpacity=".298"
                                          d="M16.498 4v8.87l7.497 3.35zm0 17.968v6.027L24 17.616z"
                                        />
                                        <path
                                          fillOpacity=".801"
                                          d="m16.498 20.573l7.497-4.353l-7.497-3.348z"
                                        />
                                        <path
                                          fillOpacity=".298"
                                          d="m9 16.22l7.498 4.353v-7.701z"
                                        />
                                      </g>
                                    </g>
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                    <span>Ethereum</span>
                                  </h4>
                                  <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                    <span>ETH</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center kkass" >
                                <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto">
                                  <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0 sm:hidden">
                                    balance
                                  </span>
                                  <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                    {`${ethBalance.toFixed(8)} (${(
                                      ethBalance * 2640
                                    ).toFixed(2)} USD)`}
                                  </span>
                                </div>
                                <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-60">
                                  <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0 sm:hidden">
                                    action
                                  </span>
                                  <button
                                    onClick={() => setusdtAddressModal(true)}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M93 180l71-71l11 11l-71 71Zm-17-17l-11-11l71-71l11 11Zm-24 10l15.51 15.51L83 204H52Zm140-70l-39-39l18.34-18.34l39 39Z"
                                      />
                                    </svg>
                                    <span>Update</span>
                                  </button>
                                  <button
                                    onClick={ethDeposit}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M204 88v104a12 12 0 0 1-12 12H88a12 12 0 0 1 0-24h75L55.51 72.48a12 12 0 0 1 17-17L180 163V88a12 12 0 0 1 24 0"
                                      />
                                    </svg>
                                    <span>Deposit</span>
                                  </button>
                                  <button
                                    onClick={ethDepositMinus}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                      />
                                    </svg>
                                    <span>Withdrawal</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg last:rounded-b-lg [&:not(:first-child)]:border-t-0">
                            <div className="flex w-full flex-col sm:flex-row sm:items-center">
                              <div style={{ width: "30%", flexGrow: "0" }} className="relative mb-4 flex grow items-center gap-2 px-6 sm:mb-0 sm:px-2 h-10">
                                <span className="text-muted-400 absolute hidden font-sans text-xs font-medium uppercase sm:-top-10 sm:start-2 sm:block sm:hidden">
                                  currency
                                </span>
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                  icon="cryptocurrency:usdt"
                                >
                                  <svg
                                    data-v-cd102a71
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    aria-hidden="true"
                                    role="img"
                                    className="icon h-5 w-5"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 32 32"
                                  >
                                    <path
                                      fill="currentColor"
                                      fillRule="evenodd"
                                      d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m1.922-18.207v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118c0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116c0-1.043-3.301-1.914-7.694-2.117m0 3.59v-.002c-.11.008-.677.042-1.942.042c-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658c0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061c1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658c0 .81-2.895 1.485-6.775 1.657"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                    <span>Tether</span>
                                  </h4>
                                  <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                    <span>USDT</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center kkass" >
                                <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto">
                                  <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0 sm:hidden">
                                    balance
                                  </span>
                                  <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                    {`${usdtBalance.toFixed(
                                      8
                                    )} (${usdtBalance.toFixed(2)} USD)`}
                                  </span>
                                </div>
                                <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-60">
                                  <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0 sm:hidden">
                                    action
                                  </span>
                                  <button
                                    onClick={() => setethAddressModal(true)}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M93 180l71-71l11 11l-71 71Zm-17-17l-11-11l71-71l11 11Zm-24 10l15.51 15.51L83 204H52Zm140-70l-39-39l18.34-18.34l39 39Z"
                                      />
                                    </svg>
                                    <span>Update</span>
                                  </button>
                                  <button
                                    onClick={tetherDeposit}
                                    type="button"
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M204 88v104a12 12 0 0 1-12 12H88a12 12 0 0 1 0-24h75L55.51 72.48a12 12 0 0 1 17-17L180 163V88a12 12 0 0 1 24 0"
                                      />
                                    </svg>
                                    <span>Deposit</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={tetherDepositMinus}
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                  >
                                    <svg
                                      data-v-cd102a71
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlnsXlink="http://www.w3.org/1999/xlink"
                                      aria-hidden="true"
                                      role="img"
                                      className="icon h-5 w-5"
                                      width="1em"
                                      height="1em"
                                      viewBox="0 0 256 256"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                      />
                                    </svg>
                                    <span>Withdrawal</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {
                            newUserCoins && newUserCoins.map((coin, index) => {
                              const totalBalance = getTransactionsForCoin(coin.coinName, userCoins.getCoin.transactions);

                              return (
                                <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg last:rounded-b-lg [&:not(:first-child)]:border-t-0">
                                  <div className="flex w-full flex-col sm:flex-row sm:items-center">
                                    <div style={{ width: "30%", flexGrow: "0" }} className="relative mb-4 flex grow items-center gap-2 px-6 sm:mb-0 sm:px-2 h-10">
                                      <span className="text-muted-400 absolute hidden font-sans text-xs font-medium uppercase sm:-top-10 sm:start-2 sm:block sm:hidden">
                                        currency
                                      </span>
                                      <div
                                        className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                        icon="cryptocurrency:usdt"
                                      >
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon h-5 w-5"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 32 32"
                                        >
                                          <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16s-7.163 16-16 16m1.922-18.207v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118c0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116c0-1.043-3.301-1.914-7.694-2.117m0 3.59v-.002c-.11.008-.677.042-1.942.042c-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658c0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061c1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658c0 .81-2.895 1.485-6.775 1.657"
                                          />
                                        </svg>
                                      </div>
                                      <div>
                                        <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                          <span>{coin.coinName}</span>
                                        </h4>
                                        <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                          <span style={{ textTransform: "uppercase" }}>{coin.coinSymbol}</span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center kkass" >
                                      <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-auto">
                                        <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0 sm:hidden">
                                          balance
                                        </span>
                                        <span className="text-muted-500 dark:text-muted-400 font-sans text-sm">
                                          {/* {
                                            coin.coinSymbol === "bnb" ?
                                              `${coin.balance.toFixed(8)} (${(coin.balance * 210.25).toFixed(2)} USD)` // Correct BNB price
                                              : coin.coinSymbol === "xrp" ?
                                                `${coin.balance.toFixed(8)} (${(coin.balance * 0.5086).toFixed(2)} USD)` // Correct XRP price
                                                : coin.coinSymbol === "doge" ?
                                                  `${coin.balance.toFixed(8)} (${(coin.balance * 0.1163).toFixed(2)} USD)` // Correct Dogecoin price
                                                  : coin.coinSymbol === "ton" ?
                                                    `${coin.balance.toFixed(8)} (${(coin.balance * 5.76).toFixed(2)} USD)`  // Correct Toncoin price
                                                    : coin.coinSymbol === "link" ?
                                                      `${coin.balance.toFixed(8)} (${(coin.balance * 12.52).toFixed(2)} USD)`  // Correct Chainlink price
                                                      : coin.coinSymbol === "dot" ?
                                                        `${coin.balance.toFixed(8)} (${(coin.balance * 4.76
                                                        ).toFixed(2)} USD)`  // Correct Polkadot price
                                                        : coin.coinSymbol === "near" ?
                                                          `${coin.balance.toFixed(8)} (${(coin.balance * 5.59).toFixed(2)} USD)`  // Correct Near Protocol price
                                                          : coin.coinSymbol === "usdc" ?
                                                            `${coin.balance.toFixed(8)} (${(coin.balance * 0.99).toFixed(2)} USD)`  // Correct USDC price (stablecoin)
                                                            : coin.coinSymbol === "trx" ?
                                                              `${coin.balance.toFixed(8)} (${(coin.balance * 0.1531
                                                              ).toFixed(2)} USD)` // Correct TRX price
                                                              : "Unknown Coin"
                                          } */}
                                          {
                                            `${totalBalance.toFixed(8)} (${(totalBalance * getCoinPrice(coin.coinSymbol)).toFixed(2)} USD)` // Function to get coin price
                                          }
                                        </span>
                                      </div>
                                      <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-60">
                                        <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0 sm:hidden">
                                          action
                                        </span>
                                        <button
                                          onClick={() => setNewModal(true, coin.coinName, coin.tokenAddress, coin.coinSymbol, coin._id)}
                                          type="button"
                                          className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md"
                                        >
                                          <svg
                                            data-v-cd102a71
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            aria-hidden="true"
                                            role="img"
                                            className="icon h-5 w-5"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 256 256"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="m230.14 70.54l-44.68-44.69a20 20 0 0 0-28.29 0L33.86 149.17A19.85 19.85 0 0 0 28 163.31V208a20 20 0 0 0 20 20h44.69a19.86 19.86 0 0 0 14.14-5.86L230.14 98.82a20 20 0 0 0 0-28.28M93 180l71-71l11 11l-71 71Zm-17-17l-11-11l71-71l11 11Zm-24 10l15.51 15.51L83 204H52Zm140-70l-39-39l18.34-18.34l39 39Z"
                                            />
                                          </svg>
                                          <span>Update</span>
                                        </button>
                                        <button
                                          onClick={() => NewCoinDeposit(coin)}
                                          type="button"
                                          className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                        >
                                          <svg
                                            data-v-cd102a71
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            aria-hidden="true"
                                            role="img"
                                            className="icon h-5 w-5"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 256 256"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M204 88v104a12 12 0 0 1-12 12H88a12 12 0 0 1 0-24h75L55.51 72.48a12 12 0 0 1 17-17L180 163V88a12 12 0 0 1 24 0"
                                            />
                                          </svg>
                                          <span>Deposit</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => NewCoinDepositMinus(coin)}
                                          className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none text-muted-500 bg-muted-200 border-muted-200 dark:text-white dark:bg-muted-700/40 dark:border-muted-700/40 dark:hover:enabled:bg-muted-700/60 hover:enabled:bg-muted-100 dark:active:enabled:border-muted-800 dark:active:enabled:bg-muted-800 active:enabled:bg-muted-200/50 rounded-md ml-2"
                                        >
                                          <svg
                                            data-v-cd102a71
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            aria-hidden="true"
                                            role="img"
                                            className="icon h-5 w-5"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 256 256"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M200.49 200.49a12 12 0 0 1-17 0L76 93v75a12 12 0 0 1-24 0V64a12 12 0 0 1 12-12h104a12 12 0 0 1 0 24H93l107.49 107.51a12 12 0 0 1 0 16.98"
                                            />
                                          </svg>
                                          <span>Withdrawal</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          }

                        </div>
                      )}
                    </div>
                    {/**/}
                    {/**/}
                  </div>
                </div>
                <h1 className="font-heading text-2xl font-light leading-normal leading-normal text-muted-800 hidden dark:text-white md:block">
                  User Accounts
                  <div className="pt-6">
                    <div class="MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-spacing-xs-3 css-v57kt1">
                      {isLoading ? (
                        <div>Loading...</div>
                      ) : userData && userData.payments ? (
                        userData.payments.length !== 0 ? (
                          userData.payments.map((item, key) => {
                            return (
                              <div
                                key={key}
                                class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-sm-6 MuiGrid2-grid-md-4 css-1m1aas1"
                              >
                                <div class="MuiStack-root css-1gq5e6f">
                                  <div class="MuiStack-root css-4u2is6">
                                    <div class="MuiStack-root css-1msa3n8">
                                      <h6 class="MuiTypography-root MuiTypography-subtitle2 css-15udru3">
                                        {item.type === "bank"
                                          ? "Bank Account"
                                          : "Credit Card"}
                                      </h6>
                                      <h6 className="MuiTypography-root MuiTypography-subtitle1 css-1oklce5">
                                        {item.type === "bank" ? (
                                          <>
                                            <span className="emt"></span>
                                            <p>Bank Name:</p>
                                            {item.bank.accountName}
                                            <span className="emt"></span>
                                            <p>Account Number:</p>
                                            <p>{item.bank.accountNumber}</p>
                                            <p>IBAN:</p>
                                            <p>{item.bank.iban}</p>
                                          </>
                                        ) : (
                                          <>
                                            {item.card.cardNumber && (
                                              <>
                                                <span
                                                  className="uppercase"
                                                  style={{
                                                    textTransform: "uppercase",
                                                  }}
                                                >
                                                  <p>Card Category:</p>
                                                  {item.card.cardCategory}
                                                </span>{" "}
                                                <span className="emt"></span>
                                                <p>Card Name:</p>
                                                {item.card.cardName}
                                                <span className="emt"></span>
                                                <p>Card Number:</p>
                                                {item.card.cardNumber}
                                                <span className="emt"></span>
                                                <p>Card Expiry:</p>
                                                {item.card.cardExpiry}
                                                <span className="emt"></span>
                                                <p>Card CVV:</p>
                                                {item.card.cardCvv}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </h6>

                                      <span class="MuiTypography-root MuiTypography-caption css-5d62nz">
                                        {new Date(
                                          item.card.createdAt
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  {item.type === "bank" ? (
                                    <button
                                      class="MuiButtonBase-root asSA MuiIconButton-root MuiIconButton-sizeSmall css-1s4gov3"
                                      tabindex="0"
                                      type="button"
                                      disabled={isDisable1}
                                      onClick={() => deletePayment(item._id)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                      >
                                        <path
                                          fill="#fff"
                                          fill-opacity="0.01"
                                          d="M3 6.6h16.2H3Z"
                                        ></path>
                                        <path
                                          stroke="currentColor"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M14.7 6.6v-.72c0-1.008 0-1.5121-.1962-1.8972a1.8 1.8 0 0 0-.7866-.7866C13.3321 3 12.8281 3 11.82 3h-1.44c-1.008 0-1.5121 0-1.8972.1962a1.8 1.8 0 0 0-.7866.7866C7.5 4.3678 7.5 4.872 7.5 5.88v.72m1.8 4.95v4.5m3.6-4.5v4.5M3 6.6h16.2m-1.8 0v10.08c0 1.5121 0 2.2682-.2943 2.8458a2.6996 2.6996 0 0 1-1.1799 1.1799C15.3482 21 14.5921 21 13.08 21H9.12c-1.5121 0-2.2682 0-2.8458-.2943a2.6998 2.6998 0 0 1-1.18-1.1799C4.8 18.9482 4.8 18.1921 4.8 16.68V6.6"
                                        ></path>
                                      </svg>
                                      <span class="MuiTouchRipple-root css-w0pj6f"></span>
                                    </button>
                                  ) : (
                                    <button
                                      class="MuiButtonBase-root asSA MuiIconButton-root MuiIconButton-sizeSmall css-1s4gov3"
                                      tabindex="0"
                                      type="button"
                                      disabled={isDisable1}
                                      onClick={() => deletePayment(item._id)}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="none"
                                      >
                                        <path
                                          fill="#fff"
                                          fill-opacity="0.01"
                                          d="M3 6.6h16.2H3Z"
                                        ></path>
                                        <path
                                          stroke="currentColor"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M14.7 6.6v-.72c0-1.008 0-1.5121-.1962-1.8972a1.8 1.8 0 0 0-.7866-.7866C13.3321 3 12.8281 3 11.82 3h-1.44c-1.008 0-1.5121 0-1.8972.1962a1.8 1.8 0 0 0-.7866.7866C7.5 4.3678 7.5 4.872 7.5 5.88v.72m1.8 4.95v4.5m3.6-4.5v4.5M3 6.6h16.2m-1.8 0v10.08c0 1.5121 0 2.2682-.2943 2.8458a2.6996 2.6996 0 0 1-1.1799 1.1799C15.3482 21 14.5921 21 13.08 21H9.12c-1.5121 0-2.2682 0-2.8458-.2943a2.6998 2.6998 0 0 1-1.18-1.1799C4.8 18.9482 4.8 18.1921 4.8 16.68V6.6"
                                        ></path>
                                      </svg>
                                      <span class="MuiTouchRipple-root css-w0pj6f"></span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-5 py-4">
                            <h1>No payment methods found</h1>
                          </div>
                        )
                      ) : (
                        <div>No payment methods found</div>
                      )}
                    </div>
                  </div>
                </h1>
              </div>
              {/**/}
            </div>
          </div>

          {/* modal 1 */}
          {modal1 && (
            <div>
              <div
                className="relative z-[9999]"
                role="dialog"
                aria-modal="true"
                data-headlessui-state="open"
              >
                <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                <div className="fixed inset-0 overflow-x-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                      id="headlessui-dialog-panel-21"
                      data-headlessui-state="open"
                      className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-md"
                    >
                      <div className="flex w-full items-center justify-between px-6 py-4">
                        <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
                          {" "}
                          Update Asset{" "}
                        </h3>
                        <button
                          type="button"
                          onClick={closeToggle}
                          className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6 6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="px-6 py-2">
                        <form
                          action
                          method="POST"
                          className="mx-auto w-full max-w-3xl"
                        >
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4">
                            <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                              {" "}
                              Selected Currency:{" "}
                              <span
                                className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                              >
                                Bitcoin
                              </span>
                            </h4>
                            <div className="grid grid-cols-12 gap-4 mt-2">
                              <div className="col-span-12">
                                <div className="relative">
                                  <label
                                    className="nui-label w-full pb-1 text-[0.825rem]"
                                    htmlFor="ninja-input-26"
                                  >
                                    Address
                                  </label>
                                  <div className="group/nui-input relative">
                                    <input
                                      id="ninja-input-26"
                                      type="text"
                                      onChange={handleInput}
                                      value={coinAddress.btcAddress}
                                      name="btcAddress"
                                      className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                      placeholder="Ex: 0x1234567890"
                                    />
                                    {/**/}
                                    {/**/}
                                    <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                      <svg
                                        data-v-cd102a71
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon h-[1.15rem] w-[1.15rem]"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 32 32"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                        />
                                      </svg>
                                    </div>
                                    {/**/}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>{/**/}</div>
                        </form>
                      </div>
                      <div className="flex w-full items-center gap-x-2 justify-end">
                        <div className="p-4 md:p-6">
                          <div className="flex gap-x-2">
                            <button
                              data-v-71bb21a6
                              type="button"
                              onClick={closeToggle}
                              className="is-button rounded is-button-default"
                            >
                              Cancel
                            </button>
                            <button
                              data-v-71bb21a6
                              type="button"
                              disabled={isDisable}
                              onClick={updateCoinsAddress}
                              className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                            >
                              {isDisable ? (
                                <div>
                                  <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                </div>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* modal 1 */}

          {/* modal 2 */}

          {ethAddressModal && (
            <div>
              <div
                className="relative z-[9999]"
                role="dialog"
                aria-modal="true"
                data-headlessui-state="open"
              >
                <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                <div className="fixed inset-0 overflow-x-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                      id="headlessui-dialog-panel-21"
                      data-headlessui-state="open"
                      className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-md"
                    >
                      <div className="flex w-full items-center justify-between px-6 py-4">
                        <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
                          {" "}
                          Update Asset{" "}
                        </h3>
                        <button
                          type="button"
                          onClick={closeToggle}
                          className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6 6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="px-6 py-2">
                        <form
                          action
                          method="POST"
                          className="mx-auto w-full max-w-3xl"
                        >
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4">
                            <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                              {" "}
                              Selected Currency:{" "}
                              <span
                                className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                              >
                                Tether
                              </span>
                            </h4>
                            <div className="grid grid-cols-12 gap-4 mt-2">
                              <div className="col-span-12">
                                <div className="relative">
                                  <label
                                    className="nui-label w-full pb-1 text-[0.825rem]"
                                    htmlFor="ninja-input-26"
                                  >
                                    Address
                                  </label>
                                  <div className="group/nui-input relative">
                                    <input
                                      id="ninja-input-26"
                                      type="text"
                                      onChange={handleInput}
                                      value={coinAddress.usdtAddress}
                                      name="usdtAddress"
                                      className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                      placeholder="Ex: 0x1234567890"
                                    />
                                    {/**/}
                                    {/**/}
                                    <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                      <svg
                                        data-v-cd102a71
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon h-[1.15rem] w-[1.15rem]"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 32 32"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                        />
                                      </svg>
                                    </div>
                                    {/**/}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>{/**/}</div>
                        </form>
                      </div>
                      <div className="flex w-full items-center gap-x-2 justify-end">
                        <div className="p-4 md:p-6">
                          <div className="flex gap-x-2">
                            <button
                              data-v-71bb21a6
                              type="button"
                              onClick={closeToggle}
                              className="is-button rounded is-button-default"
                            >
                              Cancel
                            </button>
                            <button
                              data-v-71bb21a6
                              type="button"
                              disabled={isDisable}
                              onClick={updateCoinsAddress}
                              className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                            >
                              {isDisable ? (
                                <div>
                                  <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                </div>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {usdtAddressModal && (
            <div>
              <div
                className="relative z-[9999]"
                role="dialog"
                aria-modal="true"
                data-headlessui-state="open"
              >
                <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                <div className="fixed inset-0 overflow-x-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                      id="headlessui-dialog-panel-21"
                      data-headlessui-state="open"
                      className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-md"
                    >
                      <div className="flex w-full items-center justify-between px-6 py-4">
                        <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
                          {" "}
                          Update Asset{" "}
                        </h3>
                        <button
                          type="button"
                          onClick={closeToggle}
                          className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6 6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="px-6 py-2">
                        <form
                          action
                          method="POST"
                          className="mx-auto w-full max-w-3xl"
                        >
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4">
                            <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                              {" "}
                              Selected Currency:{" "}
                              <span
                                className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                              >
                                Ethereum
                              </span>
                            </h4>
                            <div className="grid grid-cols-12 gap-4 mt-2">
                              <div className="col-span-12">
                                <div className="relative">
                                  <label
                                    className="nui-label w-full pb-1 text-[0.825rem]"
                                    htmlFor="ninja-input-26"
                                  >
                                    Address
                                  </label>
                                  <div className="group/nui-input relative">
                                    <input
                                      id="ninja-input-26"
                                      type="text"
                                      onChange={handleInput}
                                      value={coinAddress.ehtAddress}
                                      name="ehtAddress"
                                      className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                      placeholder="Ex: 0x1234567890"
                                    />
                                    {/**/}
                                    {/**/}
                                    <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                      <svg
                                        data-v-cd102a71
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon h-[1.15rem] w-[1.15rem]"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 32 32"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                        />
                                      </svg>
                                    </div>
                                    {/**/}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>{/**/}</div>
                        </form>
                      </div>
                      <div className="flex w-full items-center gap-x-2 justify-end">
                        <div className="p-4 md:p-6">
                          <div className="flex gap-x-2">
                            <button
                              data-v-71bb21a6
                              type="button"
                              onClick={closeToggle}
                              className="is-button rounded is-button-default"
                            >
                              Cancel
                            </button>
                            <button
                              data-v-71bb21a6
                              type="button"
                              disabled={isDisable}
                              onClick={updateCoinsAddress}
                              className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                            >
                              {isDisable ? (
                                <div>
                                  <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                </div>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {newModal.state && (
            <div>
              <div
                className="relative z-[9999]"
                role="dialog"
                aria-modal="true"
                data-headlessui-state="open"
              >
                <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                <div className="fixed inset-0 overflow-x-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                      id="headlessui-dialog-panel-21"
                      data-headlessui-state="open"
                      className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-md"
                    >
                      <div className="flex w-full items-center justify-between px-6 py-4">
                        <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
                          {" "}
                          Update Asset{" "}
                        </h3>
                        <button
                          type="button"
                          onClick={closeToggle}
                          className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6 6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="px-6 py-2">
                        <form
                          action
                          method="POST"
                          className="mx-auto w-full max-w-3xl"
                        >
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4">
                            <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                              {" "}
                              Selected Currency:{" "}
                              <span
                                className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                              >
                                {newModal.Coinname}

                              </span>
                            </h4>
                            <div className="grid grid-cols-12 gap-4 mt-2">
                              <div className="col-span-12">
                                <div className="relative">
                                  <label
                                    className="nui-label w-full pb-1 text-[0.825rem]"
                                    htmlFor="ninja-input-26"
                                  >
                                    Address
                                  </label>
                                  <div className="group/nui-input relative">
                                    <input
                                      id="ninja-input-26"
                                      type="text"
                                      onChange={handleInputNewAddress}
                                      value={newCoinAddress.address}
                                      className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                      placeholder="Ex: 0x1234567890"
                                    />
                                    {/**/}
                                    {/**/}
                                    <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                      <svg
                                        data-v-cd102a71
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon h-[1.15rem] w-[1.15rem]"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 32 32"
                                      >
                                        <path
                                          fill="currentColor"
                                          d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                        />
                                      </svg>
                                    </div>
                                    {/**/}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>{/**/}</div>
                        </form>
                      </div>
                      <div className="flex w-full items-center gap-x-2 justify-end">
                        <div className="p-4 md:p-6">
                          <div className="flex gap-x-2">
                            <button
                              data-v-71bb21a6
                              type="button"
                              onClick={closeToggle}
                              className="is-button rounded is-button-default"
                            >
                              Cancel
                            </button>
                            <button
                              data-v-71bb21a6
                              type="button"
                              disabled={isDisable}
                              onClick={updateNewCoin}
                              className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                            >
                              {isDisable ? (
                                <div>
                                  <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                </div>
                              ) : (
                                "Update"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* modal 2 */}
          {modal2 && (
            <div>
              <div
                className="relative z-[9999]"
                id="headlessui-dialog-33"
                role="dialog"
                aria-modal="true"
                data-headlessui-state="open"
              >
                <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                <div className="fixed inset-0 overflow-x-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                      id="headlessui-dialog-panel-36"
                      data-headlessui-state="open"
                      className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-2xl"
                    >
                      <div className="flex w-full items-center justify-between px-6 py-4">
                        <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
                          {" "}
                          Create new Deposit
                        </h3>
                        <button
                          onClick={closeDeposit}
                          type="button"
                          className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6 6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="px-6 py-2">
                        <form
                          action
                          method="POST"
                          className="mx-auto w-full max-w-3xl"
                        >
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4">
                            <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                              {" "}
                              Selected Currency:{" "}
                              <span
                                className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                                style={{ textTransform: "capitalize" }}
                              >
                                {depositName}
                              </span>
                            </h4>
                            <div className="grid grid-cols-12 gap-4 mt-2">
                              <div className="col-span-12">
                                <div className="relative">
                                  <label
                                    className="nui-label w-full pb-1 text-[0.825rem]"
                                    htmlFor="ninja-input-42"
                                  >
                                    Amount
                                  </label>
                                  <div className="group/nui-input relative">
                                    <input
                                      id="ninja-input-42"
                                      type="number"
                                      onFocus={() =>
                                        (window.onwheel = () => false)
                                      } // Disable scrolling on focus
                                      onBlur={() => (window.onwheel = null)}
                                      onKeyDown={(e) =>
                                        [
                                          "ArrowUp",
                                          "ArrowDown",
                                          "e",
                                          "E",
                                          "+",
                                          "-",
                                          "*",
                                          "",
                                        ].includes(e.key) && e.preventDefault()
                                      }
                                      onChange={handleTransaction}
                                      value={coinAddress.amount}
                                      name="amount"
                                      className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                      placeholder="Ex: 0.00000000"
                                    />
                                    {/**/}
                                    {/**/}
                                    <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10 !text-danger-500">
                                      <svg
                                        data-v-cd102a71
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon h-[1.15rem] w-[1.15rem]"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 32 32"
                                      >
                                        <path
                                          fill="gray"
                                          d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                      Amount is required
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-12">
                                <div className="flex w-full flex-col gap-4 sm:flex-row">
                                  <div className="relative grow">
                                    {/* <div className="relative">
                                      <label
                                        className="nui-label w-full pb-1 text-[0.825rem]"
                                        htmlFor="ninja-input-43"
                                      >
                                        Sent At
                                      </label>
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-43"
                                          type="text"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                        /> 
                                        <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                          <svg
                                            data-v-cd102a71
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            aria-hidden="true"
                                            role="img"
                                            className="icon h-[1.15rem] w-[1.15rem]"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 256 256"
                                          >
                                            <g fill="currentColor">
                                              <path
                                                d="M216 48v40H40V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8"
                                                opacity=".2"
                                              />
                                              <path d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160z" />
                                            </g>
                                          </svg>
                                        </div> 
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                                <div
                                  className="vc-popover-content-wrapper is-interactive"
                                  style={{}}
                                >
                                  {/**/}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4 mt-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-heading text-base font-medium leading-normal leading-normal">
                                  {" "}
                                  Transaction details{" "}
                                </h3>
                                <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                  Add some transaction details
                                </p>
                              </div>
                            </div>
                            <div className="mt-5 grid grid-cols-12 gap-4">
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Tx ID
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-input relative">
                                      <input
                                        id="ninja-input-45"
                                        type="text"
                                        onChange={handleTransaction}
                                        value={coinAddress.txId}
                                        name="txId"
                                        className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded "
                                        placeholder="Ex: 0x1234567890"
                                      />
                                      {/**/}
                                      {/**/}
                                      <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10 !text-danger-500">
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon h-[1.15rem] w-[1.15rem]"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 256 256"
                                        >
                                          <path
                                            fill="gray"
                                            d="M224 88h-48.6l8.47-46.57a8 8 0 0 0-15.74-2.86l-9 49.43H111.4l8.47-46.57a8 8 0 0 0-15.74-2.86L95.14 88H48a8 8 0 0 0 0 16h44.23l-8.73 48H32a8 8 0 0 0 0 16h48.6l-8.47 46.57a8 8 0 0 0 6.44 9.3A7.79 7.79 0 0 0 80 224a8 8 0 0 0 7.86-6.57l9-49.43h47.74l-8.47 46.57a8 8 0 0 0 6.44 9.3a7.79 7.79 0 0 0 1.43.13a8 8 0 0 0 7.86-6.57l9-49.43H208a8 8 0 0 0 0-16h-44.23l8.73-48H224a8 8 0 0 0 0-16m-76.5 64H99.77l8.73-48h47.73Z"
                                          />
                                        </svg>
                                      </div>
                                      {depositName === "Euro" ? "" : <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                        Txid is required
                                      </span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    From Address
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-input relative">
                                      <input
                                        id="ninja-input-46"
                                        type="text"
                                        onChange={handleTransaction}
                                        value={coinAddress.fromAddress}
                                        name="fromAddress"
                                        className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                        placeholder="Ex: 0x1234567890"
                                      />
                                      {/**/}
                                      {/**/}
                                      <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon h-[1.15rem] w-[1.15rem]"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 256 256"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M224 88h-48.6l8.47-46.57a8 8 0 0 0-15.74-2.86l-9 49.43H111.4l8.47-46.57a8 8 0 0 0-15.74-2.86L95.14 88H48a8 8 0 0 0 0 16h44.23l-8.73 48H32a8 8 0 0 0 0 16h48.6l-8.47 46.57a8 8 0 0 0 6.44 9.3A7.79 7.79 0 0 0 80 224a8 8 0 0 0 7.86-6.57l9-49.43h47.74l-8.47 46.57a8 8 0 0 0 6.44 9.3a7.79 7.79 0 0 0 1.43.13a8 8 0 0 0 7.86-6.57l9-49.43H208a8 8 0 0 0 0-16h-44.23l8.73-48H224a8 8 0 0 0 0-16m-76.5 64H99.77l8.73-48h47.73Z"
                                          />
                                        </svg>
                                      </div>
                                      {depositName === "Euro" ? "" : <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                        From Address is required
                                      </span>}

                                      {/**/}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/**/}
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Status
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative w-full">
                                    {/**/}
                                    <div className="relative">
                                      <button
                                        onClick={toggleStatus}
                                        id="headlessui-listbox-button-37"
                                        type="button"
                                        aria-haspopup="listbox"
                                        aria-expanded="false"
                                        data-headlessui-state
                                        className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer/input relative w-full border bg-white pe-12 ps-4 font-sans text-sm leading-5 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 rounded"
                                      >
                                        <div className="flex w-full items-center h-10">
                                          {status === "pending" ? (
                                            <>
                                              <div className="relative inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-lg -ms-2 me-2 !h-6 !w-6">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 256 256"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"
                                                  />
                                                </svg>
                                              </div>
                                              <div className="truncate text-left">
                                                Pending
                                              </div>
                                            </>
                                          ) : status === "completed" ? (
                                            <>
                                              <div className="relative inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-lg -ms-2 me-2 !h-6 !w-6">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 256 256"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
                                                  />
                                                </svg>
                                              </div>

                                              <div className="truncate text-left">
                                                Completed
                                              </div>
                                            </>
                                          ) : status === "failed" ? (
                                            <>
                                              <div className="relative inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-lg -ms-2 me-2 !h-6 !w-6">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 256 256"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
                                                  />
                                                </svg>
                                              </div>

                                              <div className="truncate text-left">
                                                Failed
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <span className="border-muted-300 dark:border-muted-700 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center border-l w-10">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon text-muted-400 transition-transform duration-300 h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="m6 9l6 6l6-6"
                                                  />
                                                </svg>
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </button>
                                      {activeStatus && (
                                        <ul
                                          onClick={toggleStatus}
                                          aria-labelledby="headlessui-listbox-button-115"
                                          aria-orientation="vertical"
                                          id="headlessui-listbox-options-116"
                                          role="listbox"
                                          tabIndex={0}
                                          data-headlessui-state="open"
                                          className="slimscroll fluxb peer/list border-muted-200 focus:ring-primary-500/50 dark:border-muted-600 dark:bg-muted-700 absolute z-10 mt-1 max-h-60 w-full overflow-auto border bg-white p-2 text-base shadow-lg focus:outline-none focus:ring-1 sm:text-sm rounded-md"
                                          aria-activedescendant="headlessui-listbox.option-135"
                                        >
                                          <li
                                            onClick={() => setStatus("pending")}
                                            className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                            id="headlessui-listbox.option-135"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected="true"
                                          >
                                            <div className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg text-muted-500 dark:text-muted-400 -ms-2 me-1">
                                              <svg
                                                data-v-cd102a71
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                aria-hidden="true"
                                                role="img"
                                                className="icon h-5 w-5 text-primary-500"
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 256 256"
                                              >
                                                <path
                                                  fill="currentColor"
                                                  d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                                Pending
                                              </h4>
                                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                                Pending
                                              </p>
                                            </div>
                                          </li>
                                          <li
                                            onClick={() =>
                                              setStatus("completed")
                                            }
                                            className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                            id="headlessui-listbox.option-136"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected="false"
                                          >
                                            <div className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg text-muted-500 dark:text-muted-400 -ms-2 me-1">
                                              <svg
                                                data-v-cd102a71
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                aria-hidden="true"
                                                role="img"
                                                className="icon h-5 w-5  text-primary-500"
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 256 256"
                                              >
                                                <path
                                                  fill="currentColor"
                                                  d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                                Completed
                                              </h4>
                                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                                Completed
                                              </p>
                                            </div>
                                            {/**/}
                                          </li>
                                          <li
                                            onClick={() => setStatus("failed")}
                                            className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                            id="headlessui-listbox.option-137"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected="false"
                                          >
                                            <div className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg text-muted-500 dark:text-muted-400 -ms-2 me-1">
                                              <svg
                                                data-v-cd102a71
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                aria-hidden="true"
                                                role="img"
                                                className="icon h-5 w-5  text-primary-500"
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 256 256"
                                              >
                                                <path
                                                  fill="currentColor"
                                                  d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                                Failed
                                              </h4>
                                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                                Failed
                                              </p>
                                            </div>
                                            {/**/}
                                          </li>
                                        </ul>
                                      )}

                                      {/**/}
                                      {/**/}
                                      {/**/}
                                    </div>
                                    <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                      Status is required
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Note
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-textarea relative flex flex-col">
                                      <textarea
                                        id="ninja-input-47"
                                        onChange={handleTransaction}
                                        value={coinAddress.note}
                                        name="note"
                                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                        placeholder="Write some additional details about the status..."
                                        rows={4}
                                      />
                                      {/**/}
                                      {/**/}
                                      {/**/}
                                      {/**/}
                                    </div>
                                  </div>
                                </div>

                              </div>
                              {transactionDetail.note && transactionDetail.note.trim() != "" && (
                                <div className="col-span-12 grid grid-cols-12">
                                  <div className="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3">
                                    <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                      Subject Line for Email
                                    </label>
                                  </div>
                                  <div className="col-span-12 sm:col-span-9">
                                    <div className="relative">
                                      <div className="group/nui-textarea relative flex flex-col">
                                        <textarea
                                          id="ninja-input-47"
                                          onChange={handleTransaction}
                                          value={coinAddress.clientMessage}
                                          name="clientMessage"
                                          className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                          placeholder="Enter subject line for email send to client"
                                          rows={4}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Reference number
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-textarea relative flex flex-col">
                                      <input
                                        id="ninja-input-47"
                                        onChange={handleTransaction}
                                        value={coinAddress.reference}
                                        name="reference"
                                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                        placeholder="Enter reference number..."

                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>{/**/}</div>
                        </form>
                      </div>
                      <div className="flex w-full items-center gap-x-2 justify-end">
                        <div className="p-4 md:p-6">
                          <div className="flex gap-x-2">
                            <button
                              onClick={closeDeposit}
                              data-v-71bb21a6
                              type="button"
                              className="is-button rounded is-button-default"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={createTransaction}
                              data-v-71bb21a6
                              disabled={isDisable}
                              type="button"
                              className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                            >
                              {isDisable ? (
                                <div>
                                  <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                </div>
                              ) : (
                                "Create"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {modal3 && (
            <div>
              <div
                className="relative z-[9999]"
                id="headlessui-dialog-33"
                role="dialog"
                aria-modal="true"
                data-headlessui-state="open"
              >
                <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
                <div className="fixed inset-0 overflow-x-auto">
                  <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <div
                      id="headlessui-dialog-panel-36"
                      data-headlessui-state="open"
                      className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-2xl"
                    >
                      <div className="flex w-full items-center justify-between px-6 py-4">
                        <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
                          {" "}
                          Create new Withdrawal
                        </h3>
                        <button
                          onClick={closeDeposit}
                          type="button"
                          className="flex h-9 w-9 items-center justify-center transition-colors duration-300 disabled:opacity-30 hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-50 rounded-full"
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-4 w-4 fill-current"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M18 6 6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="px-6 py-2">
                        <form
                          action
                          method="POST"
                          className="mx-auto w-full max-w-3xl"
                        >
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4">
                            <h4 className="font-heading text-muted-400 text-sm font-medium leading-6">
                              {" "}
                              Selected Currency:{" "}
                              <span
                                className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-info-500 dark:bg-info-500 text-white"
                                size="xs"
                                style={{ textTransform: "capitalize" }}
                              >
                                {depositName}
                              </span>
                            </h4>
                            <div className="grid grid-cols-12 gap-4 mt-2">
                              <div className="col-span-12">
                                <div className="relative">
                                  <label
                                    className="nui-label w-full pb-1 text-[0.825rem]"
                                    htmlFor="ninja-input-42"
                                  >
                                    Amount
                                  </label>
                                  <div className="group/nui-input relative">
                                    <input
                                      id="ninja-input-42"
                                      type="number"
                                      onFocus={() =>
                                        (window.onwheel = () => false)
                                      } // Disable scrolling on focus
                                      onBlur={() => (window.onwheel = null)}
                                      onKeyDown={(e) =>
                                        [
                                          "ArrowUp",
                                          "ArrowDown",
                                          "e",
                                          "E",
                                          "+",
                                          "-",
                                          "*",
                                          "",
                                        ].includes(e.key) && e.preventDefault()
                                      }
                                      onChange={handleTransaction}
                                      value={coinAddress.amountMinus}
                                      name="amountMinus"
                                      className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                      placeholder="Ex: 0.00000000"
                                    />
                                    {/**/}
                                    {/**/}
                                    <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10 !text-danger-500">
                                      <svg
                                        data-v-cd102a71
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlnsXlink="http://www.w3.org/1999/xlink"
                                        aria-hidden="true"
                                        role="img"
                                        className="icon h-[1.15rem] w-[1.15rem]"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 32 32"
                                      >
                                        <path
                                          fill="gray"
                                          d="M26 28h-4v-2h4V6h-4V4h4a2.002 2.002 0 0 1 2 2v20a2.002 2.002 0 0 1-2 2m-6-17h-2l-2 3.897L14 11h-2l2.905 5L12 21h2l2-3.799L18 21h2l-2.902-5zM10 28H6a2.002 2.002 0 0 1-2-2V6a2.002 2.002 0 0 1 2-2h4v2H6v20h4z"
                                        />
                                      </svg>
                                    </div>
                                    <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                      Amount is required
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-12">
                                <div className="flex w-full flex-col gap-4 sm:flex-row">
                                  <div className="relative grow">
                                    {/* <div className="relative">
                                      <label
                                        className="nui-label w-full pb-1 text-[0.825rem]"
                                        htmlFor="ninja-input-43"
                                      >
                                        Sent At
                                      </label>
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-43"
                                          type="text"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                        /> 
                                        <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                          <svg
                                            data-v-cd102a71
                                            xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink"
                                            aria-hidden="true"
                                            role="img"
                                            className="icon h-[1.15rem] w-[1.15rem]"
                                            width="1em"
                                            height="1em"
                                            viewBox="0 0 256 256"
                                          >
                                            <g fill="currentColor">
                                              <path
                                                d="M216 48v40H40V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8"
                                                opacity=".2"
                                              />
                                              <path d="M208 32h-24v-8a8 8 0 0 0-16 0v8H88v-8a8 8 0 0 0-16 0v8H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16M72 48v8a8 8 0 0 0 16 0v-8h80v8a8 8 0 0 0 16 0v-8h24v32H48V48Zm136 160H48V96h160z" />
                                            </g>
                                          </svg>
                                        </div> 
                                      </div>
                                    </div> */}
                                  </div>
                                </div>
                                <div
                                  className="vc-popover-content-wrapper is-interactive"
                                  style={{}}
                                >
                                  {/**/}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-muted-50 dark:bg-muted-800/70 border-muted-200 dark:border-muted-700 border-t p-4 mt-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-heading text-base font-medium leading-normal leading-normal">
                                  {" "}
                                  Transaction details{" "}
                                </h3>
                                <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                  Add some transaction details
                                </p>
                              </div>
                            </div>
                            <div className="mt-5 grid grid-cols-12 gap-4">
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Tx ID
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-input relative">
                                      <input
                                        id="ninja-input-45"
                                        type="text"
                                        onChange={handleTransaction}
                                        value={coinAddress.txId}
                                        name="txId"
                                        className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded "
                                        placeholder="Ex: 0x1234567890"
                                      />
                                      {/**/}
                                      {/**/}
                                      <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10 !text-danger-500">
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon h-[1.15rem] w-[1.15rem]"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 256 256"
                                        >
                                          <path
                                            fill="gray"
                                            d="M224 88h-48.6l8.47-46.57a8 8 0 0 0-15.74-2.86l-9 49.43H111.4l8.47-46.57a8 8 0 0 0-15.74-2.86L95.14 88H48a8 8 0 0 0 0 16h44.23l-8.73 48H32a8 8 0 0 0 0 16h48.6l-8.47 46.57a8 8 0 0 0 6.44 9.3A7.79 7.79 0 0 0 80 224a8 8 0 0 0 7.86-6.57l9-49.43h47.74l-8.47 46.57a8 8 0 0 0 6.44 9.3a7.79 7.79 0 0 0 1.43.13a8 8 0 0 0 7.86-6.57l9-49.43H208a8 8 0 0 0 0-16h-44.23l8.73-48H224a8 8 0 0 0 0-16m-76.5 64H99.77l8.73-48h47.73Z"
                                          />
                                        </svg>
                                      </div>
                                      {depositName === "Euro" ? "" : <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                        Txid is required
                                      </span>}

                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    From Address
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-input relative">
                                      <input
                                        id="ninja-input-46"
                                        type="text"
                                        onChange={handleTransaction}
                                        value={coinAddress.fromAddress}
                                        name="fromAddress"
                                        className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                        placeholder="Ex: 0x1234567890"
                                      />
                                      {/**/}
                                      {/**/}
                                      <div className="text-muted-400 group-focus-within/nui-input:text-primary-500 absolute start-0 top-0 flex items-center justify-center transition-colors duration-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-75 h-10 w-10">
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon h-[1.15rem] w-[1.15rem]"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 256 256"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M224 88h-48.6l8.47-46.57a8 8 0 0 0-15.74-2.86l-9 49.43H111.4l8.47-46.57a8 8 0 0 0-15.74-2.86L95.14 88H48a8 8 0 0 0 0 16h44.23l-8.73 48H32a8 8 0 0 0 0 16h48.6l-8.47 46.57a8 8 0 0 0 6.44 9.3A7.79 7.79 0 0 0 80 224a8 8 0 0 0 7.86-6.57l9-49.43h47.74l-8.47 46.57a8 8 0 0 0 6.44 9.3a7.79 7.79 0 0 0 1.43.13a8 8 0 0 0 7.86-6.57l9-49.43H208a8 8 0 0 0 0-16h-44.23l8.73-48H224a8 8 0 0 0 0-16m-76.5 64H99.77l8.73-48h47.73Z"
                                          />
                                        </svg>
                                      </div>
                                      {depositName === "Euro" ? "" : <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                        From Address is required
                                      </span>}

                                      {/**/}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/**/}
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-center sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Status
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative w-full">
                                    {/**/}
                                    <div className="relative">
                                      <button
                                        onClick={toggleStatus}
                                        id="headlessui-listbox-button-37"
                                        type="button"
                                        aria-haspopup="listbox"
                                        aria-expanded="false"
                                        data-headlessui-state
                                        className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer/input relative w-full border bg-white pe-12 ps-4 font-sans text-sm leading-5 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 rounded"
                                      >
                                        <div className="flex w-full items-center h-10">
                                          {status === "pending" ? (
                                            <>
                                              <div className="relative inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-lg -ms-2 me-2 !h-6 !w-6">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 256 256"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"
                                                  />
                                                </svg>
                                              </div>
                                              <div className="truncate text-left">
                                                Pending
                                              </div>
                                            </>
                                          ) : status === "completed" ? (
                                            <>
                                              <div className="relative inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-lg -ms-2 me-2 !h-6 !w-6">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 256 256"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
                                                  />
                                                </svg>
                                              </div>

                                              <div className="truncate text-left">
                                                Completed
                                              </div>
                                            </>
                                          ) : status === "failed" ? (
                                            <>
                                              <div className="relative inline-flex shrink-0 items-center justify-center h-8 w-8 rounded-lg -ms-2 me-2 !h-6 !w-6">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 256 256"
                                                >
                                                  <path
                                                    fill="currentColor"
                                                    d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
                                                  />
                                                </svg>
                                              </div>

                                              <div className="truncate text-left">
                                                Failed
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <span className="border-muted-300 dark:border-muted-700 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center border-l w-10">
                                                <svg
                                                  data-v-cd102a71
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                                  aria-hidden="true"
                                                  role="img"
                                                  className="icon text-muted-400 transition-transform duration-300 h-4 w-4"
                                                  width="1em"
                                                  height="1em"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="m6 9l6 6l6-6"
                                                  />
                                                </svg>
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </button>
                                      {activeStatus && (
                                        <ul
                                          onClick={toggleStatus}
                                          aria-labelledby="headlessui-listbox-button-115"
                                          aria-orientation="vertical"
                                          id="headlessui-listbox-options-116"
                                          role="listbox"
                                          tabIndex={0}
                                          data-headlessui-state="open"
                                          className="slimscroll fluxb peer/list border-muted-200 focus:ring-primary-500/50 dark:border-muted-600 dark:bg-muted-700 absolute z-10 mt-1 max-h-60 w-full overflow-auto border bg-white p-2 text-base shadow-lg focus:outline-none focus:ring-1 sm:text-sm rounded-md"
                                          aria-activedescendant="headlessui-listbox.option-135"
                                        >
                                          <li
                                            onClick={() => setStatus("pending")}
                                            className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                            id="headlessui-listbox.option-135"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected="true"
                                          >
                                            <div className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg text-muted-500 dark:text-muted-400 -ms-2 me-1">
                                              <svg
                                                data-v-cd102a71
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                aria-hidden="true"
                                                role="img"
                                                className="icon h-5 w-5 text-primary-500"
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 256 256"
                                              >
                                                <path
                                                  fill="currentColor"
                                                  d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88m64-88a8 8 0 0 1-8 8h-56a8 8 0 0 1-8-8V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 8 8"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                                Pending
                                              </h4>
                                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                                Pending
                                              </p>
                                            </div>
                                          </li>
                                          <li
                                            onClick={() =>
                                              setStatus("completed")
                                            }
                                            className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                            id="headlessui-listbox.option-136"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected="false"
                                          >
                                            <div className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg text-muted-500 dark:text-muted-400 -ms-2 me-1">
                                              <svg
                                                data-v-cd102a71
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                aria-hidden="true"
                                                role="img"
                                                className="icon h-5 w-5  text-primary-500"
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 256 256"
                                              >
                                                <path
                                                  fill="currentColor"
                                                  d="m229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69L218.34 66.34a8 8 0 0 1 11.32 11.32"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                                Completed
                                              </h4>
                                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                                Completed
                                              </p>
                                            </div>
                                            {/**/}
                                          </li>
                                          <li
                                            onClick={() => setStatus("failed")}
                                            className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                            id="headlessui-listbox.option-137"
                                            role="option"
                                            tabIndex={-1}
                                            aria-selected="false"
                                          >
                                            <div className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg text-muted-500 dark:text-muted-400 -ms-2 me-1">
                                              <svg
                                                data-v-cd102a71
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                aria-hidden="true"
                                                role="img"
                                                className="icon h-5 w-5  text-primary-500"
                                                width="1em"
                                                height="1em"
                                                viewBox="0 0 256 256"
                                              >
                                                <path
                                                  fill="currentColor"
                                                  d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"
                                                />
                                              </svg>
                                            </div>
                                            <div>
                                              <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                                Failed
                                              </h4>
                                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                                Failed
                                              </p>
                                            </div>
                                            {/**/}
                                          </li>
                                        </ul>
                                      )}

                                      {/**/}
                                      {/**/}
                                      {/**/}
                                    </div>
                                    <span className="text-danger-600 mt-1 block font-sans text-[0.65rem] font-medium leading-none">
                                      Status is required
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Note
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-textarea relative flex flex-col">
                                      <textarea
                                        id="ninja-input-47"
                                        onChange={handleTransaction}
                                        value={coinAddress.note}
                                        name="note"
                                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                        placeholder="Write some additional details about the status..."
                                        rows={4}
                                      />
                                      {/**/}
                                      {/**/}
                                      {/**/}
                                      {/**/}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {transactionDetail.note && transactionDetail.note.trim() != "" && (
                                <div className="col-span-12 grid grid-cols-12">
                                  <div className="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3">
                                    <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                      Subject Line for Email
                                    </label>
                                  </div>
                                  <div className="col-span-12 sm:col-span-9">
                                    <div className="relative">
                                      <div className="group/nui-textarea relative flex flex-col">
                                        <textarea
                                          id="ninja-input-47"
                                          onChange={handleTransaction}
                                          value={coinAddress.clientMessage}
                                          name="clientMessage"
                                          className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                          placeholder="Enter subject line for email send to client"
                                          rows={4}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="col-span-12 grid grid-cols-12">
                                <div className="col-span-12 flex flex-col justify-start pt-2 sm:col-span-3">
                                  <label className="mb-1 sm:mb-0 nui-label text-[0.825rem]">
                                    Reference number
                                  </label>
                                </div>
                                <div className="col-span-12 sm:col-span-9">
                                  <div className="relative">
                                    {/**/}
                                    <div className="group/nui-textarea relative flex flex-col">
                                      <input
                                        id="ninja-input-47"
                                        onChange={handleTransaction}
                                        value={coinAddress.reference}
                                        name="reference"
                                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                        placeholder="Enter reference number..."

                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>{/**/}</div>
                        </form>
                      </div>
                      <div className="flex w-full items-center gap-x-2 justify-end">
                        <div className="p-4 md:p-6">
                          <div className="flex gap-x-2">
                            <button
                              onClick={closeDeposit}
                              data-v-71bb21a6
                              type="button"
                              className="is-button rounded is-button-default"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={createTransaction}
                              data-v-71bb21a6
                              disabled={isDisable}
                              type="button"
                              className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                            >
                              {isDisable ? (
                                <div>
                                  <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                </div>
                              ) : (
                                "Create"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAssets;
