import React, { useEffect, useState } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";
import Log from "../../assets/images/img/log.jpg";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./adminHeader";
const AdminTickets = () => {
  const [Active, setActive] = useState(false);

  let authUser = useAuthUser();
  let Navigate = useNavigate();
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
  }, []);
  return (
    <div className="admin">
      <div>
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            <div className="mx-auto w-full max-w-7xl">

              <AdminHeader toggle={toggleBar} pageName="All Tickets" />
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
              <div className>
                <div>
                  <div className="mb-6 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex w-full items-center gap-4 sm:w-auto">
                      <div className="relative w-full sm:w-auto">
                        {/**/}
                        <div className="group/nui-input relative">
                          <input
                            id="ninja-input-9"
                            type="text"
                            className="nui-focus border-muted-300 text-muted-600 placeholder:text-muted-300 dark:border-muted-700 dark:bg-muted-900/75 dark:text-muted-200 dark:placeholder:text-muted-500 dark:focus:border-muted-700 peer w-full border bg-white font-sans transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75 px-2 h-10 py-2 text-sm leading-5 pe-4 ps-9 rounded-full"
                            placeholder="Filter tickets..."
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
                              viewBox="0 0 24 24"
                            >
                              <g
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              >
                                <circle cx={11} cy={11} r={8} />
                                <path d="m21 21l-4.3-4.3" />
                              </g>
                            </svg>
                          </div>
                          {/**/}
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-end gap-4 sm:w-auto" />
                  </div>
                  <div>
                    <div className="grid gap-4 grid-cols-1">
                      <div className="w-full bg-white dark:bg-gray-800 pt-4 px-2 rounded-md shadow-sm">
                        <div className="relative ml-5">
                          <div className="font-alt mb-6 flex">
                            <div className="bg-muted-100 dark:bg-muted-700 relative flex w-full items-center font-sans rounded-md h-10 text-sm max-w-[320px] max-w-[210px]">
                              <button
                                type="button"
                                className="relative z-20 flex h-full flex-1 items-center justify-center p-6 text-white w-1/3"
                              >
                                <span>All Tickets</span>
                              </button>
                              <button
                                type="button"
                                className="relative z-20 flex h-full flex-1 items-center justify-center p-6 text-muted-400 w-1/3"
                              >
                                <span>Open</span>
                              </button>
                              <button
                                type="button"
                                className="relative z-20 flex h-full flex-1 items-center justify-center p-6 text-muted-400 w-1/3"
                              >
                                <span>Closed</span>
                              </button>
                              <div className="bg-primary-600 absolute start-0 top-0 z-10 h-full transition-all duration-300 ms-0 w-1/3 rounded-md" />
                            </div>
                          </div>
                          <div className="relative block">
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Wilhelm Scheer"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Wilhelm Scheer&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      can you check if the ID starting with 12
                                      ending UDe
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I don't think that the ID Address belongs
                                      to Wilhelm Scheer, if not can you please
                                      create one for my account.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T14:36:26.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1ef4de-0335-4d81-8672-a2eb581dc73e"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Charm"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Charm&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>btc withdraw l</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      i want to withdraw BTC from my account
                                      what should i do
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T14:37:33.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a217c9f-55ad-4e46-b137-4d037e5a8dae"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Charm"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Charm&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Charmaine</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      hi, wondering why the monies are pending?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T07:52:17.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1b5d11-f56a-4da0-9624-3152473b4e5b"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="abradley"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=abradley&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      i cant sell gbp to my debit card
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      hi i want to move the money in my assetts
                                      to my debit card nothing is occuring when
                                      i put the details
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-22T19:43:19.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a3261ce-95e0-41e6-a9a3-5f95e9033dac"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="abradley"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=abradley&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>withdraw</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      i do not whish gto contiune with the
                                      approval of the wallett as i do not have
                                      suffient funds to achieve this. sadly this
                                      was not made cleart at the start of the
                                      process by the person helping me. not
                                      encryptowallet fault. i want to withdraw
                                      my orignal funds as i am not able to put
                                      full amount im please help as i need my
                                      funds back asap as i ahve bills to pay
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-22T19:48:34.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a321f2e-9791-43e1-98cf-26e22a472c9c"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="abradley"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=abradley&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      how do i move back to my bank account
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      hi how do i transfer from my wallett
                                      direct to my bank account please in pounds
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-22T11:02:30.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a31a78b-5b80-4737-b038-200f31267a0d"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="abradley"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=abradley&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>please send me</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>hi please send me a link</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:35:46.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a234d82-9b19-4e16-91fc-c9ed34a25140"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="abradley"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=abradley&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>PENDIDG BTC</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      whay its still pendidg? Bitwhycoin
                                      (Pending) 0.38957866 ($10020.91)
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T15:35:52.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1dabfc-39cd-48a3-938c-e08ca54905b4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Sevasti"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Sevasti&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      how i transfer the money to my card?
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      i wanna take the money out of this account
                                      cause i dont know how to use them in here.
                                      is it possible to transfer them to my bank
                                      account?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T15:36:31.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a11b9b5-c328-424b-a85f-6642ee041373"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Antydacunha"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Antydacunha&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transcation pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi my last transaction is pending for the
                                      last 24 hours it says authorisation
                                      missing please let me know if i can do
                                      something from my side please do reply for
                                      this ticket
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:34:31.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a121d8f-04a7-45dc-b0dc-ad9781276d60"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Antydacunha"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Antydacunha&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      transaction pending need autorisation
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      my transaction is pending do i need to
                                      something or it will automatically active
                                      please reply
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T09:23:01.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a0fd75a-3a18-4dd6-bf3b-a3e9475986e4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="WavePower"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=WavePower&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      can I transfer to my bank account
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      hello can i transfer to my bank account
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T09:22:02.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a114270-b881-4ea7-812c-10843130fb7a"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AdrianSamuelDXB"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AdrianSamuelDXB&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Release Transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Please release
                                      9a1fdc2d-7683-4f0a-b4bd-ac7e085693e7 It
                                      has nothing to do with the authorization
                                      of this account or to release the USD39k
                                      pending transaction
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-05T15:01:03.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a4c23a7-649e-48e7-80c4-586547992e1a"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AdrianSamuelDXB"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AdrianSamuelDXB&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction Pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Can You please confirm when Transaction ID
                                      9a1fdc2d-7683-4f0a-b4bd-ac7e085693e7 will
                                      be released? I require the funds to be
                                      released enabling me to transfer the 10%
                                      +1% amount to release the USD39k value.
                                      The transfer against Transaction ID
                                      9a1fdc2d-7683-4f0a-b4bd-ac7e085693e7
                                      (USD4.1k) is NOT part of the amount
                                      on-hold
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-15T11:06:21.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a239408-8e99-41b3-b188-831568cd1ca2"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AdrianSamuelDXB"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AdrianSamuelDXB&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction ID</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I have performed a transaction where I
                                      want to move BTC from encrypt to binance.
                                      Transaction ID
                                      9a1fdc2d-7683-4f0a-b4bd-ac7e085693e7 When
                                      will this pending transaction be approved?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:31:16.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a215d2d-f703-4213-a141-8c159f4c30e0"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AdrianSamuelDXB"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AdrianSamuelDXB&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>BTC Transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      The following transaction was made
                                      ce4aa072e5751edaaaf90e989289c6109d3ec95a9f070a52c3e8f3536927abc2
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T14:03:35.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1df385-f09d-44d2-84f8-d43ebacbedb5"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AdrianSamuelDXB"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AdrianSamuelDXB&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>"Authorization required"???</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      i see 2 sums in my wallet in BTC
                                      0.14793500 ($3887.95) 0.00030224 ($7.94)
                                      it states completed but with
                                      "Authorization required" what does that
                                      mean? when can i withdraw my money?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T10:21:21.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1de42b-a857-4fc1-9d92-5cb14af3ff79"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="dc@character-ltd.com"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=dc@character-ltd.com&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>I Did authorisation</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I did authorization of 400 usd that equal
                                      to 1pc of the full amount i need to rcv
                                      from u, why i can t release my fund .
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:31:42.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1be3df-fe42-4c0b-b208-29c176886249"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="dc@character-ltd.com"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=dc@character-ltd.com&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why i can t send back my BTC to binance
                                      ???
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:33:40.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a16692f-ef82-43b8-8f03-2651b2a331e7"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="dc@character-ltd.com"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=dc@character-ltd.com&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>AUTHORIZATION</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I HAVE SEND SOME BTC ON MY ACCOUNT , COULD
                                      YOU RELEASE THE TRANSACTION PENDING NOW?
                                      OTHER WISE TELL ME THE MINIMUM AMOUNT IN
                                      BTC TO BE DEPOSITED
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:33:14.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a13b35d-e7fb-4d3a-ad72-fb8c46e9f87b"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="dc@character-ltd.com"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=dc@character-ltd.com&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Pending transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why still pending transaction waiting
                                      authorisation after 24h? What is missing ?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:32:19.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a12c2c3-3197-4af9-b599-b4d1e0d431cc"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="dc@character-ltd.com"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=dc@character-ltd.com&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Pending transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why my transaction is pending? What i need
                                      to do to authorize it ?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:32:03.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a11ca45-ae4e-42bb-9309-a750a651c95f"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Azhar21"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Azhar21&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>What can i do</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why my btc is pending if i see this on the
                                      block chain How can i withdraw money
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-07T13:12:17.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a138721-3676-433a-8440-5817d735ee84"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="LARRYM"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=LARRYM&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>an i have acccess for transfers</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>am i still pending</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-20T11:49:55.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a147b88-5c77-4da6-8d92-c590f0d154bc"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="LARRYM"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=LARRYM&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>pending btc</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Please how can i release my bitcoin?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:34:06.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a13b9c8-b69b-4c14-9eb7-7bf2ece3a1fa"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Charles"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Charles&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>btc pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>why is my btc pending?</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-08T09:26:22.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a155b62-f545-4e03-b35a-d2a44d6a4659"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bilalahmed1990"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bilalahmed1990&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>transaction pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      can you please check why my transactions
                                      are pending
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:38:39.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a177178-3dda-41b9-8237-a685195985fd"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bilalahmed1990"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bilalahmed1990&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction is showing pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why transaction is showing pending can you
                                      please check
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:37:58.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a155975-902c-43cf-93f4-996707d75a2b"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bilalahmed1990"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bilalahmed1990&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction showing pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Can you please check why my transaction is
                                      showing pending
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:39:00.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a155909-9a1a-4cdf-bef4-f697ca5b54b3"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bilalahmed1990"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bilalahmed1990&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      can you please check why my transaction is
                                      pending
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-08T09:02:33.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1552df-22d2-40ca-9f79-7aff0b61726f"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="1523ara"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=1523ara&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>pending crypto</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>how can i withdraw my BTC</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-11T10:17:44.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1b76b5-f036-495b-9c20-6e7f47fa539a"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Dave Wood"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Dave Wood&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Withdraw cash</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      How can I withdraw to my bank account
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:39:54.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1f7053-f7a7-4b68-b0a6-158d0cb60bab"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Dave Wood"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Dave Wood&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Spending transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      It says that my transaction is pending?
                                      Why is that? It says I am missing
                                      authorisation?what should I do?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-11T08:15:31.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1b4b01-470d-4100-a542-f4aad33059fe"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AH051"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AH051&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Is my wallet fully active?</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I have completed all the requirements that
                                      you have told me. Why won't my
                                      transactions get processed. Any
                                      transaction that I make goes into pending.
                                      And doesnt get processed. How long should
                                      it take to be processed. I want an answer
                                      as soon as possible.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T10:31:59.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1f81c6-5363-417c-9533-7646cd5e776b"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AH051"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AH051&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      ETH transaction hasn't arrived in account
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I made a transaction of 1.254 ETH to my
                                      ETHEREUM wallet
                                      0x03224aD656079e5d42f8683527758624E87076bE
                                      The transaction ID is
                                      0x51052819532588d52d4112e328d6ae634874a400d464ab4775d68fe9deaaf819
                                      It has completed but hasn't been credited
                                      to my account. Why not?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T11:10:14.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1ed9c4-1056-4d36-ac31-f2dda7609138"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AH051"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AH051&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      We will ask for immediate approval!
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      1. We completed a Bitcoin transfer in the
                                      amount of 0.488~ 2. Against the transfer,
                                      we requested to activate and withdraw the
                                      maximum amount (!) that appeared in the
                                      wallet for withdrawal We will ask for
                                      immediate approval! 3. In addition, we
                                      would like to know what the next step is
                                      in order to authorize the entire amount In
                                      any case, we will ask to speed up the
                                      approvals. The process takes a long time.
                                      my contact is Michael Landers regards
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:48:53.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1d62c5-6a5c-4a29-8273-5f6b33edf48c"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="AH051"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=AH051&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>pending transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      i have deposited some BTC i can see the
                                      deposit as live but the sum of $824496.93
                                      is still pending my contact is MK no
                                      315875KL
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-11T10:03:19.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1b718d-e61a-4726-884f-cc5498ac43f4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="naveed"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=naveed&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>authorization pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      on my account naveed@allamaan.ae it is
                                      showing authorization pending please
                                      advise
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T07:55:07.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1fc039-ca7e-48f3-943f-626b2603d1e0"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bishacyriac"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bishacyriac&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Withdrawal</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Please release my funds. Why do you block
                                      it. I have made all the required deposits
                                      as per your condition.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-20T06:41:52.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aa7fa67-4088-4165-ad8b-a5922d242b13"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bishacyriac"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bishacyriac&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Why is my withdrawal put to hold
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why is my withdrawal put to hold. Its my
                                      hard earned money. U guys are cheats
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-27T06:11:42.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a71b3ef-d77f-44c3-98a7-2a9213909dc0"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bishacyriac"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bishacyriac&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Return my funds</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>Approve my withdrawal</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-27T05:20:10.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a6fbbba-abcb-40d9-b46f-cc86709f8c6e"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bishacyriac"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bishacyriac&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Withdrawal process</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      What is your withdrawal process. Why can't
                                      I withdraw
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-31T07:50:21.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a6fbb50-4251-448d-bae7-e0ad5ea6ed2e"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bishacyriac"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bishacyriac&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Fraudsters &amp; Scammers</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Don't steal my hard earned money
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-27T05:22:16.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a69beb6-1424-4d5d-8f55-150f76b5cafe"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Vincent1605"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Vincent1605&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>payout</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      hello, i have 4000 usd in my account, i
                                      tried to send it to my bank account but it
                                      doesn't work
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-25T15:51:55.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a381800-144e-4603-8de9-5ae4994323f9"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Vincent1605"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Vincent1605&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      why is my money still not available
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why is my money still not available
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T09:28:45.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1f4ed8-0274-4a7a-8b80-38c0ed845051"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Vincent1605"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Vincent1605&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      In the transaction you can see that there
                                      is ETH and BTC are pending. Why is this?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T09:20:23.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1df338-2df6-4685-a7fc-5b209345ebf2"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Vincent1605"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Vincent1605&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>authorisation missing</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>why is my money pending</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-13T07:34:28.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1d56d2-44c1-424b-9ec3-8d4da7334d35"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="pistol.pete@shaw.ca"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=pistol.pete@shaw.ca&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      My transaction is pending said missing
                                      authorization. What should I do?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T07:52:36.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a1fc1fe-0332-4e55-9afe-90b467dac0d0"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Satsanga"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Satsanga&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>pending</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      my transection is pending what to do
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T11:00:58.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a218f1f-c7dd-468c-91da-c3d13559bfcd"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="ZONOUDAKI"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=ZONOUDAKI&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>why??</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>why my money is pending?</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:41:36.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a219c0a-9ef1-4c18-a03b-ca67276278ed"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="official_change"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=official_change&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Close and delete account</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      What do I have to do to close this account
                                      and delete it from your database?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T12:08:56.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a21a76e-33b5-45da-9dce-97db0ea77432"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="official_change"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=official_change&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Pending transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I have a pending transaction. What do i
                                      have to do?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-14T11:50:03.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a21a0ae-2b02-411c-8f09-3e0b8b9acfe5"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Paul1985"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Paul1985&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>5%???</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Are you asking me to pay 5% to recieve the
                                      bitcoins sent??
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-15T08:54:33.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2364e6-72be-4a7f-ac45-43afef4c74bf"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Paul1985"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Paul1985&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Cant recieve transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why the ytransaction is pending and i cant
                                      recieve the coins, what does this mean?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:41:07.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a21b86e-d647-4609-a131-9dfbc185038f"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ramon.zuniga"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ramon.zuniga&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>i cant access my 1.67 bitcoin??</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      it says PendingAuthorization is missing on
                                      my bitcoin?? how can i fix this today
                                      sorry?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-28T06:43:20.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a79bd7d-40e9-4589-92ff-eb9b37d81a55"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ramon.zuniga"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ramon.zuniga&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Ramon.zuniga</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      why is the transaction waiting for
                                      authorization? thanks sorry.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-15T08:40:16.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a235db4-e8d5-4853-b2af-b246d555f150"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ramon.zuniga"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ramon.zuniga&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Ramon.zuniga</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      why is the authorization missing?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-28T06:42:03.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a235cce-190a-4e13-97ec-e6715d2a0df4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="ahmedzain1987"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=ahmedzain1987&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Ahmed Abdalla</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      why my BTC is pending ? what i need to do
                                      to
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T15:27:22.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a298b92-7224-47f5-93ee-973198beea5c"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Roy T R"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Roy T R&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Pending transactions</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why are my transactions not going
                                      through...they're pending?? Its 3 hours
                                      already...something is not right ????
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-18T18:00:26.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2a3113-bea1-4f01-b4f2-4a2434df3990"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="amg1680"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=amg1680&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>withdraw</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      No more replies on here, have you
                                      dissapear with my funds??
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-16T14:36:34.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aa0983b-4b43-4527-a59c-5bc94f3767e2"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="amg1680"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=amg1680&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Pending transactions and withdrawal
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi, I need to open a new ticket as the
                                      other one is close, can you let me know
                                      when it will be approved my pending
                                      transactions and be able to withdraw my
                                      funds?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-05T17:32:50.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a4c59ee-b6d2-415e-bcf2-091d6fa849d8"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="amg1680"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=amg1680&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Can not withdraw my funds</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi, I can not withdraw my funds, each time
                                      I try to send BTC to BTC the transactions
                                      remains in pending, also I can not send to
                                      my bank account after exchanging BTC to
                                      GBP, can you help me on this please??
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-03T08:48:54.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a3fa947-beb5-4203-b1ba-87f0009ac928"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="amg1680"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=amg1680&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Help me realising my money.</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hello, since last week I requested help to
                                      release my money as many of my assets and
                                      transactions are still pending and waiting
                                      for approval, I can’t see all my money in
                                      the dashboard and the option to withdraw
                                      the money to my bank account is not
                                      visible yet, so I also need help with this
                                      today, hope you can contact me as soon as
                                      possible, thanks a lot. Regards, Gabriel
                                      Munoz
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-26T11:27:40.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a377c9d-606d-4d97-bb64-6cd669fea4cb"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="amg1680"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=amg1680&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Send BTC</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi I made a transfer BTC to BTC, what do I
                                      need to approve this?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-05T17:28:25.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2df697-1580-4c8b-99d3-e70d80c4d2ff"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Kirsty Steele"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Kirsty Steele&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      how can i fully activate my account
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      how can i fully activate my account
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-04T13:39:34.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2d9d74-8862-4666-b780-6e9751d81677"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Kirsty Steele"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Kirsty Steele&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>btc account</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      please associate the crypto that belongs
                                      to me to this account
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-21T09:37:30.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2d9955-13b8-4180-a51f-2cb0c1850ac6"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="nauriska"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=nauriska&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>My deposit</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hello. I would like to take out my deposit
                                      (first payment) which has ment to be first
                                      deposit to unlock my holded money. Becouse
                                      this was not enough .
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-26T09:34:01.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a3993d7-043c-41cd-ad10-7000b053c2d8"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="nauriska"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=nauriska&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Nauris Kalnins Authorization</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I did authorization on SEPA transacction,
                                      please hold my account that I will be able
                                      to release my funds. BeneficiaryLight
                                      Technology Limited Beneficiary's residence
                                      country United Kingdom Beneficiary's
                                      account GB74MODR04007401720791
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-20T18:18:54.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2e3da6-17b1-4cb6-b535-480eb82014af"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="waqas786$"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=waqas786$&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Muhammad waqas</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>why my transfer not approved ?</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-09-21T08:54:18.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a2f76b7-3e50-4b9b-acf1-ab9e0b68fa1a"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Astrid"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Astrid&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>contact info</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hello, How can I contact you. Is there a
                                      telephone number ? Or can you call me at
                                      +32486884446 ? Thank you, Astrid
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-13T11:09:49.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ace88f8-0b8b-4e7d-bc62-2fb3580277ce"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Astrid"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Astrid&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>tax hold question</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hello, can you confirm that the last tax
                                      hold procedure is completed ? And can you
                                      let me know how much exactly in total (
                                      from the 3 authorization processes
                                      together) I have to keep in the wallet ? I
                                      want to withdraw my funds/coins today.
                                      Thank you for answering and feedback. kind
                                      regards, Astrid
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-05T08:14:29.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aba967f-bc79-4768-a4a4-dd8ac9b88240"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Astrid"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Astrid&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Questions before continuing the process
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi, I'm willing to proceed with the
                                      process of the pending authorization. If I
                                      understand correctly I should also add the
                                      33% taxhold of the full value which is
                                      55935,93 Usd x 2= 111871,86 usd and + 33%
                                      of that amount= 36917,7138 Usd . So I have
                                      to deposit 92853,6438 usd. Is that correct
                                      ? Can you confirm please 1: If the
                                      calculation is correct , 2: If I can do
                                      the deposit in one total amount or it has
                                      to be separated ? 3: If all deposits are
                                      in encrypt wallet, if you will for sure
                                      release the funds ? 4. If there is somehow
                                      another wallet found on my name that you
                                      will NOT automaticly associate it. I want
                                      to whithdrawal the funds from the wallet (
                                      except the tax hold amount) before any
                                      other procedure maybe existing and
                                      pending. Thank you for being clear and
                                      confirming /answering the questions.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-05T08:14:36.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ab4647f-d9c7-467c-8b83-646592e5f3a5"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Astrid"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Astrid&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      I want to cancel the association of funds
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi, I appreciate that you associate back
                                      the lost funds but I want first to
                                      withdraw my money from the wallet. So
                                      please cancel the pending transaction. I
                                      will update you when I want to complete
                                      it.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-05T08:12:45.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aacca26-195a-4a1c-a1c1-ccaabfb9e8bc"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Astrid"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Astrid&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Change of wallet address</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi, I have seen your response in the
                                      previous chat. The message you send
                                      yesterday was AFTER the transaction was
                                      already innitiated in Bit2me. So what to
                                      do ? Please take responsability and
                                      recover the funds
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-05T08:14:43.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aa0a5b9-fe59-45b6-903b-f2b47e95c53b"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ortner Franz"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ortner Franz&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>BTC nicht angekommen</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Ich habe BTC von Coinbase geschickt an
                                      meine Adresse Kommen aber nicht an oder
                                      sind nicht im Guthaben
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-16T16:46:32.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aa0c6b5-e722-4cc8-80ee-a59694c410ae"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ortner Franz"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ortner Franz&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Antwort</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Warum bekomme ich keine Antwort auf: Warum
                                      kann ich meine BTC nicht abheben ???
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-02T16:23:34.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a8494b7-ea23-4d9e-b6ed-ac7755f5993f"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ortner Franz"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ortner Franz&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Wieso habe ich keinen zugriff auf meine
                                      BTC
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hallo ! Warum habe ich keinen Zugriff auf
                                      meine BTC die ich auf meine Adresse
                                      bekommen habe
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-26T15:49:52.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a7673c7-a3da-4d12-a9e0-d0c784671c81"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ortner Franz"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ortner Franz&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Wieso werden keine Wallet Adressen
                                      generiert
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Die Generierung der Adressen funktioniert
                                      nicht
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-10-26T15:57:09.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a6a7a2b-3f48-40c8-859a-032b0861ee95"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="tkroetch"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=tkroetch&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>authorization</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      how to I authorize a transactions
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-22T15:25:55.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aacbbc8-c7fe-48d1-8c58-6b35fda302ad"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="tkroetch"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=tkroetch&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      have a transactions how do I continue???
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Have a transaction, how do I continue
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-22T14:34:44.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aaca97a-5166-48af-8402-b526d4c68b72"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="stcyvon"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=stcyvon&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>PENDING</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      What is needed to authorize the release of
                                      these funds.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-02T17:44:15.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a84b193-3b4e-4089-9118-e806bc79bbaa"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Briney10"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Briney10&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>BTC withdrawal failed</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi, I want to withdraw my BTC to my
                                      exchange wallet NDAX and it failed. What
                                      is the reason why it failed?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-04T14:08:17.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ac4c3d4-2611-4cb9-9095-552b1606d414"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="WendyM"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=WendyM&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Is there someone to chat to please
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Can I please talk to a support person
                                      please. Thanks
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-09T13:16:48.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a9266d0-4ac8-4b65-9707-3664da7df95c"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="bengan"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=bengan&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>BTC pending transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      hello. i have started a process of
                                      releasing my funds from the blockchain. my
                                      agent is MIKE. L. my BTC is pending. what
                                      is the next step.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-13T11:56:42.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a9a561b-9f32-4630-a070-3a3509bc233a"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="djmornan"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=djmornan&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Withdrawal</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Why is my withdrawal still pending after 9
                                      days!!!! Please advise on this asap. Thank
                                      you!
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-11T17:11:22.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ad31a31-17cf-4caf-9630-b842d59906f5"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="djmornan"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=djmornan&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>My deposit has not arrived?</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      November 16, 2023 0.00255508 BTC BITCOIN
                                      To Address:
                                      bc1qftr5m36lfpsjpxvgg992gt556sy6ve99emfunv
                                      Ticket ID: 872264 Fees: 0.000399 BTC 9:41
                                      PM Date: 11/16/23, 9:41 PM Status: Fully
                                      Processed Network: BITCOIN TxID:
                                      b4ed38ee8f484df640fa5acbbf711fd3e7db8cf15f95ee2ad95707b2d447523b
                                      Ticket ID: 872264 To Address:
                                      bc1qftr5m36lfpsjpxvgg992gt556sy6ve99emfunv
                                      Comment: Transfer from NDAX to integrate
                                      account
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-18T14:41:41.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aa4a007-1fb5-4d9a-83a5-c05023dd4186"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="djmornan"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=djmornan&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      How can I preform an authorization to
                                      release pending funds
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      There are funds in my account that I need
                                      to release please advise steps.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-22T16:31:08.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9a9eae7b-ab5b-4316-8bcc-c013ff9e36e7"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Tib1234"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Tib1234&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Why I can’t see the blockchain
                                      transactions?
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Please let me know when I can see the
                                      money?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-21T09:35:52.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aaa3b9d-3ec3-44f6-9219-19a5dbddb3d4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Peter Isaksson"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Peter Isaksson&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Rewdaual</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      How do i do a rewdraual from my accont?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-30T13:54:07.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9abcb2d3-b52b-471d-a4c5-bfb364caaeab"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Peter Isaksson"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Peter Isaksson&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      I don't have enough money to complete
                                      authorization
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Please, I sent a bank statement, help me
                                      with the authorization amount, I don't
                                      have the required amount
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-21T14:00:21.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aaa9a32-d9cf-4f82-8558-5862991c4f23"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Sharose"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Sharose&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Not received transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I sent a transaction from my other crypto
                                      account to this . It has not shown up .
                                      But it shows on the block chain it's been
                                      received. For 500$ . What happened ?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-21T19:19:07.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aab0c33-0de1-4cb2-b881-da9b159155f5"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="FDankwarth"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=FDankwarth&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Are you no longer getting answers to your
                                      questions?
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I asked several questions in the other two
                                      tickets and have not received any response
                                      so far.
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-29T12:11:49.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aba8b41-f665-4a93-8af1-fbb4aa2fb6aa"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="FDankwarth"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=FDankwarth&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Withdraw</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I only want to withdraw the 0.027511 BTC
                                      that I deposited myself. How does it work?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-24T13:34:19.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ab099d6-ed01-4e95-8dc8-9137cce267d1"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="FDankwarth"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=FDankwarth&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Withdrawal problems</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I have requested two different withdrawals
                                      and neither is coming through. Why is
                                      that?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-22T18:03:26.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aacf41d-ce4f-46de-816e-6ad267d5ccc4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="FDankwarth"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=FDankwarth&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>How can i Cash out the Money</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>What i Need to do?</span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-23T15:40:06.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aac4e13-cd57-495f-b3de-1a6af29f3f19"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Aldenh50"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Aldenh50&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      My transaction is just pending,why is it
                                      taking so long to approve
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-23T13:25:30.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aae93b4-414e-42a1-b931-efcf90eec68f"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Yann74"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Yann74&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>transaction</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      I'm trying to send some BTC back to
                                      Binance and why does it still pending? I
                                      should received another transaction but
                                      still in pending since yesterday. Can you
                                      also help me to be able to closes those
                                      two transactions? regards, Yann Personnic
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-28T13:41:32.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ab8a85c-42fa-4dbc-9e99-1689ea5078d7"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="colin1"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=colin1&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>create a link</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>Closed</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      do i have to create a link on block chain
                                      to verify its me
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-29T09:04:51.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ab6ca54-8867-45fa-a20d-344b79a19679"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="colin1"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=colin1&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      do i have to creat alink on blockchain
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      in order do i have to creat a link on
                                      block chain to verify its me
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-27T15:23:25.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ab6c9ce-e619-4f01-8261-190b8d98cd89"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="Ngxatheleni"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=Ngxatheleni&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      How can I withdraw the funds in my
                                      account. What do I need to do?
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by User</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      How can I withdraw the funds in my
                                      account. What do I need to do?
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-27T11:53:28.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ab67eb9-5933-4422-b327-45acdbd8bf19"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="112 Cheldon78"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=112 Cheldon78&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>Hi pls release my funds</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hello I demand that my funds be released
                                      to me by order of my agent Jack so pls
                                      assist us in the matter
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-05T15:39:28.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ac6e76b-d4eb-4746-9662-3881753b1e3e"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="112 Cheldon78"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=112 Cheldon78&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Hi how much funds can I transfer to
                                      activate my acc
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      Hi what is the procedure for me to receive
                                      my funds and what do I do to reinvest
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-12-05T15:26:33.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9ac6e2cd-62ae-4277-a663-899c59bc633a"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="112 Cheldon78"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=112 Cheldon78&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>
                                      Hi can someone pls assist how do I make a
                                      withdrawal on my account
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      ? What is the procedure to make to a
                                      withdrawal and to reinvest can someone pls
                                      assist
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-30T11:25:11.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9abc7d8f-cd6e-49f2-aab4-d021ffb646e4"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="flex flex-col gap-4 sm:flex-row border mb-3 dark:border-gray-700 pt-6 bg-white dark:bg-gray-800 shadow-sm rounded-md p-4">
                                <div
                                  className="relative inline-flex shrink-0 items-center justify-center outline-none h-16 w-16 rounded-full"
                                  data-tooltip="112 Cheldon78"
                                >
                                  <div className="flex h-full w-full items-center justify-center overflow-hidden text-center transition-all duration-300 rounded-full">
                                    <img
                                      src="https://api.dicebear.com/6.x/pixel-art/svg?seed=112 Cheldon78&options[mood][]=happy"
                                      className="max-h-full max-w-full object-cover shadow-sm dark:border-transparent h-16 w-16"
                                    />
                                    {/**/}
                                    {/**/}
                                  </div>
                                  {/**/}
                                  {/**/}
                                </div>
                                <div className="max-w-md">
                                  <h3 className="font-heading text-base font-medium leading-normal leading-normal text-muted-800 dark:text-muted-100 mb-1">
                                    <span>How Do I withdraw my funds</span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md bg-primary-500 dark:bg-primary-500 text-white ml-2">
                                      <span>In Progress</span>
                                    </span>
                                    <span className="inline-block px-3 font-sans transition-shadow duration-300 py-1.5 text-xs rounded-md ml-2">
                                      <span>Last Message by Admin</span>
                                    </span>
                                  </h3>
                                  <p className="font-alt text-sm font-normal leading-normal leading-normal text-muted-500 dark:text-muted-400 mb-1">
                                    <span>
                                      ? What do I need to do in order to receive
                                      my funds
                                    </span>
                                  </p>
                                  <p className="font-alt text-xs font-normal leading-normal leading-normal text-muted-400">
                                    <span>
                                      Updated 2023-11-29T10:40:14.000000Z
                                    </span>
                                  </p>
                                </div>
                                <div className="w-full sm:ms-auto sm:w-auto">
                                  <a
                                    data-v-71bb21a6
                                    href="/admin/tickets/9aba6a80-f6e3-4a8f-b4fb-246632cb57bb"
                                    className="is-button rounded is-button-default w-full sm:w-auto"
                                    disabled="false"
                                  >
                                    <span>View</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="inline-flex w-full flex-col md:flex-row md:justify-between">
                        <ul className="border-muted-200 bg-muted-100 dark:border-muted-600 dark:bg-muted-700 mb-4 inline-flex flex-wrap gap-2 border p-1 md:mb-0 md:gap-1 rounded-xl">
                          <li>
                            <a
                              aria-current="page"
                              href="/admin/tickets"
                              className="router-link-active router-link-exact-active flex h-10 w-10 items-center justify-center border font-sans text-sm transition-all duration-300 bg-primary-500 border-primary-500 shadow-primary-500/50 dark:shadow-primary-500/20 text-white shadow-sm rounded-xl"
                              tabIndex={0}
                            >
                              1
                            </a>
                          </li>
                          {/**/}
                          {/**/}
                          {/**/}
                        </ul>
                        <div className="border-muted-200 bg-muted-100 dark:border-muted-600 dark:bg-muted-700 flex items-center justify-end gap-1 border p-1 rounded-xl">
                          <a
                            aria-current="page"
                            href="/admin/tickets"
                            className="router-link-active router-link-exact-active border-muted-200 text-muted-500 hover:bg-muted-100 hover:text-muted-700 dark:border-muted-700 dark:bg-muted-800 dark:hover:bg-muted-900 dark:hover:text-muted-400 flex h-10 w-full items-center justify-center bg-white font-sans text-sm transition-all duration-300 md:w-10 rounded-xl"
                            tabIndex={0}
                          >
                            <svg
                              data-v-cd102a71
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              aria-hidden="true"
                              role="img"
                              className="icon block h-4 w-4"
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
                                d="m15 18l-6-6l6-6"
                              />
                            </svg>
                          </a>
                          <a
                            aria-current="page"
                            href="/admin/tickets"
                            className="router-link-active router-link-exact-active border-muted-200 text-muted-500 hover:bg-muted-100 hover:text-muted-700 dark:border-muted-700 dark:bg-muted-800 dark:hover:bg-muted-900 dark:hover:text-muted-400 flex h-10 w-full items-center justify-center bg-white font-sans text-sm transition-all duration-300 md:w-10 rounded-xl"
                            tabIndex={0}
                          >
                            <svg
                              data-v-cd102a71
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              aria-hidden="true"
                              role="img"
                              className="icon block h-4 w-4"
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
                                d="m9 18l6-6l-6-6"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
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

              <div className="absolute right-[0.2em] top-[0.2em] z-20 flex items-center justify-center transition-all duration-300 translate-x-0 translate-y-0">
                <a
                  aria-current="page"
                  href="/#"
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
                </a>
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
    </div>
  );
};

export default AdminTickets;
