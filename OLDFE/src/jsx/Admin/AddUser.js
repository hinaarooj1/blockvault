import React, { useEffect, useState } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { registerApi } from "../../Api/Service";
const AddUser = () => {
  const [isDisable, setisDisable] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    note: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  let handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };
  //
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

  const Register = async (e) => {
    e.preventDefault();

    setisDisable(true);
    try {
      if (
        !userData.firstName ||
        !userData.lastName ||
        !userData.email ||
        !userData.password ||
        !userData.phone ||
        !userData.address ||
        !userData.city ||
        !userData.country ||
        !userData.postalCode
      ) {
        toast.dismiss();
        toast.error("All the fields are required");
        return;
      }

      let body = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        note: userData.note,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postalCode: userData.postalCode,
      };

      const updateHeader = await registerApi(body);

      if (updateHeader.success) {
        toast.dismiss();
        toast.info(updateHeader.msg);
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          note: "",
          address: "",
          city: "",
          country: "",
          postalCode: "",
        });
      } else {
        toast.dismiss();
        toast.error(updateHeader.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.data?.msg || error?.message || "Something went wrong");
    } finally {
      setisDisable(false);
    }
  };
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    } else if (authUser().user.role === "admin") {
      return;
    } else if (authUser().user.role === "subadmin") {
      Navigate("/admin/dashboard");
      return;
    }
  }, []);

  return (
    <div className="admin">
      <div>
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="col-span-12 sm:col-span-8">
            <form method="POST" action className="w-full pb-16">
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
                </div>
                <div className="p-4">
                  <div className="mx-auto max-w-lg space-y-12 py-8">
                    {/**/}
                    {/**/}
                    <fieldset className="relative">
                      <div className="mb-6">
                        <p
                          className="font-heading text-base font-medium leading-none"
                          tag="h3"
                        >
                          New User Information
                        </p>
                        <p className="font-sans text-xs font-normal leading-normal leading-normal text-muted-400">
                          Basic new user information
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
                                type="text"
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
                                type="text"
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
                      </div>
                    </fieldset>
                  </div>
                  <div className="flex items-center justify gap-2">
                    <button
                      disabled={isDisable}
                      onClick={Register}
                      data-v-71bb21a6
                      type="submit"
                      className="is-button rounded bg-primary-500 dark:bg-primary-500 hover:enabled:bg-primary-400 dark:hover:enabled:bg-primary-400 text-white hover:enabled:shadow-lg hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20 focus-visible:outline-primary-400/70 focus-within:outline-primary-400/70 focus-visible:bg-primary-500 active:enabled:bg-primary-500 dark:focus-visible:outline-primary-400 dark:focus-within:outline-primary-400 dark:focus-visible:bg-primary-500 dark:active:enabled:bg-primary-500 w-24"
                    >
                      {isDisable ? (
                        <div>
                          <div className="nui-placeload animate-nui-placeload h-4 w-8 rounded mx-auto"></div>
                        </div>
                      ) : (
                        "Add"
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div>{/**/}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
