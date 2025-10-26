import axios from "axios";
import { baseUrl } from "../utils/Constant";

const axiosService = axios.create({
  baseURL: baseUrl,
});

// Endpoint: It is a specific location within API that accepts data and send it back

export const getApi = async (endpoint) => {
  try {
    const response = await axiosService.get(endpoint, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.message,
      }
    );
  }
};

export const postApi = async (endpoint, data) => {
  try {
    const response = await axiosService.post(endpoint, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.response?.data.msg,
      }
    );
  }
};
export const postFormApi = async (endpoint, data) => {
  try {
    const response = await axiosService.post(endpoint, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },

      credentials: "include",
    });
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.response?.data.msg,
      }
    );
  }
};
export const patchFormApi = async (endpoint, data) => {
  try {
    const response = await axiosService.patch(endpoint, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },

      credentials: "include",
    });
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.response?.data.msg,
      }
    );
  }
};

export const putApi = async (endpoint, data) => {
  try {
    const response = await axiosService.put(endpoint, data, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
      credentials: "include",
    });

    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.message,
      }
    );
  }
};
export const patchApi = async (endpoint, data) => {
  try {
    const response = await axiosService.patch(endpoint, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.message,
      }
    );
    //
  }
};

export const deleteApi = async (endpoint) => {
  try {
    const response = await axiosService.delete(endpoint, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        msg: error?.message,
      }
    );
  }
};
