import React, { useState, useEffect } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";
import { uploadFilesApi } from "../../Api/Service";
import { Dropzone, FileMosaic } from "@files-ui/react";
import Log from "../../assets/images/img/log.jpg";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./adminHeader";
const FileUpload = () => {
  let authUser = useAuthUser();
  let Navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [Active, setActive] = useState(false);
  const [uploadState, setuploadState] = useState({
    isLoading: false,
    disable: true,
  });
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  const updateFiles = (incomingFiles) => {
    setFiles(incomingFiles);
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

      const uploadFiles = await uploadFilesApi(formData);

      if (uploadFiles.success) {
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
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    } else if (authUser().user.role === "admin") {
      return;
    }
  }, []);
  useEffect(() => {
    if (files.length === 0) {
      setuploadState({ disable: true });
    } else {
      setuploadState({ disable: false });
    }
  }, [files]);
  return (
    <div className="admin">
      <div>
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            <div className="mx-auto w-full max-w-7xl">
              <AdminHeader toggle={toggleBar} pageName="  Upload Files" />

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
              <div className>
                <div>
                  <div className="mb-6 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex w-full items-center gap-4 sm:w-auto"></div>
                    <div className="flex w-full items-center justify-end gap-4 sm:w-auto" />
                  </div>

                  <div className="">
                    <>
                      <h1 className="mb-3 bolda">Upload new files:</h1>
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
                    </>
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

export default FileUpload;
