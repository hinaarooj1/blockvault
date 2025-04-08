import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import {
  createTransactionApi,
  getCoinsApi,
  patchCoinsApi,
  signleUsersApi,
  updateCoinAddressApi,
  updateKycApi,
  updateSignleUsersApi,
} from "../../../Api/Service";
import { toast } from "react-toastify";
import AdminHeader from "../adminHeader";
const UserVerifications = () => {
  let { id } = useParams();
  let authUser = useAuthUser();
  let Navigate = useNavigate();
  const [isDisable, setisDisable] = useState(false);
  const [UserData, setUserData] = useState({});

  const [Active, setActive] = useState(false);

  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

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
      setisDisable(false);
    }
  };
  const updateKyc = async (e) => {
    try {
      let status;
      if (e === true) {
        status = "completed";
      } else if (e === false) {
        status = "pending";
      }
      setisDisable(true);
      let body = {
        kyc: e,
        status,
      };
      const signleUser = await updateKycApi(id, body);

      await patchCoinsApi(id);
      if (signleUser.success) {
        toast.dismiss();
        toast.success(signleUser.msg);
        getSignleUser();
      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
        setisDisable(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
      setisDisable(false);
    } finally {
    }
  };

  // Transaction
  const openCnic = () => {
    // Create a new window/tab with the data URL
    const newTab = window.open();
    newTab.document.write(
      '<html><head><meta name="viewport" content="width=device-width, minimum-scale=0.1"><title>Base64 Image</title></head><body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);"><img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="' +
      UserData.submitDoc.cnic +
      '" alt="Base64 Image"></body></html>'
    );
  };
  const openBill = () => {
    // Create a new window/tab with the data URL
    const newTab = window.open();
    newTab.document.write(
      '<html><head><meta name="viewport" content="width=device-width, minimum-scale=0.1"><title>Base64 Image</title></head><body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);"><img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;" src="' +
      UserData.submitDoc.bill +
      '" alt="Base64 Image"></body></html>'
    );
  };
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
    getSignleUser();
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
                            Manage Verifications{" "}
                          </p>
                        </div>
                      </div>
                      <div className="pt-6">
                        <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 relative px-2 py-6 sm:py-4 top-px first:rounded-t-lg last:rounded-b-lg [&:not(:first-child)]:border-t-0">
                          <div className="flex w-full flex-col sm:flex-row sm:items-center">
                            <div className="relative mb-4 flex grow items-center gap-2 px-6 sm:mb-0 sm:px-2 h-10">
                              <span className="text-muted-400 absolute hidden font-sans text-xs font-medium uppercase sm:-top-10 sm:start-2 sm:block">
                                verification
                              </span>
                              <div
                                className="relative inline-flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-primary-500/20 text-primary-500"
                                icon="material-symbols:shield-person-rounded"
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
                                  <path
                                    fill="currentColor"
                                    d="M12 13q1.45 0 2.475-1.025T15.5 9.5q0-1.45-1.025-2.475T12 6q-1.45 0-2.475 1.025T8.5 9.5q0 1.45 1.025 2.475T12 13m0 6.9q1.475-.475 2.613-1.487t1.987-2.288q-1.075-.55-2.238-.837T12 15q-1.2 0-2.363.288t-2.237.837q.85 1.275 1.988 2.288T12 19.9m0 2q-.175 0-.325-.025t-.3-.075Q8 20.675 6 17.638T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.35-.125.7-.125t.7.125l6 2.25q.575.225.938.725T20 6.375V11.1q0 3.5-2 6.538T12.625 21.8q-.15.05-.3.075T12 21.9"
                                  />
                                </svg>
                              </div>
                              <div>
                                <h4 className="font-heading text-sm font-medium leading-tight text-muted-700 dark:text-muted-100">
                                  <span>Type: KYC</span>
                                </h4>
                                <p className="font-alt text-xs font-normal leading-tight text-muted-500 dark:text-muted-400">
                                  <span>
                                    Status:{" "}
                                    <span className="">
                                      {UserData.submitDoc &&
                                        UserData.submitDoc.status
                                        ? UserData.submitDoc.status ===
                                          "pending"
                                          ? "Not submitted"
                                          : UserData.submitDoc.status ===
                                            "completed"
                                            ? "Submitted"
                                            : ""
                                        : "Loading..."}
                                    </span>
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                              <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-80">
                                <span className="text-muted-400 absolute start-8 top-1/2 mx-auto -translate-y-1/2 text-center font-sans text-xs font-medium uppercase sm:inset-x-0 sm:-top-10 sm:translate-y-0">
                                  action
                                </span>
                                {UserData.kyc === false ? (
                                  <button
                                    onClick={() => updateKyc(true)}
                                    type="button"
                                    disabled={isDisable}
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
                                  >
                                    <span>
                                      {isDisable ? (
                                        <div>
                                          <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                        </div>
                                      ) : (
                                        "Approve"
                                      )}
                                    </span>
                                  </button>
                                ) : UserData.kyc === true ? (
                                  <button
                                    onClick={() => updateKyc(false)}
                                    type="button"
                                    disabled={isDisable}
                                    className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-danger-500 text-danger-50 bg-danger-500 dark:bg-danger-500 dark:border-danger-500 text-white hover:enabled:bg-danger-400 dark:hover:enabled:bg-danger-400 hover:enabled:shadow-lg hover:enabled:shadow-danger-500/50 dark:hover:enabled:shadow-danger-800/20 focus-visible:outline-danger-400/70 focus-within:outline-danger-400/70 focus-visible:bg-danger-500 active:enabled:bg-danger-500 dark:focus-visible:outline-danger-400/70 dark:focus-within:outline-danger-400/70 dark:focus-visible:bg-danger-500 dark:active:enabled:bg-danger-500 rounded-md mr-2"
                                  >
                                    <span>
                                      {isDisable ? (
                                        <div>
                                          <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                                        </div>
                                      ) : (
                                        "Revoke"
                                      )}
                                    </span>
                                  </button>
                                ) : (
                                  ""
                                )}
                                {/**/}
                                {/**/}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {UserData.submitDoc &&
                        UserData.submitDoc.status === "completed" &&
                        UserData.submitDoc.bill &&
                        UserData.submitDoc.cnic ? (
                        <div className="data px-5 py-5">
                          <h1>Documents submitted by the user:</h1>
                          <div className="flex-wraps">
                            <div className="py-5">
                              <h1>Cnic:</h1>
                              <p onClick={openCnic} className="cursor-pointer">
                                {UserData.submitDoc.cnic && (
                                  <img
                                    style={{ width: "350px" }}
                                    src={UserData.submitDoc.cnic}
                                    alt=""
                                  />
                                )}
                              </p>
                            </div>
                            <div className="py-5">
                              <h1>Bill:</h1>
                              <p onClick={openBill} className="cursor-pointer">
                                {UserData.submitDoc.bill && (
                                  <img
                                    style={{ width: "350px" }}
                                    src={UserData.submitDoc.bill}
                                    alt=""
                                  />
                                )}
                              </p>
                            </div>
                          </div>

                          <h1>
                            Note: If you approve or revoke user KYC, the
                            submitted documents will be deleted
                          </h1>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/**/}
                  </div>
                </div>
              </div>
              {/**/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVerifications;
