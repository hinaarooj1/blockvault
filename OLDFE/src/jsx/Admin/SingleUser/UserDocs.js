import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

import { Dropzone, FileMosaic } from "@files-ui/react";
import {
  deleteSingleFileApi,
  getAllDataApi,
  uploadFilesApi,
} from "../../../Api/Service";
import { toast } from "react-toastify";

import { FileCard, FullScreen, ImagePreview } from "@files-ui/react";
import AdminHeader from "../adminHeader";
const UserDocs = () => {
  const [isLoading, setisLoading] = useState(false);
  const [allFiles, setallFiles] = useState([]);
  let { id } = useParams();
  let authUser = useAuthUser();
  let Navigate = useNavigate();

  const [imgSrc, setImgSrc] = React.useState(undefined);
  const handleSee = (imageSource) => {
    setImgSrc(imageSource);
  };

  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  const [files, setFiles] = useState([]);
  const [uploadState, setuploadState] = useState({
    isLoading: false,
    disable: true,
  });

  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
  };
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
  const handleDelete = async (_id, index) => {
    try {
      // Set the uploadStatus to 'preparing' for the selected card
      setSelectedCardIndex(index);

      const deletedFile = await deleteSingleFileApi(_id);

      if (deletedFile.success) {
        toast.success(deletedFile.msg);
        handleFetch();
      } else {
        toast.error(deletedFile.msg);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.data?.msg || error?.message || "Something went wrong");
    } finally {
      // Reset the selected card index back to null
      setSelectedCardIndex(null);
    }
  };
  const handleFetch = async () => {
    try {
      const uploadFiles = await getAllDataApi(id);

      if (uploadFiles.success) {
        if (uploadFiles.allFiles && uploadFiles.allFiles.files) {
          setallFiles(uploadFiles.allFiles.files);
        } else {
          setallFiles(null);
        }
      } else {
        toast.error(uploadFiles.msg);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.data?.msg || error?.message || "Something went wrong");
    } finally {
      // Set loading state back to false
    }
  };
  const handleUpload = async () => {
    setuploadState((prevState) => ({
      ...prevState,
      isLoading: true,
      disable: true,
    })); // Set loading state to true
    if (files.length === 0) {
      return toast.error("No file selected");
    }
    // Assuming your dynamic array is named 'yourDynamicArray'
    const fileArray = files.map((item) => item.file);

    try {
      const formData = new FormData();

      fileArray.forEach((file, index) => {
        formData.append(`file_${index + 1}`, file);
      });

      const uploadFiles = await uploadFilesApi(id, formData);

      if (uploadFiles.success) {
        handleFetch();
        setFiles([]);
        toast.success(uploadFiles.msg);
      } else {
        console.log();
        toast.error(uploadFiles.msg);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error?.data?.msg || error?.message || "Something went wrong");
    } finally {
      setuploadState((prevState) => ({
        ...prevState,
        isLoading: false,
        disable: false,
      })); // Set loading state back to false
    }
  };

  const removeFile = (id) => {
    setFiles(files.filter((x) => x.id !== id));
  };
  const removeAllFiles = (evt) => {
    evt.stopPropagation();
    setFiles([]);
  };

  useEffect(() => {
    if (files.length === 0) {
      setuploadState({ disable: true });
    } else {
      setuploadState({ disable: false });
    }
  }, [files]);
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
    handleFetch();
    // console.log(btcBalance);
  }, []);
  return (
    <div className="admin">
      <div>
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            <div className="mx-auto w-full max-w-7xl">

              <AdminHeader toggle={toggleBar} pageName=" User Documents" />
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
                            Manage Documents{" "}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="row bg-white p-4 rounded">
                          <Dropzone
                            onChange={updateFiles}
                            value={files}
                            headerConfig={{
                              customHeader: (
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <button
                                    disabled={uploadState.isLoading}
                                    style={{
                                      backgroundColor: "teal",
                                      color: "white",
                                    }}
                                    onClick={removeAllFiles}
                                  >
                                    delete files
                                  </button>
                                </div>
                              ),
                            }}
                          >
                            {files.map((file) => (
                              <FileMosaic
                                key={file.id}
                                {...file}
                                onDelete={
                                  uploadState.isLoading ? undefined : removeFile
                                }
                                info
                              />
                            ))}
                          </Dropzone>
                          <button
                            className="mybtna"
                            onClick={handleUpload}
                            disabled={uploadState.disable} // Disable the button while uploading
                            style={{
                              backgroundColor: uploadState.disable
                                ? "#ddd"
                                : "#0087F7",
                              color: "white",

                              padding: "10px",
                              borderRadius: "5px",
                              marginTop: "10px",
                              border: "none",
                            }}
                          >
                            {uploadState.isLoading
                              ? "Uploading..."
                              : "Upload Files"}
                          </button>
                        </div>
                      </div>
                      {isLoading ? (
                        <div className="  p-5">Loading Assets...</div>
                      ) : (
                        <div className="p-4">
                          <h1 className="font-heading mb-3 font-bold text-2xl font- leading-normal leading-normal text-muted-800 hidden dark:text-white md:block">
                            All files: {allFiles && allFiles.length}
                          </h1>
                          <div className="image-row-container">
                            {allFiles &&
                              allFiles
                                .slice()
                                .reverse()
                                .map((sinlgeFile, index) => (
                                  <div key={index} className="image-row">
                                    <FileCard
                                      id={index}
                                      name={sinlgeFile.name}
                                      type={sinlgeFile.type}
                                      onDelete={() =>
                                        handleDelete(sinlgeFile._id, index)
                                      }
                                      info
                                      downloadUrl={sinlgeFile.url}
                                      onDownload={() =>
                                        handleDownload(sinlgeFile)
                                      }
                                      darkMode
                                      imageUrl={sinlgeFile.url}
                                      onSee={
                                        sinlgeFile.type.startsWith("image")
                                          ? handleSee
                                          : undefined
                                      }
                                      size={sinlgeFile.size}
                                      // Dynamically set the uploadStatus prop for the selected card
                                      uploadStatus={
                                        selectedCardIndex === index
                                          ? "preparing"
                                          : undefined
                                      }
                                    />
                                  </div>
                                ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {/**/}
                    {/**/}
                  </div>
                </div>
              </div>
              {/**/}
            </div>
          </div>
        </div>
      </div>
      <FullScreen
        open={imgSrc !== undefined}
        onClose={() => setImgSrc(undefined)}
      >
        <ImagePreview src={imgSrc} />
      </FullScreen>
    </div>
  );
};

export default UserDocs;
