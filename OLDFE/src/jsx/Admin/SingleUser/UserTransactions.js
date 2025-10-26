import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import {
  deleteTransactionApi,
  getCoinsApi,
  getEachUserApi,
  signleUsersApi,
  updateTransactionApi,
} from "../../../Api/Service";
import axios from "axios";

import Truncate from "react-truncate-inside/es";
import AdminHeader from "../adminHeader";
const UserTransactions = () => {
  const [modal, setModal] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [UserTransactions, setUserTransactions] = useState([]);
  const [isDisbaled, setisDisbaled] = useState(false);
  const [userDetail, setuserDetail] = useState();
  const [activeType, setactiveType] = useState(false);
  const [singleTransaction, setsingleTransaction] = useState({
    _id: "",
    amount: 0,
    txId: "",
    fromAddress: "",
    note: "",
    reference: "",
    withdraw: "",
    selectedPayment: "",
    createdAt: null,
    trxName: "",
  });
  const [liveBtc, setliveBtc] = useState(null);
  const [activeStatus, setactiveStatus] = useState(false);

  const [Status, setStatus] = useState("");
  const [Type, setType] = useState("");
  let { id } = useParams();

  let authUser = useAuthUser();
  let Navigate = useNavigate();
  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  let toggleStatus = () => {
    if (activeStatus === true) {
      setactiveStatus(false);
    } else {
      setactiveStatus(true);
    }
  };
  let toggleType = () => {
    if (activeType === true) {
      setactiveType(false);
    } else {
      setactiveType(true);
    }
  };
  let handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setsingleTransaction({ ...singleTransaction, [name]: value });
  };

  const getSignleUser = async () => {
    try {
      const signleUser = await signleUsersApi(id);

      if (signleUser.success) {
        setuserDetail(signleUser.signleUser);
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
  const getCoins = async () => {
    try {

      const userCoins = await getCoinsApi(id);

      if (userCoins.success) {
        setUserTransactions(userCoins.getCoin.transactions.reverse());
        let val = 0;
        if (userCoins && userCoins.btcPrice && userCoins.btcPrice.quote && userCoins.btcPrice.quote.USD) {

          val = userCoins.btcPrice.quote.USD.price
        } else {
          val = 96075.25
        }
        setliveBtc(val);
        setisLoading(false);

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
  const [timestamp, setTimestamp] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setTimestamp(value);
  
    // Regex for strict datetime-local format: YYYY-MM-DDTHH:MM
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  
    if (!value) {
      setError("Date is required.");
    } else if (!datetimeRegex.test(value)) {
      setError("Invalid date format. Enter date in correct format");
    } else {
      setError("");
    }
  };
  let toggleModal = async (data) => {
    setStatus(data.status);
    setType(data.type);
    setsingleTransaction({
      selectedPayment: data.selectedPayment,
      withdraw: data.withdraw,
      amount: data.amount,
      txId: data.txId,
      fromAddress: data.fromAddress,
      note: data.note,
      reference: data.reference,
      _id: data._id,
      createdAt: data.createdAt,
      type: data.type,
      trxName: data.trxName,
    });
    setTimestamp(new Date(data.createdAt).toISOString().slice(0, 16))
    setModal(true);
    try {
      let _id = data._id;
      const allTransactions = await getEachUserApi(_id, _id);
      if (allTransactions.success) {
        setuserDetail(allTransactions.signleUser);
        return;
      } else {
        toast.dismiss();
        toast.error(allTransactions.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
    }
  };
  let toggleModalClose = () => {
    setStatus("");
    setsingleTransaction({
      amount: "",
      txId: "",
      fromAddress: "",
      note: "",
      reference: "",
      _id: "",
      createdAt: "",
      trxName: "",
    });
    setuserDetail({});

    setType("");
    setsingleTransaction("");
    setModal(false);
  };
  const approveTransaction = async (txid) => {
    let amount = txid.amount;
    let _id = txid._id;
    let txId = txid.txId;
    let withdraw = txid.withdraw;
    let selectedPayment = txid.selectedPayment;
    let trxName = txid.trxName;
    let note = txid.note;
    let reference = txid.reference;
    let fromAddress = txid.fromAddress;
    let status = Status;
    let type = Type;
    let createdAt = timestamp;
    // Assuming Status is a string, trim it

    // Check if all required fields are non-empty after trimming
    if (
      amount === 0 ||
      amount === "" ||
      _id === "" ||
      txId === "" ||
      trxName === "" ||
      fromAddress === "" ||
      status === "" ||
      type === "" || error !== ""
    ) {
      toast.error("All fields are required.");
      return;
    }

    let body = {
      withdraw,
      selectedPayment,
      amount,
      txId,
      trxName,
      _id,
      note,
      reference,
      type,
      fromAddress,
      status,
      createdAt
    };

    try {
      setisDisbaled(true);
      const userCoins = await updateTransactionApi(_id, body);

      if (userCoins.success) {
        toast.dismiss();
        toast.success(userCoins.msg);
        toggleModalClose();
        getCoins();
        return;
      } else {
        toast.dismiss();
        toast.error(userCoins.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisbaled(false);
    }
  };
  const deleteTransaction = async (txid) => {
    let transactionId = txid._id;

    try {
      // setisDisbaled(true);
      const userCoins = await deleteTransactionApi(id, transactionId);

      if (userCoins.success) {
        toast.dismiss();
        toast.success(userCoins.msg);
        toggleModalClose();
        getCoins();
        return;
      } else {
        toast.dismiss();
        toast.error(userCoins.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisDisbaled(false);
    }
  };
  //
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
    getCoins();

    getSignleUser();
  }, []);
  // Copy
  const [copyStatus, setCopyStatus] = useState(false);

  const handleCopyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyStatus(true);

        // Reset the copy status after 2 seconds
        setTimeout(() => {
          setCopyStatus(false);
        }, 2000);
      })
      .catch(() => {
        setCopyStatus(false);

        // Reset the copy status after 2 seconds
        setTimeout(() => {
          setCopyStatus(false);
        }, 2000);
      });
  };

  // Copy
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
                    <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white duration-300 rounded-md">
                      <div className="flex items-center justify-between p-4">
                        <div>
                          <p
                            className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                            tag="h2"
                          >
                            {" "}
                            Manage Tranasctions{" "}
                          </p>
                        </div>
                      </div>
                      {isLoading && (
                        <div className="  p-5">Loading Transactions...</div>
                      )}
                      {!isLoading && (
                        <div className="pt-6">
                          {UserTransactions.filter(
                            (transaction) => !transaction.isHidden
                          ).map((transaction, index) => (
                            <div key={index}>
                              <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-xl p-3">
                                <div className="flex w-full items-center gap-2">
                                  {transaction.type === "deposit" ? (
                                    <div className="relative inline-flex shrink-0 items-center justify-center outline-none h-12 w-12 nui-mask nui-mask-blob bg-success-100 text-success-400">
                                      <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300">
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M11 20V7.825l-5.6 5.6L4 12l8-8l8 8l-1.4 1.425l-5.6-5.6V20z"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  ) : transaction.type === "withdraw" ? (
                                    <div className="relative inline-flex shrink-0 items-center justify-center outline-none h-12 w-12 nui-mask nui-mask-blob bg-danger-100 text-danger-400">
                                      <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300">
                                        <svg
                                          data-v-cd102a71
                                          xmlns="http://www.w3.org/2000/svg"
                                          xmlnsXlink="http://www.w3.org/1999/xlink"
                                          aria-hidden="true"
                                          role="img"
                                          className="icon"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            fill="currentColor"
                                            d="M11 4v12.175l-5.6-5.6L4 12l8 8l8-8l-1.4-1.425l-5.6 5.6V4z"
                                          />
                                        </svg>
                                      </div>
                                      {/**/}
                                      {/**/}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <div>
                                    <p
                                      className="font-heading capitalize text-sm font-medium leading-normal leading-normal"
                                      tag="h3"
                                    >
                                      {transaction.trxName}{" "}
                                      <span className="text-muted-400 capitalize">
                                        ({transaction.status})
                                      </span>
                                    </p>
                                    <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400 mt-1">
                                      {transaction.amount.toFixed(8)}{" "}
                                      <span className="text-muted-500">
                                        {`($${(() => {
                                          switch (transaction.trxName.toLowerCase()) {
                                            case "bitcoin":
                                              return (transaction.amount * liveBtc).toFixed(2);
                                            case "ethereum":
                                              return (transaction.amount * 2640).toFixed(2);
                                            case "tether":
                                              return transaction.amount.toFixed(2);
                                            case "bnb":
                                              return (transaction.amount * 210.25).toFixed(2); // Example price
                                            case "xrp":
                                              return (transaction.amount * 0.5086).toFixed(2); // Example price
                                            case "dogecoin":
                                              return (transaction.amount * 0.1163).toFixed(2); // Example price
                                            case "solana":
                                              return (transaction.amount * 245.01).toFixed(2); // Example price
                                            case "euro":
                                              return (transaction.amount * 1.08).toFixed(2);
                                            case "toncoin":
                                              return (transaction.amount * 5.76).toFixed(2); // Example price
                                            case "chainlink":
                                              return (transaction.amount * 12.52).toFixed(2); // Example price
                                            case "polkadot":
                                              return (transaction.amount * 4.76).toFixed(2); // Example price
                                            case "near protocol":
                                              return (transaction.amount * 5.59).toFixed(2); // Example price
                                            case "usd coin":
                                              return (transaction.amount * 0.99).toFixed(2); // Example price
                                            case "tron":
                                              return (transaction.amount * 0.1531).toFixed(2); // Example price
                                            default:
                                              return (0).toFixed(2);
                                          }

                                        })()})`}
                                      </span>

                                    </p>
                                    <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400 md:hidden mt-1">
                                      At:{" "}
                                      {new Date(
                                        transaction.createdAt
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div className="ms-auto flex items-center gap-2">
                                    <p
                                      className="font-heading text-sm font-medium leading-normal leading-normal me-2 text-gray-500 hidden md:block"
                                      tag="h3"
                                    >
                                      At:{" "}
                                      {new Date(
                                        transaction.createdAt
                                      ).toLocaleString()}
                                    </p>
                                    <button
                                      onClick={() => toggleModal(transaction)}
                                      type="button"
                                      className="disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-none false false text-muted-700 bg-white border border-muted-300 dark:text-white dark:bg-muted-700 dark:hover:bg-muted-600 dark:border-muted-600 hover:bg-muted-50 rounded-md h-8 w-8 p-1 nui-focus relative inline-flex items-center justify-center space-x-1 font-sans text-sm font-normal leading-5 no-underline outline-none transition-all duration-300"
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
                                        viewBox="0 0 24 24"
                                      >
                                        <g
                                          fill="none"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                        >
                                          <path d="M1 12s4-8 11-8s11 8 11 8s-4 8-11 8s-11-8-11-8" />
                                          <circle cx={12} cy={12} r={3} />
                                        </g>
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {/**/}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/**/}
            </div>
          </div>

          <div>
            {/**/}
            <div className="bg-muted-800/60 fixed start-0 top-0 z-[99] h-full w-full cursor-pointer transition-opacity duration-300 opacity-0 pointer-events-none"></div>
          </div>
          <div className="after:bg-primary-600 after:shadow-primary-500/50 dark:after:shadow-muted-800/10 fixed right-[1em] top-[0.6em] z-[90] transition-transform duration-300 after:absolute after:right-0 after:top-0 after:block after:h-12 after:w-12 after:rounded-full after:shadow-lg after:transition-transform after:duration-300 after:content-[''] -translate-y-24">
            <button
              type="button"
              className="bg-primary-500 shadow-primary-500/50 dark:shadow-muted-800/10 relative z-30 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg"
            >
              <span className="relative block h-3 w-3 transition-all duration-300 -top-0.5">
                <span className="bg-muted-50 absolute block h-0.5 w-full transition-all duration-300 top-0.5" />
                <span className="bg-muted-50 absolute top-1/2 block h-0.5 w-full transition-all duration-300" />
                <span className="bg-muted-50 absolute block h-0.5 w-full transition-all duration-300 bottom-0" />
              </span>
            </button>
            <div>
              <div className="absolute right-[0.2em] top-[0.2em] z-20 flex items-center justify-center transition-all duration-300 translate-x-0 translate-y-0">
                <label className="nui-focus relative block h-9 w-9 shrink-0 overflow-hidden rounded-full transition-all duration-300 focus-visible:outline-2 ring-offset-muted-500 dark:ring-offset-muted-400 ms-auto">
                  <input
                    type="checkbox"
                    className="absolute start-0 top-0 z-[2] h-full w-full cursor-pointer opacity-0"
                  />
                  <span className="relative block h-9 w-9 rounded-full bg-primary-700">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute start-1/2 top-1/2 block h-5 w-5 text-yellow-400 transition-all duration-300 -translate-y-1/2 translate-x-[-50%] opacity-100 rtl:translate-x-[50%]"
                    >
                      <g
                        fill="currentColor"
                        stroke="currentColor"
                        className="stroke-2"
                      >
                        <circle cx={12} cy={12} r={5} />
                        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                      </g>
                    </svg>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="pointer-events-none absolute start-1/2 top-1/2 block h-5 w-5 text-yellow-400 transition-all duration-300 translate-x-[-45%] translate-y-[-150%] opacity-0 rtl:translate-x-[45%]"
                    >
                      <path
                        fill="currentColor"
                        stroke="currentColor"
                        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                        className="stroke-2"
                      />
                    </svg>
                  </span>
                </label>
              </div>
              <div className="absolute right-[0.2em] top-[0.2em] z-20 flex items-center justify-center transition-all duration-300 translate-x-0 translate-y-0"></div>
              <div className="absolute right-[0.2em] top-[0.2em] z-20 flex items-center justify-center transition-all duration-300 translate-x-0 translate-y-0">
                <Link
                  aria-current="page"
                  to="/"
                  className="router-link-active router-link-exact-active inline-flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                >
                  <span className="bg-primary-700 flex h-9 w-9 items-center justify-center rounded-full">
                    <svg
                      data-v-cd102a71
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      className="icon h-5 w-5 text-white"
                      width="1em"
                      height="1em"
                      viewBox="0 0 256 256"
                    >
                      <g fill="currentColor">
                        <path
                          d="M208 192H48a8 8 0 0 1-6.88-12C47.71 168.6 56 139.81 56 104a72 72 0 0 1 144 0c0 35.82 8.3 64.6 14.9 76a8 8 0 0 1-6.9 12"
                          opacity=".2"
                        />
                        <path d="M221.8 175.94c-5.55-9.56-13.8-36.61-13.8-71.94a80 80 0 1 0-160 0c0 35.34-8.26 62.38-13.81 71.94A16 16 0 0 0 48 200h40.81a40 40 0 0 0 78.38 0H208a16 16 0 0 0 13.8-24.06M128 216a24 24 0 0 1-22.62-16h45.24A24 24 0 0 1 128 216m-80-32c7.7-13.24 16-43.92 16-80a64 64 0 1 1 128 0c0 36.05 8.28 66.73 16 80Z"></path>
                      </g>
                    </svg>
                  </span>
                </Link>
              </div>
              <div className="absolute right-[0.2em] top-[0.2em] z-20 flex items-center justify-center transition-all duration-300 translate-x-0 translate-y-0">
                <button
                  type="button"
                  className="bg-primary-700 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                >
                  <svg
                    data-v-cd102a71
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    className="icon h-5 w-5 text-white"
                    width="1em"
                    height="1em"
                    viewBox="0 0 256 256"
                  >
                    <g fill="currentColor">
                      <path
                        d="M112 80a32 32 0 1 1-32-32a32 32 0 0 1 32 32m64 32a32 32 0 1 0-32-32a32 32 0 0 0 32 32m-96 32a32 32 0 1 0 32 32a32 32 0 0 0-32-32m96 0a32 32 0 1 0 32 32a32 32 0 0 0-32-32"
                        opacity=".2"
                      />
                      <path d="M80 40a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m96 16a40 40 0 1 0-40-40a40 40 0 0 0 40 40m0-64a24 24 0 1 1-24 24a24 24 0 0 1 24-24m-96 80a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m96-64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24"></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal 1 */}
      {modal && (
        <div>
          <div
            className="relative z-[9999]"
            id="headlessui-dialog-55"
            role="dialog"
            aria-modal="true"
            data-headlessui-state="open"
          >
            <div className="bg-muted-800/70 dark:bg-muted-900/80 fixed inset-0" />
            <div className="fixed inset-0 overflow-x-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div
                  id="headlessui-dialog-panel-58"
                  data-headlessui-state="open"
                  className="dark:bg-muted-800 w-full bg-white text-left align-middle shadow-xl transition-all rounded-lg max-w-2xl"
                >
                  <div className="flex w-full items-center justify-between p-4 md:p-6">
                    <div className="lg:flex lg:items-center lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
                          Transaction Details
                        </h2>
                        <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 3.75A2.75 2.75 0 018.75 1h2.5A2.75 2.75 0 0114 3.75v.443c.572.055 1.14.122 1.706.2C17.053 4.582 18 5.75 18 7.07v3.469c0 1.126-.694 2.191-1.83 2.54-1.952.599-4.024.921-6.17.921s-4.219-.322-6.17-.921C2.694 12.73 2 11.665 2 10.539V7.07c0-1.321.947-2.489 2.294-2.676A41.047 41.047 0 016 4.193V3.75zm6.5 0v.325a41.622 41.622 0 00-5 0V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25zM10 10a1 1 0 00-1 1v.01a1 1 0 001 1h.01a1 1 0 001-1V11a1 1 0 00-1-1H10z"
                                clipRule="evenodd"
                              />
                              <path d="M3 15.055v-.684c.126.053.255.1.39.142 2.092.642 4.313.987 6.61.987 2.297 0 4.518-.345 6.61-.987.135-.041.264-.089.39-.142v.684c0 1.347-.985 2.53-2.363 2.686a41.454 41.454 0 01-9.274 0C3.985 17.585 3 16.402 3 15.055z" />
                            </svg>{" "}
                            User: {userDetail && userDetail.email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex lg:ml-4 lg:mt-0">
                        {userDetail._id ? (
                          <span className="block">
                            <Link
                              to={`/admin/users/${userDetail._id}/general`}
                              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:ring-gray-600 dark:ring-inset"
                            >
                              <svg
                                className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                              >
                                <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                                <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                              </svg>{" "}
                              User Profile{" "}
                            </Link>
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <button
                      onClick={toggleModalClose}
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
                  <div className="p-4 md:p-6 overflow-auto">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4 md:gap-y-8 sm:grid-cols-2 mb-3">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Transaction ID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <a
                            href="javascript:void(0)"
                            className="font-medium inline-flex text-gray-900 dark:text-white flex items-center hover:text-gray-600 dark:hover:text-gray-400 text-xs"
                            onClick={() =>
                              handleCopyToClipboard(singleTransaction.txId)
                            }
                          >
                            {" "}
                            <Truncate
                              text={singleTransaction._id}
                              offset={6}
                              width="100"
                            />
                            <svg
                              data-v-cd102a71
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              aria-hidden="true"
                              role="img"
                              className="icon w-5 h-5 inline-block -mt-1 ml-1"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              >
                                <rect
                                  width={13}
                                  height={13}
                                  x={9}
                                  y={9}
                                  rx={2}
                                  ry={2}
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </g>
                            </svg>
                          </a>
                        </dd>
                      </div>
                      {singleTransaction.withdraw === "crypto" ? (
                        <>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Transaction Hash
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              <a
                                href="javascript:void(0)"
                                className="font-medium inline-flex text-gray-900 dark:text-white flex items-center hover:text-gray-600 dark:hover:text-gray-400 text-xs"
                                onClick={() =>
                                  handleCopyToClipboard(singleTransaction.txId)
                                }
                              >
                                {" "}
                                <Truncate
                                  text={singleTransaction.txId}
                                  offset={6}
                                  width="100"
                                />
                                <svg
                                  data-v-cd102a71
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlnsXlink="http://www.w3.org/1999/xlink"
                                  aria-hidden="true"
                                  role="img"
                                  className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                  width="1em"
                                  height="1em"
                                  viewBox="0 0 24 24"
                                >
                                  <g
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                  >
                                    <rect
                                      width={13}
                                      height={13}
                                      x={9}
                                      y={9}
                                      rx={2}
                                      ry={2}
                                    />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </g>
                                </svg>
                              </a>
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Block
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              <Truncate
                                text={singleTransaction.txId}
                                offset={6}
                                width="100"
                              />
                            </dd>
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Timestamp
                        </dt>
                        {/* <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          {new Date(
                            singleTransaction.createdAt
                          ).toLocaleString()}
                        </dd> */}
                        <input
                          type="datetime-local"
                          value={timestamp}
                          onChange={handleChange}
                          required
                          style={{border: error?"1px solid red":"1px solid #ccc" }}
                          className={`w-full px-3 py-1 border rounded-md text-sm ${error
                            ? "  text-red-600"
                            : "text-gray-900 dark:text-white  "
                            } bg-white dark:bg-gray-800`}
                        />
                        {error && <p className="mt-1 text-sm text-red-600 "style={{color:'red'}}>{error}</p>}
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          From
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <a
                            href="javascript:void(0)"
                            className="font-medium inline-flex text-gray-900 dark:text-white flex items-center hover:text-gray-600 dark:hover:text-gray-400 text-xs"
                          >
                            {" "}
                            <input
                              type="text"
                              className="border  py-1 p-3"
                              onChange={handleInput}
                              value={singleTransaction.fromAddress}
                              name="fromAddress"
                            />
                            <svg
                              onClick={() =>
                                handleCopyToClipboard(
                                  singleTransaction.fromAddress
                                )
                              }
                              data-v-cd102a71
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              aria-hidden="true"
                              role="img"
                              className="icon w-5 h-5 inline-block -mt-1 ml-1"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              >
                                <rect
                                  width={13}
                                  height={13}
                                  x={9}
                                  y={9}
                                  rx={2}
                                  ry={2}
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </g>
                            </svg>
                          </a>
                        </dd>
                      </div>
                      {singleTransaction.withdraw === "bank" ? (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            to
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            <a
                              href="javascript:void(0)"
                              className="font-medium inline-flex text-gray-900 dark:text-white flex items-center hover:text-gray-600 dark:hover:text-gray-400 text-xs"
                            >
                              {" "}
                              <input
                                type="text"
                                className="border  py-1 p-3"
                                onChange={handleInput}
                                value={singleTransaction.selectedPayment}
                                readOnly
                              />
                              <svg
                                onClick={() =>
                                  handleCopyToClipboard(
                                    singleTransaction.selectedPayment
                                  )
                                }
                                data-v-cd102a71
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                >
                                  <rect
                                    width={13}
                                    height={13}
                                    x={9}
                                    y={9}
                                    rx={2}
                                    ry={2}
                                  />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </g>
                              </svg>
                            </a>
                          </dd>
                        </div>
                      ) : (
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            to
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                            <a
                              href="javascript:void(0)"
                              className="font-medium inline-flex text-gray-900 dark:text-white flex items-center hover:text-gray-600 dark:hover:text-gray-400 text-xs"
                            >
                              {" "}
                              <input
                                type="text"
                                className="border  py-1 p-3"
                                onChange={handleInput}
                                value={singleTransaction.txId}
                                name="txId"
                              />
                              <svg
                                onClick={() =>
                                  handleCopyToClipboard(singleTransaction.txId)
                                }
                                data-v-cd102a71
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                className="icon w-5 h-5 inline-block -mt-1 ml-1"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <g
                                  fill="none"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                >
                                  <rect
                                    width={13}
                                    height={13}
                                    x={9}
                                    y={9}
                                    rx={2}
                                    ry={2}
                                  />
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </g>
                              </svg>
                            </a>
                          </dd>
                        </div>
                      )}

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Value
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <a
                            href="javascript:void(0)"
                            className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400"
                          >
                            {typeof singleTransaction.amount !== "object" && (
                              <span>
                                <input
                                  type="number"
                                  onChange={handleInput}
                                  value={Math.abs(singleTransaction.amount)} // Convert to positive value
                                  name="amount"
                                  className="border w-102 py-1 p-3"
                                />
                                {singleTransaction.trxName.toLowerCase() === "bitcoin"
                                  ? " BTC"
                                  : singleTransaction.trxName.toLowerCase() === "ethereum"
                                    ? " ETH"
                                    : singleTransaction.trxName.toLowerCase() === "tether"
                                      ? " USDT"
                                      : singleTransaction.trxName.toLowerCase() === "bnb"
                                        ? " BNB"
                                        : singleTransaction.trxName.toLowerCase() === "euro"
                                          ? "EUR"
                                          : singleTransaction.trxName.toLowerCase() === "solana"
                                            ? "SOL"
                                            : singleTransaction.trxName.toLowerCase() === "xrp"
                                              ? " XRP"
                                              : singleTransaction.trxName.toLowerCase() === "dogecoin"
                                                ? " DOGE"
                                                : singleTransaction.trxName.toLowerCase() === "toncoin"
                                                  ? " TON"
                                                  : singleTransaction.trxName.toLowerCase() === "chainlink"
                                                    ? " LINK"
                                                    : singleTransaction.trxName.toLowerCase() === "polkadot"
                                                      ? " DOT"
                                                      : singleTransaction.trxName.toLowerCase() === "near protocol"
                                                        ? " NEAR"
                                                        : singleTransaction.trxName.toLowerCase() === "usdc coin"
                                                          ? " USDC"
                                                          : singleTransaction.trxName.toLowerCase() === "tron"
                                                            ? " TRX"
                                                            : ""}

                              </span>
                            )}
                            {"   "}
                            <span className="text-gray-400">
                              {`($${singleTransaction.trxName.toLowerCase() === "bitcoin"
                                ? (
                                  Math.abs(
                                    parseFloat(singleTransaction.amount)
                                  ) * liveBtc || 0
                                ).toFixed(2)
                                : singleTransaction.trxName.toLowerCase() === "ethereum"
                                  ? (
                                    Math.abs(
                                      parseFloat(singleTransaction.amount)
                                    ) * 2640.86 || 0
                                  ).toFixed(2)
                                  : singleTransaction.trxName.toLowerCase() === "tether"
                                    ? (
                                      Math.abs(
                                        parseFloat(singleTransaction.amount)
                                      ) || 0
                                    ).toFixed(2)
                                    : singleTransaction.trxName.toLowerCase() === "bnb"
                                      ? (
                                        Math.abs(
                                          parseFloat(singleTransaction.amount)
                                        ) * 210.25 || 0
                                      ).toFixed(2) // Example price
                                      : singleTransaction.trxName.toLowerCase() === "xrp"
                                        ? (
                                          Math.abs(
                                            parseFloat(singleTransaction.amount)
                                          ) * 0.5086 || 0
                                        ).toFixed(2) // Example price
                                        : singleTransaction.trxName.toLowerCase() === "dogecoin"
                                          ? (
                                            Math.abs(
                                              parseFloat(singleTransaction.amount)
                                            ) * 0.1163 || 0
                                          ).toFixed(2) // Example price
                                          : singleTransaction.trxName.toLowerCase() === "toncoin"
                                            ? (
                                              Math.abs(
                                                parseFloat(singleTransaction.amount)
                                              ) * 5.76 || 0
                                            ).toFixed(2) // Example price
                                            : singleTransaction.trxName.toLowerCase() === "chainlink"
                                              ? (
                                                Math.abs(
                                                  parseFloat(singleTransaction.amount)
                                                ) * 12.52 || 0
                                              ).toFixed(2) // Example price
                                              : singleTransaction.trxName.toLowerCase() === "polkadot"
                                                ? (
                                                  Math.abs(
                                                    parseFloat(singleTransaction.amount)
                                                  ) * 4.76 || 0
                                                ).toFixed(2) // Example price
                                                : singleTransaction.trxName.toLowerCase() === "near protocol"
                                                  ? (
                                                    Math.abs(
                                                      parseFloat(singleTransaction.amount)
                                                    ) * 5.59 || 0
                                                  ).toFixed(2) // Example price
                                                  : singleTransaction.trxName.toLowerCase() === "usd coin"
                                                    ? (
                                                      Math.abs(
                                                        parseFloat(singleTransaction.amount)
                                                      ) * 0.99 || 0
                                                    ).toFixed(2) // Example price
                                                    : singleTransaction.trxName.toLowerCase() === "tron"
                                                      ? (
                                                        Math.abs(
                                                          parseFloat(singleTransaction.amount)
                                                        ) * 0.1531 || 0
                                                      ).toFixed(2) // Example price
                                                      : (0).toFixed(2)
                                })`}</span>

                            <svg
                              onClick={() =>
                                handleCopyToClipboard(
                                  singleTransaction.amount.toFixed(8)
                                )
                              }
                              data-v-cd102a71
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              aria-hidden="true"
                              role="img"
                              className="icon w-5 h-5 inline-block -mt-1 ml-2"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              >
                                <rect
                                  width={13}
                                  height={13}
                                  x={9}
                                  y={9}
                                  rx={2}
                                  ry={2}
                                />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </g>
                            </svg>
                          </a>
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </dt>
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
                                  {Status === "pending" ? (
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
                                  ) : Status === "completed" ? (
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
                                  ) : Status === "failed" ? (
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
                                    onClick={() => setStatus("completed")}
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
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Type
                        </dt>
                        <div className="col-span-12 sm:col-span-9">
                          <div className="relative w-full">
                            {/**/}
                            <div className="relative">
                              <button
                                onClick={toggleType}
                                id="headlessui-listbox-button-37"
                                type="button"
                                aria-haspopup="listbox"
                                aria-expanded="false"
                                data-headlessui-state
                                className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer/input relative w-full border bg-white pe-12 ps-4 font-sans text-sm leading-5 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 rounded"
                              >
                                <div className="flex w-full items-center h-10">
                                  {Type === "withdraw" ? (
                                    <>
                                      <div className="truncate text-left">
                                        Withdraw
                                      </div>
                                    </>
                                  ) : Type === "deposit" ? (
                                    <>
                                      <div className="truncate text-left">
                                        Deposit
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
                              {activeType && (
                                <ul
                                  onClick={toggleType}
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
                                    onClick={() => setType("deposit")}
                                    className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                    id="headlessui-listbox.option-135"
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected="true"
                                  >
                                    <div>
                                      <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                        Deposit
                                      </h4>
                                      <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                        Deposit
                                      </p>
                                    </div>
                                  </li>
                                  <li
                                    onClick={() => setType("withdraw")}
                                    className="relative flex cursor-pointer select-none items-center px-3 py-2 rounded"
                                    id="headlessui-listbox.option-136"
                                    role="option"
                                    tabIndex={-1}
                                    aria-selected="false"
                                  >
                                    <div>
                                      <h4 className="font-heading text-sm font-normal leading-normal leading-normal text-muted-800 block truncate dark:text-white">
                                        Withdraw
                                      </h4>
                                      <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                        Withdraw
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
                          </div>
                        </div>
                      </div>
                    </dl>

                    <div className="s ">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Note
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <a
                          href="javascript:void(0)"
                          className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400"
                        >
                          <input
                            type="text"
                            onChange={handleInput}
                            value={singleTransaction.note}
                            name="note"
                            className="border w-1001   py-1 p-3"
                          />
                        </a>
                      </dd>
                    </div>
                    <div className="s ">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Reference
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                        <a
                          href="javascript:void(0)"
                          className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400"
                        >
                          <input
                            type="text"
                            onChange={handleInput}
                            value={singleTransaction.reference}
                            name="reference"
                            className="border w-1001   py-1 p-3"
                          />
                        </a>
                      </dd>
                    </div>
                    <div
                      className="flex  justify-center mt-5
                  "
                    >
                      <button
                        onClick={() => approveTransaction(singleTransaction)}
                        disabled={isDisbaled}
                        className="is-button rounded bg-primary-500 py-1 p-3 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteTransaction(singleTransaction)}
                        disabled={isDisbaled}
                        className="is-button rounded bg-danger-500 ms-2 py-1 p-3 dark:bg-danger-500 hover:enabled:bg-danger-400 dark:hover:enabled:bg-danger-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-danger-500/50 dark:hover:enabled:shadow-danger-800/20 focus-visible:outline-danger-400/70 focus-within:outline-danger-400/70 focus-visible:bg-danger-500 active:enabled:bg-danger-500 dark:focus-visible:outline-danger-400 dark:focus-within:outline-danger-400 dark:focus-visible:bg-danger-500 dark:active:enabled:bg-danger-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-x-2 justify-end">
                    <div className="p-4 md:p-6">
                      <div className="flex gap-x-2">
                        <button
                          onClick={toggleModalClose}
                          data-v-71bb21a6
                          type="button"
                          className="is-button rounded is-button-default"
                        >
                          Close
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

      {/* Modal 1 */}
    </div>
  );
};

export default UserTransactions;
