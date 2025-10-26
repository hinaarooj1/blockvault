import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import Log from "../../../assets/images/img/log.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { signleUsersApi, updateSignleUsersApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import ReactQuill from "react-quill";
import './style.css'
import AdminHeader from "../adminHeader";
const General = () => {
  //

  let authUser = useAuthUser();
  let Navigate = useNavigate();

  const [newDescription, setnewDescription] = useState("");
  const [isDisable, setisDisable] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    progress: 0,
  });
  let handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };

  //
  const handleQuillChange = (content, _, source, editor) => {
    setnewDescription(content);
  };
  let { id } = useParams();

  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  const [currency, setCurrency] = useState("");

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };
  const getSignleUser = async () => {
    try {
      const signleUser = await signleUsersApi(id);

      if (signleUser.success) {
        setUserData(signleUser.signleUser); setCurrency(signleUser.signleUser.currency)
        setnewDescription(signleUser.signleUser.note);
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
  const updateSignleUser = async (e) => {
    e.preventDefault();
    try {
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
      let body = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        note: editDesc,
        address: userData.address,
        city: userData.city,
        progress: userData.progress,
        country: userData.country,
        postalCode: userData.postalCode,
        currency: currency,
      };

      if (
        !body.firstName.trim() ||
        !body.lastName.trim() ||
        !body.email.trim() ||
        !body.password.trim() ||
        !body.address.trim() ||
        !body.city.trim() ||
        !body.country.trim() ||
        !body.phone ||
        !body.postalCode ||
        !currency
      ) {
        toast.error("Fields cannot be left blank except the note field!");

        return;
      }

      setisDisable(true);

      const signleUser = await updateSignleUsersApi(id, body);

      if (signleUser.success) {
        toast.dismiss();
        toast.success(signleUser.msg);
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
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
    getSignleUser();
  }, []);
  return (
    <>
      <div className="">
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
              <div className="admin">
                <div className="min-h-screen overflow-hidden">
                  <div className="grid gap-8 sm:grid-cols-12">
                    <UserSideBar userid={id} />
                    <div className="col-span-12 sm:col-span-8">
                      <form method="POST" action className="w-full ">
                        <div className="border-muted-200 dark:border-muted-700 dark:bg-muted-800 relative w-full border bg-white transition-all duration-300 rounded-md">
                          <div className="flex items-center justify-between p-4">
                            <div>
                              <p
                                className="font-heading text-sm font-medium leading-normal leading-normal uppercase tracking-wider"
                                tag="h2"
                              >
                                {" "}
                                Settings{" "}
                              </p>
                              <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                {" "}
                                Edit user settings{" "}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                disabled={isDisable}
                                onClick={updateSignleUser}
                                data-v-71bb21a6
                                type="submit"
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
                          </div>
                          <div className="p-4">
                            <div className=" space-y-12 py-8">
                              {/**/}
                              {/**/}
                              <fieldset className="relative">
                                <div className="mb-6">
                                  <p
                                    className="font-heading text-base font-medium leading-none"
                                    tag="h3"
                                  >
                                    User Information
                                  </p>
                                  <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                                    Basic user information
                                  </p>
                                </div>
                                <div className="grid grid-cols-12 gap-4">
                                  <div className="col-span-12">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-11"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.email}
                                          name="email"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Email"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M216 96v112a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V96a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8"
                                                opacity=".2"
                                              />
                                              <path d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16M96 56a32 32 0 0 1 64 0v24H96Zm112 152H48V96h160zm-68-56a12 12 0 1 1-12-12a12 12 0 0 1 12 12" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-11"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.password}
                                          name="password"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Password"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M216 96v112a8 8 0 0 1-8 8H48a8 8 0 0 1-8-8V96a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8"
                                                opacity=".2"
                                              />
                                              <path d="M208 80h-32V56a48 48 0 0 0-96 0v24H48a16 16 0 0 0-16 16v112a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V96a16 16 0 0 0-16-16M96 56a32 32 0 0 1 64 0v24H96Zm112 152H48V96h160zm-68-56a12 12 0 1 1-12-12a12 12 0 0 1 12 12" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-12"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.firstName}
                                          name="firstName"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="First Name"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M192 96a64 64 0 1 1-64-64a64 64 0 0 1 64 64"
                                                opacity=".2"
                                              />
                                              <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-13"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.lastName}
                                          name="lastName"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Last Name"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M192 96a64 64 0 1 1-64-64a64 64 0 0 1 64 64"
                                                opacity=".2"
                                              />
                                              <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-14"
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
                                            ].includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          onChange={handleInput}
                                          value={userData.phone}
                                          name="phone"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Phone Number"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M223.94 174.08A48.33 48.33 0 0 1 176 216A136 136 0 0 1 40 80a48.33 48.33 0 0 1 41.92-47.94a8 8 0 0 1 8.3 4.8l21.13 47.2a8 8 0 0 1-.66 7.53L89.32 117a7.93 7.93 0 0 0-.54 7.81c8.27 16.93 25.77 34.22 42.75 42.41a7.92 7.92 0 0 0 7.83-.59l25-21.3a8 8 0 0 1 7.59-.69l47.16 21.13a8 8 0 0 1 4.83 8.31"
                                                opacity=".2"
                                              />
                                              <path d="m222.37 158.46l-47.11-21.11l-.13-.06a16 16 0 0 0-15.17 1.4a8.12 8.12 0 0 0-.75.56L134.87 160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16 16 0 0 0 1.32-15.06v-.12L97.54 33.64a16 16 0 0 0-16.62-9.52A56.26 56.26 0 0 0 32 80c0 79.4 64.6 144 144 144a56.26 56.26 0 0 0 55.88-48.92a16 16 0 0 0-9.51-16.62M176 208A128.14 128.14 0 0 1 48 80a40.2 40.2 0 0 1 34.87-40a.61.61 0 0 0 0 .12l21 47l-20.67 24.74a6.13 6.13 0 0 0-.57.77a16 16 0 0 0-1 15.7c9.06 18.53 27.73 37.06 46.46 46.11a16 16 0 0 0 15.75-1.14a8.44 8.44 0 0 0 .74-.56L168.89 152l47 21.05h.11A40.21 40.21 0 0 1 176 208" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-15"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.address}
                                          name="address"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Address"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80m0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32"
                                                opacity=".2"
                                              />
                                              <path d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.19 254.19 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.19 254.19 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-16"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.city}
                                          name="city"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="City"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80m0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32"
                                                opacity=".2"
                                              />
                                              <path d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.19 254.19 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.19 254.19 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12 sm:col-span-6">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-17"
                                          type="text"
                                          onChange={handleInput}
                                          value={userData.country}
                                          name="country"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Country"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80m0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32"
                                                opacity=".2"
                                              />
                                              <path d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.19 254.19 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.19 254.19 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-span-12 sm:col-span-6">
                                    <div className="relative">
                                      {/**/}
                                      <div className="group/nui-input relative">
                                        <input
                                          id="ninja-input-18"
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
                                            ].includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          onChange={handleInput}
                                          value={userData.postalCode}
                                          name="postalCode"
                                          className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                          placeholder="Postal Code"
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
                                            <g fill="currentColor">
                                              <path
                                                d="M128 24a80 80 0 0 0-80 80c0 72 80 128 80 128s80-56 80-128a80 80 0 0 0-80-80m0 112a32 32 0 1 1 32-32a32 32 0 0 1-32 32"
                                                opacity=".2"
                                              />
                                              <path d="M128 64a40 40 0 1 0 40 40a40 40 0 0 0-40-40m0 64a24 24 0 1 1 24-24a24 24 0 0 1-24 24m0-112a88.1 88.1 0 0 0-88 88c0 31.4 14.51 64.68 42 96.25a254.19 254.19 0 0 0 41.45 38.3a8 8 0 0 0 9.18 0a254.19 254.19 0 0 0 41.37-38.3c27.45-31.57 42-64.85 42-96.25a88.1 88.1 0 0 0-88-88m0 206c-16.53-13-72-60.75-72-118a72 72 0 0 1 144 0c0 57.23-55.47 105-72 118" />
                                            </g>
                                          </svg>
                                        </div>
                                        {/**/}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-12">
                                    <div className="relative">
                                      <div className="group/nui-input relative">
                                        {/* Label */}
                                        <div className="text-sm text-gray-500 py-1 font-medium">
                                          User Currency:
                                        </div>

                                        {/* Radio Options */}
                                        <div className="flex items-center space-x-4 mt-2">
                                          <label
                                            htmlFor="eur"
                                            className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${currency === "EUR" ? "bg-blue-100" : "hover:bg-gray-100"
                                              }`}
                                          >
                                            <input
                                              type="radio"
                                              id="eur"
                                              name="currency"
                                              value="EUR"
                                              checked={currency === "EUR"}
                                              onChange={handleCurrencyChange}
                                              className=" me-2"
                                            />
                                            <div className="text-blue-600 font-medium">EUR</div>
                                          </label>

                                          <label
                                            htmlFor="usd"
                                            className={`flex items-center space-x-2 cursor-pointer p-2 rounded-md ${currency === "USD" ? "bg-blue-100" : "hover:bg-gray-100"
                                              }`}
                                          >
                                            <input
                                              type="radio"
                                              id="usd"
                                              name="currency"
                                              value="USD"
                                              checked={currency === "USD"}
                                              onChange={handleCurrencyChange}
                                              className=" me-2"
                                            />
                                            <div className="text-blue-600 font-medium">USD</div>
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Display Selected Value */}
                                    {currency && (
                                      <div className="mt-4 text-sm text-gray-600">
                                        Selected Currency: <span className="font-semibold">{currency}</span>
                                      </div>
                                    )}
                                  </div>
                                  {/* <div className="col-span-12">
                                    <div className="relative">
                                      <div className="group/nui-input relative">
                                        <div className=" bottom-0 left-0 text-sm text-muted-400  py-1">
                                          User Progress: {userData.progress}%
                                        </div>
                                        <input
                                          type="range"
                                          id="progress-slider"
                                          onChange={handleInput}
                                          value={userData.progress}
                                          name="progress"
                                          min="0"
                                          max="100"
                                          className="nui-focus peer w-full h-10  bottom-0 left-0 opacity-100 cursor-pointer"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-span-12">
                                    <div className="relative">
                                      <label
                                        htmlFor="ninja-input-19"
                                        className="nui-label pb-1 text-[0.825rem]"
                                      >
                                        Note:
                                      </label>
                                      <div className="group/nui-textarea relative flex flex-col">
                                        <ReactQuill
                                          className="htmlcode"
                                          placeholder="Enter something to show to the user on his dashboard..."
                                          value={newDescription}
                                          onChange={handleQuillChange}
                                          modules={{
                                            toolbar: [
                                              [{ link: "link" }],
                                              [
                                                "bold",
                                                "italic",
                                                "underline",
                                                "strike",
                                              ],

                                              [{ header: 1 }, { header: 2 }],
                                              [
                                                { list: "ordered" },
                                                { list: "bullet" },
                                              ],
                                              [
                                                { script: "sub" },
                                                { script: "super" },
                                              ],

                                              [
                                                {
                                                  header: [
                                                    1,
                                                    2,
                                                    3,
                                                    4,
                                                    5,
                                                    6,
                                                    false,
                                                  ],
                                                },
                                              ],

                                              [{ color: [] }, { background: [] }],

                                              ["clean"],
                                            ],
                                          }}
                                        />
                                </div>
                            </div>
                          </div> */}
                                  {/* <textarea
                                        id="ninja-input-19"
                                        icon="ph:note-duotone"
                                        className="nui-focus border-muted-300 placeholder:text-muted-300 focus:border-muted-300 focus:shadow-muted-300/50 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 dark:focus:shadow-muted-800/50 peer w-full border bg-white font-sans transition-all duration-300 focus:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 min-h-[2.5rem] text-sm leading-[1.6] rounded resize-none p-2"
                                        placeholder="This will be shown to the user on the dashboard..."
                                        rows={4}
                                        onChange={handleInput}
                                        value={userData.note}
                                        name="note"
                                      /> */}
                                </div>
                              </fieldset>
                            </div>
                          </div>
                        </div>
                        <div>{/**/}</div>
                      </form>
                    </div>
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
                    <div className="dark">
                      <h3 className="mb-2 font-bold inveret">
                        The note will show at the top of his dashboard like that:
                      </h3>
                      <div
                        className="htmData"
                        dangerouslySetInnerHTML={{ __html: newDescription }}
                      />
                    </div>
                  )}
                  {/*  */}
                </div>
              </div>
              {/**/}
            </div >
          </div >

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
                  to="/#"
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
        </div >
      </div >
    </>
  );
};

export default General;
