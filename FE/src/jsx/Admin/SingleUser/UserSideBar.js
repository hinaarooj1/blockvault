import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";
const UserSideBar = (props) => {
  return (
    <>
      <div className="col-span-12 sm:col-span-4">
        <div className="mt-8 max-w-[240px]">
          <ul className="space-y-1 font-sans text-sm">
            <li>
              <NavLink
                aria-current="page"
                to={`/admin/users/${props.userid}/general`}
                className=" text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300"
              >
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
                  <g fill="currentColor">
                    <path
                      d="M192 96a64 64 0 1 1-64-64a64 64 0 0 1 64 64"
                      opacity=".2"
                    />
                    <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56" />
                  </g>
                </svg>
                <span>General</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/admin/users/${props.userid}/assets`}
                className=" text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300"
              >
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
                  <g fill="currentColor">
                    <path
                      d="M88 48v160H40a8 8 0 0 1-8-8V56a8 8 0 0 1 8-8Z"
                      opacity=".2"
                    />
                    <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16M40 152h16a8 8 0 0 0 0-16H40v-16h16a8 8 0 0 0 0-16H40V88h16a8 8 0 0 0 0-16H40V56h40v144H40Zm176 48H96V56h120z" />
                  </g>
                </svg>
                <span>Manage Assets</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/admin/users/${props.userid}/transactions`}
                className="text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300"
              >
                <svg
                  data-v-cd102a71
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  aria-hidden="true"
                  role="img"
                  className="icon h-4 w-4"
                  width="1em"
                  height="1em"
                  viewBox="0 0 20 20"
                >
                  <g fill="currentColor">
                    <path d="M9 2a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 0 1 2-2a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm3 4a1 1 0 0 0 0 2h.01a1 1 0 1 0 0-2zm3 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2zm-3 4a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2zm3 0a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2z"
                      clipRule="evenodd"
                    />
                  </g>
                </svg>
                <span>Manage Transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/admin/users/${props.userid}/documents`}
                className="text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300"
              >
                <i class="fa-solid fa-file text-blue me-1"></i>
                <span>User Documents</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={`/admin/users/${props.userid}/verifications`}
                className="text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300"
              >
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
                  <g fill="currentColor">
                    <path
                      d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96"
                      opacity=".2"
                    />
                    <path d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88" />
                  </g>
                </svg>
                <span>Manage Verifications</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to={`/admin/users/${props.userid}/stocks`}
                className="text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300"
              >
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
                  <g fill="currentColor">
                    <path
                      d="M224 128a96 96 0 1 1-96-96a96 96 0 0 1 96 96"
                      opacity=".2"
                    />
                    <path d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M232 128A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104m-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88" />
                  </g>
                </svg>
                <span>User Stocks</span>
              </NavLink>
            </li> */}
            {/* <li>
            <p className="text-muted-400 datas hover:text-muted-600 dark:hover:text-muted-200 hover:bg-muted-50 dark:hover:bg-muted-700/50 flex items-center gap-2 rounded-lg p-3 transition-colors duration-300">
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
                <g fill="currentColor">
                  <path
                    d="M232 96v96a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V96Z"
                    opacity=".2"
                  />
                  <path d="M224 48H32a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16m0 16v24H32V64Zm0 128H32v-88h192zm-16-24a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8m-64 0a8 8 0 0 1-8 8h-16a8 8 0 0 1 0-16h16a8 8 0 0 1 8 8" />
                </g>
              </svg>
              <span>Manage Payment Methods</span>
            </p>
          </li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserSideBar;
