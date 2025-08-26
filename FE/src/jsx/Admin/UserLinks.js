import React, { useEffect, useState } from "react";
import SideBar from "../layouts/AdminSidebar/Sidebar";

import {
  getLinksApi,
  updateLinksApi,
} from "../../Api/Service";
import { Link, useNavigate } from "react-router-dom";

import { useAuthUser } from "react-auth-kit";

import "react-responsive-modal/styles.css";
import AdminHeader from "./adminHeader";
import { toast } from "react-toastify";
const UserLinks = () => {

  let authUser = useAuthUser();
  let Navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNew, setLoadingNew] = useState(false);

  // Fetch links on mount
  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try { 
      const data = await getLinksApi();
      console.log('data: ', data);
      setLinks(data.links);
      setLoadingNew(false)

    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLink = async (id, currentStatus) => {
    try {
      let enabled = !currentStatus 
      const linkData = await updateLinksApi(id, enabled)
      console.log('linkData: ', linkData);
      setLoadingNew(true)
      // await patch(`/api/links/${id}`, { enabled: !currentStatus }); // 👈 backend update
      console.log('linkData.success: ', linkData.success);
      if (linkData.success) {
        toast.success("link status updated")
        fetchLinks()
      } else {
        setLoadingNew(false)
      }
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
    }
  };


  useEffect(() => {
    if (authUser().user.role === "user") {
      Navigate("/dashboard");
      return;
    }
  }, []);
  const [Active, setActive] = useState(false);
  let toggleBar = () => {
    if (Active === true) {
      setActive(false);
    } else {
      setActive(true);
    }
  };

  return (
    <div className="admin">
      <div>
        <div className="bg-muted-100 dark:bg-muted-900 pb-20">
          <SideBar state={Active} toggle={toggleBar} />
          <div className="bg-muted-100 dark:bg-muted-900 relative min-h-screen w-full overflow-x-hidden px-4 transition-all duration-300 xl:px-10 lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]">
            <div className="mx-auto w-full max-w-7xl">
              <AdminHeader toggle={toggleBar} pageName=" Users Management" />
              <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Manage Links</h1>

                {!loading && <table className="w-full border-collapse bg-white shadow rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-3">Name</th>
                      <th className="p-3">Path</th>
                      <th className="p-3">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr key={link._id} className="border-b">
                        <td className="p-3">{link.name}</td>
                        <td className="p-3">{link.path}</td>
                        <td className="p-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={link.enabled}
                              onChange={() => toggleLink(link._id, link.enabled)}
                              className="sr-only"
                            />
                            <button style={{opacity:loadingNew?'0.8':"1"}} onClick={() => toggleLink(link._id, link.enabled)} disabled={loadingNew}><div
                              className={`toggleit ${link.enabled ? "active" : ""}`}

                            ></div></button>

                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserLinks;
