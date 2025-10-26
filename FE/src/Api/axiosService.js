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
export const getBlobApi = async (endpoint, filters = {}) => {
  try {
    const response = await axiosService.get(endpoint, {
      params: filters,
      responseType: 'blob',
      withCredentials: true,
      headers: {
        'Accept': 'text/csv'
      },
      credentials: "include",
    });

    // Return the full response, not just response.data
    return response;
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

// SSE streaming for CSV upload with progress
export const postFormStreamApi = async (endpoint, data, onProgress) => {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: data // FormData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.substring(6));
            if (onProgress) {
              onProgress(eventData);
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
          }
        }
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      msg: error?.message || 'Upload failed',
    };
  }
};

export default axiosService