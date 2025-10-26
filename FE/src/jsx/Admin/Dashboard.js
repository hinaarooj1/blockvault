import React, { useState, useEffect } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";
import { useAuthUser } from "react-auth-kit";
import { Link, useNavigate } from "react-router-dom";
import Log from "../../assets/images/img/log.jpg";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Modal } from "react-responsive-modal";
import {
  allUsersApi,
  getHtmlDataApi,
  getTransactionsApi,
  getAllDataApi,
  setHtmlDataApi,
  deleteSingleFileApi,
  updateOldUserCoins,
  UpdateRestrictionsApi,
  getRestrictionsApi,
} from "../../Api/Service";
import { FileCard, FullScreen, ImagePreview } from "@files-ui/react";
import { toast } from "react-toastify";
import AdminHeader from "./adminHeader";
import { Switch } from "@mui/material";
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  let Navigate = useNavigate();
  let authUser = useAuthUser();
  const [Active, setActive] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [Users, setUsers] = useState("");
  const [completed, setCompleted] = useState();
  const [isDisable, setisDisable] = useState(false);
  const [Description, setDescription] = useState({});
  const [Description2, setDescription2] = useState({});
  const [newDescription, setnewDescription] = useState("");
  const [newDescription2, setnewDescription2] = useState("");
  const [allFiles, setallFiles] = useState([]);
  const [imgSrc, setImgSrc] = React.useState(undefined);

  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const handleSee = (imageSource) => {
    setImgSrc(imageSource);
  };

  const onOpenModal = () => {
    setOpen(true);
  };
  const onCloseModal = () => setOpen(false);
  const handleDownload = async (sinlgeFile) => {
    // Replace 'your-file-url' with the actual URL of your file
    const fileUrl = sinlgeFile.url;

    // Fetch the file content
    const response = await fetch(fileUrl);
    const fileContent = await response.blob();

    // Create a Blob with the desired content type (e.g., 'application/pdf')
    const blob = new Blob([fileContent], { type: sinlgeFile.type });

    // Create a download link
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);

    // Set the download attribute with the desired file name (including extension)
    downloadLink.download = sinlgeFile.public_id;

    // Append the link to the body
    document.body.appendChild(downloadLink);

    // Trigger the click event to start the download
    downloadLink.click();

    // Remove the link from the body after download is initiated
    document.body.removeChild(downloadLink);
  };

  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  const [isUser, setIsUser] = useState(true);
  const handleQuillChange = (content, _, source, editor) => {
    setnewDescription(content);
  };
  const handleQuillChange2 = (content, _, source, editor) => {
    setnewDescription2(content);
  };
  const getHtmlData = async () => {
    try {
      const description = await getHtmlDataApi();

      if (description.success) {
        setDescription(description.description[0]);
        setDescription2(description.description[1]);
        setnewDescription(description.description[0].description);
        setnewDescription2(description.description[1].description);

        return;
      } else {
        toast.error(description.msg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
    }
  };
  const setHtmlData = async () => {
    try {
      setisDisable(true);
      let editDesc = newDescription;
      if (
        editDesc === "<p><br></p>" ||
        editDesc === "<h1><br></h1>" ||
        editDesc === "<h2><br></h2>" ||
        editDesc === "<h3><br></h3>" ||
        editDesc === "<h4><br></h4>" ||
        editDesc === "<h5><br></h5>" ||
        editDesc === "<h6><br></h6>"
      ) {
        editDesc = "";
      } else {
        editDesc = newDescription;
      }
      let data
      let id = Description?._id
      if (!id) {

        data = { id: null, description: editDesc };
      } else {
        data = { id: Description._id, description: editDesc };

      }
      const descriptionUpdate = await setHtmlDataApi(data);
      getHtmlData();

      if (descriptionUpdate.success) {
        toast.success(descriptionUpdate.msg);

        setDescription(descriptionUpdate.description);

        return;
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  };
  const setHtmlData2 = async () => {
    try {
      setisDisable(true);
      let editDesc = newDescription2;
      if (
        editDesc === "<p><br></p>" ||
        editDesc === "<h1><br></h1>" ||
        editDesc === "<h2><br></h2>" ||
        editDesc === "<h3><br></h3>" ||
        editDesc === "<h4><br></h4>" ||
        editDesc === "<h5><br></h5>" ||
        editDesc === "<h6><br></h6>"
      ) {
        editDesc = "";
      } else {
        editDesc = newDescription2;
      }
      let data
      let id = Description2?._id
      if (!id) {

        data = { id: null, description: editDesc };
      } else {
        data = { id: Description2._id, description: editDesc };

      }
      const descriptionUpdate = await setHtmlDataApi(data);
      getHtmlData();

      if (descriptionUpdate.success) {
        toast.success(descriptionUpdate.msg);

        setDescription2(descriptionUpdate.description);

        return;
      } else {
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setisDisable(false);
    }
  };
  let pagename = authUser().user.role === "superadmin" ? "Super Admin Dashboard" : "Admin Dashboard"
  const getAllUsers = async () => {
    try {
      const allUsers = await allUsersApi();
      if (allUsers.success) {
        let filtered;

        if (authUser().user.role === "admin" || authUser().user.role === "superadmin") {
          filtered = allUsers.allUsers.filter((user) =>
            user.role.includes("user")
          );
        }
        if (authUser().user.role === "subadmin") {
          filtered = allUsers.allUsers.filter(
            (user) => user.role.includes("user") && user.isShared === true
          );
        }
        setUsers(filtered);
      } else {
        toast.error(allUsers.msg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setisLoading(false);
    }
  };
  const getTransactions = async () => {
    try {
      const allTransactions = await getTransactionsApi();
      if (allTransactions.success) {
        let dataArray = allTransactions.Transaction;

        // Function to get the length of 'completed' transactions for a given object
        const getCompletedTransactionsLength = (dataObject) => {
          return dataObject.transactions
            ? dataObject.transactions.filter(
              (transaction) =>
                transaction.status === "completed" && !transaction.isHidden
            ).length
            : 0;
        };

        // Calculate the length of 'completed' transactions for each object in the dataArray
        const completedTransactionsLengthArray = dataArray.map((dataObject) => {
          return getCompletedTransactionsLength(dataObject);
        });

        // Calculate the sum of 'completed' transactions lengths using reduce
        const sumOfCompletedTransactions =
          completedTransactionsLengthArray.reduce(
            (accumulator, length) => accumulator + length,
            0
          );

        setCompleted(sumOfCompletedTransactions);
        return;
      } else {
        toast.error(allTransactions.msg);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      // Any final steps if needed
    }
  };
  const [Allow2Fa, setAllow2Fa] = useState(false);
  const [isLoadingNew, setisLoadingNew] = useState(false);
  const [getLoading, setgetLoading] = useState(true);
  const getUserRestrcition = async () => {
    try {
      const data = await getRestrictionsApi();

      if (data.success) {
        setisLoadingNew(false)

        setAllow2Fa(data?.data?.withdrawal2Fa);
        return;
      } else {
        toast.dismiss();
        toast.error(data.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setgetLoading(false)
    }
  };
  const updateRestrictions = async (data) => {
    try {
      setisLoadingNew(true)
      const updateData = await UpdateRestrictionsApi({ withdrawal2Fa: data });
      if (updateData.success) {
        getUserRestrcition()
        toast.success("Data updated successfully")
        return;
      } else {
        setisLoadingNew(false)
        toast.error(updateData.msg);
      }
    } catch (error) {
      setisLoadingNew(false)
      toast.error(error);
    } finally {
      // Any final steps if needed
    }
  };
  let format = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "script",
    "indent",
    "direction",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
    "formula",
    "clean",
    "html",
  ];

  useEffect(() => {
    getAllUsers();
    getTransactions();
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    } else if (
      authUser().user.role === "admin" ||
      authUser().user.role === "subadmin" || authUser().user.role === "superadmin"
    ) {
      getHtmlData();
      getUserRestrcition()
      setIsUser(authUser.user);
      return;
    }
  }, []);

  return (
    <div className="admin dark-new-ui">
      <div>
        <div className="bg-gray-900 min-h-screen pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            <div className="mx-auto w-full max-w-7xl">

              <AdminHeader toggle={toggleBar} pageName={pagename} />
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
              ></div>
              {authUser().user.role === "superadmin" && <div className="permissions-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Allow Admin to see/add/manage sub admins */}
                {getLoading ? (
                  // 🔹 Skeleton card while data is loading
                  <div className="permission-card skeleton-card">
                    <div className="skeleton-header">
                      <div className="skeleton skeleton-title"></div>
                      <div className="skeleton skeleton-switch"></div>
                    </div>
                    <div className="skeleton skeleton-text"></div>
                  </div>
                ) : (
                  // 🔹 Actual card when loaded
                  <div className="permission-card bg-white dark:bg-muted-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-muted-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                        Withdrawal 2FA
                      </h3>
                      <Switch
                        disabled={isLoadingNew}
                        checked={Allow2Fa}
                        onChange={() => updateRestrictions(!Allow2Fa)}
                        color="primary"
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-muted-400">
                      Require all users to enter a one-time verification code sent to their
                      email before completing any withdrawal.
                    </p>
                  </div>
                )}

              </div>}
              <br />

              {/* Admin Permissions Section */}

              {/* Rest of the existing content remains unchanged */}
              <h2 className="note-head">Header Note:</h2>
              <ReactQuill
                className="htmlcode"
                value={newDescription}
                onChange={handleQuillChange}
                formats={format}
                placeholder="Enter Header Note..."
                modules={{
                  toolbar: [
                    [{ link: "link" }],
                    ["bold", "italic", "underline", "strike"],

                    [{ header: 1 }, { header: 2 }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],

                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }],

                    ["clean"],
                  ],
                }}
              />
              <div className="text-center mt-2">
                <button
                  disabled={isDisable}
                  onClick={setHtmlData}
                  data-v-71bb21a6
                  className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500 w-24"
                >
                  {isDisable ? (
                    <div>
                      <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
              {/*  */}
              <br />
              {newDescription === "" ||
                newDescription === "<p><br></p>" ||
                newDescription === "<h1><br></h1>" ||
                newDescription === "<h2><br></h2>" ||
                newDescription === "<h3><br></h3>" ||
                newDescription === "<h4><br></h4>" ||
                newDescription === "<h5><br></h5>" ||
                newDescription === "<h6><br></h6>" ? (
                ""
              ) : (
                <div className="dark-bgs dark">
                  <h3 className="mb-2 font-bold inveret">
                    This will the output for all users on their dashboard
                    header: <br />
                  </h3>
                  <div
                    className="htmData"
                    dangerouslySetInnerHTML={{ __html: newDescription }}
                  />
                </div>
              )}
              <h2 className="note-head mt-4">Footer Note:</h2>
              <ReactQuill
                className="htmlcode"
                value={newDescription2}
                
                placeholder="Enter Footer Note..."
                onChange={handleQuillChange2}
                formats={format}
                modules={{
                  toolbar: [
                    [{ link: "link" }],
                    ["bold", "italic", "underline", "strike"],

                    [{ header: 1 }, { header: 2 }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],

                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }],

                    ["clean"],
                  ],
                }}
              />
              <div className="text-center mt-2">
                <button
                  disabled={isDisable}
                  onClick={setHtmlData2}
                  data-v-71bb21a6
                  className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500 w-24"
                >
                  {isDisable ? (
                    <div>
                      <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                    </div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
              {/*  */}
              <br />
              {newDescription2 === "" ||
                newDescription2 === "<p><br></p>" ||
                newDescription2 === "<h1><br></h1>" ||
                newDescription2 === "<h2><br></h2>" ||
                newDescription2 === "<h3><br></h3>" ||
                newDescription2 === "<h4><br></h4>" ||
                newDescription2 === "<h5><br></h5>" ||
                newDescription2 === "<h6><br></h6>" ? (
                ""
              ) : (
                <div className="dark-bgs dark">
                  <h3 className="mb-2 font-bold inveret">
                    This will the output for all users on their dashboard
                    footer:<br />
                  </h3>
                  <div
                    className="htmData"
                    dangerouslySetInnerHTML={{ __html: newDescription2 }}
                  />
                </div>
              )}
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
      </div>{" "}
      <FullScreen
        open={imgSrc !== undefined}
        onClose={() => setImgSrc(undefined)}
      >
        <ImagePreview src={imgSrc} />
      </FullScreen>
      {/*  */}
      <Modal open={open} onClose={onCloseModal} center>
        <div className="p-5 rounded2">
          <h2>
            Add new User
            <div className="flex flex-col gap-2 mt-2 flex-row  items-center">
              <div className="relative flex h-8 items-center justify-end px-6 sm:h-10 sm:justify-center sm:px-2 w-full sm:w-80">

              </div>
            </div>
            <button
              onClick={onCloseModal}
              type="button"
              className="relative font-sans font-normal text-sm inline-flex items-center justify-center leading-5 no-underline h-8 px-3 py-2 space-x-1 border nui-focus transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:enabled:shadow-none border-info-500 text-info-50 bg-info-500 dark:bg-info-500 dark:border-info-500 text-white hover:enabled:bg-info-400 dark:hover:enabled:bg-info-400 hover:enabled:shadow-lg hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20 focus-visible:outline-info-400/70 focus-within:outline-info-400/70 focus-visible:bg-info-500 active:enabled:bg-info-500 dark:focus-visible:outline-info-400/70 dark:focus-within:outline-info-400/70 dark:focus-visible:bg-info-500 dark:active:enabled:bg-info-500 rounded-md mr-2"
            >
              <span>Cancel</span>
            </button>
          </h2>
        </div>
      </Modal>
    </div>

  );
};

export default Dashboard;
