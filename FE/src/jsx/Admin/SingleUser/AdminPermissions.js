import React, { useEffect, useState } from "react";
import SideBar from "../../layouts/AdminSidebar/Sidebar";
import UserSideBar from "./UserSideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { patchCoinsApi, signleUsersApi, UpdateAdminPermissionsApi } from "../../../Api/Service";
import { toast } from "react-toastify";
import { useAuthUser } from "react-auth-kit";
import { Switch, CircularProgress } from "@mui/material";
import { Button } from "react-bootstrap";
import AdminHeader from "../adminHeader";
const AdminPermissions = () => {
  //

  let authUser = useAuthUser();
  let Navigate = useNavigate();

  const [isLoading, setisLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  //

  let { id } = useParams();

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

        if (signleUser.signleUser.role != "admin") {
          Navigate("/admin/dashboard")
        }
        setUserData(signleUser.signleUser);} else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setisLoading(false)
    }
  };
  const [permLoad, setPermLoad] = useState(null);
  const handlePermissionChange = async (userId, key, value) => {
    setPermLoad({ userId, key });
    try {
      let body = {
        [key]: value
      };const signleUser = await UpdateAdminPermissionsApi(userId, body);

      if (signleUser.success) {
        setUserData((prev) => ({
          ...prev,
          adminPermissions: {
            ...prev.adminPermissions,
            [key]: value,
          },
        }));

        toast.success("Permission updated success!")
      } else {
        toast.dismiss();
        toast.error(signleUser.msg);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error);
    } finally {
      setPermLoad(null);
    }
  };
  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    } else if (authUser().user.role === "admin") {
      Navigate("/admin/dashboard");
      return;
    }
    getSignleUser();

  }, []);

  // new

  return (
    <>
      <div className="admin dark-new-ui">
        <div className="bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            {/* Admin Permissions Section */}

            {isLoading ? (
              <div className="mx-auto mt-10 loading-pg w-full text-center max-w-xs">
                <div className="mx-auto mt-10 max-w-xs new">
                  <svg
                    data-v-cd102a71
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    aria-hidden="true"
                    role="img"
                    className="icon h-12 w-12 text-primary-500"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                      opacity=".25"
                    />
                    <path
                      fill="currentColor"
                      d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                    >
                      <animateTransform
                        attributeName="transform"
                        dur="0.75s"
                        repeatCount="indefinite"
                        type="rotate"
                        values="0 12 12;360 12 12"
                      />
                    </path>
                  </svg>
                </div>
                <div className="mx-auto max-w-sm">
                  <h4 className="font-heading text-xl font-medium leading-normal text-white mb-1 mt-4">
                    Loading Admin Permissions
                  </h4>
                  <p className="text-muted-300 font-sans text-sm">
                    Please wait while we load the Admin Permissions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="admin-permissions-section mb-8">
                <p className="text-2xl font-bold text-white mb-4">
                  Managing Permissions for:
                  <span className="block mt-1 text-primary-400">
                    {`${userData.firstName} ${userData.lastName || ""}`}
                  </span>
                  <span className="block text-sm text-gray-300">
                    {userData.email}
                  </span>
                </p>

                <div className="permissions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Allow Admin to see/add/manage sub admins */}
                  {[
                    { key: 'isProfileUpdate', label: 'Edit Profile', desc: "Allow administrator to edit their own profile information and settings." },
                    { key: 'isSubManagement', label: 'Manage Sub-Admins', desc: "Allow administrator to view and add sub-administrators in the system." },
                    { key: 'isEditSubManagementPermissions', label: 'Edit Sub-Admins', desc: "Allow administrator to edit sub-administrators in the system." },
                    { key: 'isAddUsersToSubAdmin', label: 'Assign/UnAssign Users to sub-Admins', desc: "Allow administrator to assign or unassign users to Sub-Admins " },
                    { key: 'isTokenManagement', label: 'User Tokens Access', desc: " Allow administrator to see or edit user tokens of all users 'My Token' page." },
                    { key: 'accessCrm', label: 'CRM Access', desc: " Allow administrator to access CRM" },
                    { key: 'canManageCrmLeads', label: 'CRM: Upload CSV & Assign Leads to Subadmins', desc: "Allow administrator to upload leads CSV and assign leads to Subadmins. Also view their own and subadmins' leads." },
                    { key: 'canManageReferrals', label: 'Referral Management', desc: "Allow administrator to access and manage the referral program, view referral statistics, activate users, and set commissions." },
                  ].map((permission) => (<div key={permission.key} className="permission-card bg-muted-800 p-6 rounded-xl shadow-lg border border-muted-700 hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        {permission.label}
                      </h3>
                      <Switch

                        disabled={
                          permLoad?.userId === userData._id && permLoad?.key === permission.key
                        }
                        onChange={(e) =>
                          handlePermissionChange(userData._id, permission.key, e.target.checked)
                        }

                        checked={userData.adminPermissions?.[permission.key] || false}

                        color="primary"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#6366f1',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#6366f1',
                          },
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-300 leading-relaxed">
                      {permission.desc}
                    </p>
                  </div>))}

                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPermissions;

