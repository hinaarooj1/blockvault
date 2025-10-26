import React, { useEffect, useState } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";
import AdminHeader from "./adminHeader";
import { useNavigate, useParams } from "react-router-dom";
import { signleUsersApi, updateSignleUsersApi } from "../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
const AdminProfile = () => {
  const [isDisable, setisDisable] = useState(false);
  const [isLoading, setisLoading] = useState(true);
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
    AiTradingPercentage: 1.25,
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

  const getSignleUser = async () => {
    try {
      // Only fetch if we need fresh data, otherwise use authUser data
      const currentUser = authUser().user;
      
      // For admin role, check permissions first
      if (currentUser.role === 'admin') {
        const signleUser = await signleUsersApi(currentUser._id);
        if (signleUser.success) {
          if (signleUser.signleUser.adminPermissions?.isProfileUpdate === false) {
            Navigate("/admin/dashboard");
            return;
          }
          setUserData(signleUser.signleUser);
        } else {
          toast.dismiss();
          toast.error(signleUser.msg);
        }
      } else {
        // For superadmin, use existing data and fetch fresh
        const signleUser = await signleUsersApi(currentUser._id);
        if (signleUser.success) {
          setUserData(signleUser.signleUser);
        } else {
          toast.dismiss();
          toast.error(signleUser.msg);
        }
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisLoading(false);
    }
  };
  const updateSignleUser = async (e) => {

    e.preventDefault();
    try {
      setisDisable(true);
      let body = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password || "",
        phone: userData.phone,
        note: userData.note,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postalCode: userData.postalCode,
        currency: userData.currency || "USD",
        AiTradingPercentage: userData.AiTradingPercentage || 1.25
      };
      const signleUser = await updateSignleUsersApi(userData._id, body);

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
    const currentUser = authUser().user;
    
    // Role-based navigation
    if (currentUser.role === "user") {
      Navigate("/dashboard");
      return;
    }
    
    // Load user data
    getSignleUser();
  }, []);

  return (
    <div className="admin dark-new-ui">
      <div className="bg-gray-900 min-h-screen">
        <SideBar state={Active} toggle={toggleBar} />
        
        <div className="bg-gray-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
          <div className="mx-auto w-full max-w-7xl">
            <AdminHeader toggle={toggleBar} pageName="Admin Profile" />
            {isLoading ? (
              <div className="mx-auto loading-pg w-full text-center max-w-xs py-20">
                <div className="mx-auto max-w-xs flex justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500"></div>
                </div>
                <div className="mx-auto max-w-sm mt-6">
                  <h4 className="text-xl font-semibold mb-2" style={{ color: 'white' }}>
                    Loading Profile
                  </h4>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    Please wait while we load your profile information.
                  </p>
                </div>
              </div>
            ) : (
              <form method="POST" action className="w-full pb-16">
                <div className="relative w-full transition-all duration-300 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div className="flex items-center justify-between p-6" style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div>
                      <p
                        className="text-lg font-semibold uppercase tracking-wider"
                        style={{ color: 'white' }}
                        tag="h2"
                      >
                        Profile Settings
                      </p>
                      <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Edit your admin profile information
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mx-auto max-w-lg space-y-12 py-8">
                      {/**/}
                      {/**/}
                      <fieldset className="relative">
                        <div className="mb-6">
                          <p
                            className="text-base font-semibold"
                            style={{ color: 'white' }}
                            tag="h3"
                          >
                            Admin Information
                          </p>
                          <p className="text-sm mt-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                            Basic admin information
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
                                  placeholder="Password (leave empty to keep current)"
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                                  className="peer w-full border font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white'
                                  }}
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
                    <div className="flex items-center gap-2 pt-4" style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                    }}>
                      <button
                        disabled={isDisable}
                        onClick={updateSignleUser}
                        type="submit"
                        className="rounded px-6 py-2.5 font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: isDisable ? 'rgba(33, 150, 243, 0.5)' : 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          boxShadow: isDisable ? 'none' : '0 4px 14px 0 rgba(33, 150, 243, 0.4)'
                        }}
                      >
                        {isDisable ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span className="ml-2">Saving...</span>
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>{/**/}</div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
