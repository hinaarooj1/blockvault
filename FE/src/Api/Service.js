import {
  deleteApi,
  getApi,
  postApi,
  putApi,
  patchApi,
  postFormApi,
  patchFormApi,getBlobApi,
  postFormStreamApi
} from "./axiosService";
import { baseUrl } from "../utils/Constant";

export const registerApi = (data) => {
  return postApi("register", data);
};
export const registerSubAdminApi = (data) => {
  return postApi("registerSubAdmin", data);
};
export const addUserByEmailApi = (data) => {
  return postApi("addUserByEmail", data);
};
export const exportExcelApi = () => {
  return getApi("exportExcel");
};
export const loginApi = (data) => {
  return postApi("login", data);
};
export const userCryptoCardApi = (data) => {
  return postApi("userCryptoCard", data);
};
export const logoutApi = (data) => {
  return getApi("logout", data);
};

export const allUsersApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`allUser${queryString ? `?${queryString}` : ''}`, {});
};
export const getCoinsUserApi = (id) => {
  return getApi(`getCoinsUser/${id}`);
};
export const signleUsersApi = (id) => {
  return getApi(`singleUser/${id}`);
};
export const getNotificationsApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`getNotifications${queryString ? `?${queryString}` : ''}`);
};
export const deleteTransactionApi = (userId, id) => {
  return getApi(`deleteTransaction/${userId}/${id}`);
};
export const getHtmlDataApi = () => {
  return getApi(`getHtmlData`);
};
export const setHtmlDataApi = (data) => {
  return patchApi(`setHtmlData`, data);
};
export const updateSignleUsersApi = (id, data) => {
  return postApi(`updateSingleUser/${id}`, data);
};
export const applyCreditCardApi = (data) => {
  return postApi(`applyCreditCard`, data);
};
export const updateOldUserCoins = () => {
  return patchApi(`updateCoins`);
};
export const updateSignleUsersStatusApi = (id, data) => {
  return postApi(`updateSingleUserStatus/${id}`, data);
};
export const sendEmailCodeApi = (data) => {
  return postApi(`sendEmail`, data);
};
export const bypassSingleUserApi = (id) => {
  return patchApi(`bypassSingleUser/${id}`);
};
export const getCoinsApi = (id) => {
  return getApi(`getCoins/${id}`);
};

export const patchCoinsApi = (id) => {
  return patchApi(`addCoins/${id}`);
};
export const updateCoinAddressApi = (id, data) => {
  return patchApi(`updateCoinAddress/${id}`, data);
};
export const updateNewCoinAddressApi = (id, data) => {
  return patchApi(`updateNewCoinAddress/${id}`, data);
};
export const createTransactionApi = (id, data) => {
  return patchApi(`createTransaction/${id}`, data);
};
export const createUserStocksApi = (id, data) => {
  return postApi(`createUserStocks/${id}`, data);
};
export const createUserTransactionApi = (id, data) => {
  return patchApi(`/createUserTransaction/${id}`, data);
};
export const createUserTransactionWithdrawSwapApi = (id, data) => {
  return patchApi(`/createUserTransactionWithdrawSwap/${id}`, data);
};
export const markTrxCloseApi = (id, Coinid) => {
  return patchApi(`/markTrxClose/${id}/${Coinid}`);
};
export const createUserTransactionDepositSwapApi = (id, data) => {
  return patchApi(`/createUserTransactionDepositSwap/${id}`, data);
};

export const updateTransactionApi = (id, data) => {
  return patchApi(`updateTransaction/${id}`, data);
};
export const getTransactionsApi = () => {
  return getApi(`getTransactions`);
};
export const getEachUserApi = (id, data) => {
  return getApi(`getEachUser/${id}`, data);
};
export const getUserCoinApi = (id, data) => {
  return getApi(`getUserCoin/${id}`, data);
};
export const updateNotificationStatusApi = (id, status) => {
  return getApi(`updateNotificationStatus/${id}/${status}`);
};
export const verifySingleUserApi = (data) => {
  return patchFormApi(`verifySingleUser`, data);
};
export const getsignUserApi = (data) => {
  return patchApi(`getsignUser`, data);
};
export const verifyEmailApi = (data) => {
  return getApi(`${data.id}/verify/${data.token}`, data);
};
export const deleteEachUserApi = (id) => {
  return deleteApi(`deleteEachUser/${id}`, id);
};
export const UnassignUserApi = (id) => {
  return deleteApi(`UnassignUser/${id}`);
};
export const deleteUserStocksApi = (coindId, id) => {
  return deleteApi(`deleteUserStocksApi/${id}/${coindId}`, id, coindId);
};
export const deleteUserTokensApi = (coindId, id) => {
  return deleteApi(`deleteUserTokens/${id}/${coindId}`, id, coindId);
};
export const updateKycApi = (id, data) => {
  return patchApi(`updateKyc/${id}`, data);
};
export const sendTicketApi = (data) => {
  return postApi(`sendTicket`, data);
};
export const uploadFilesApi = (id, data) => {
  return postFormApi(`uploadFiles/${id}`, data);
};
export const getAllDataApi = (id) => {
  return getApi(`getAllData/${id}`);
};
export const deleteSingleFileApi = (_id) => {
  return getApi(`deleteSingleFile/${_id}`);
};
export const PaymentsApi = (id, data) => {
  return patchApi(`createAccount/${id}`, data);
};

export const addCardApi = (id, data) => {
  return patchApi(`addCard/${id}`, data);
};
export const deletePaymentApi = (id, pId) => {
  return getApi(`deletePayment/${id}/${pId}`);
};
export const createTicketApi = (data) => {
  return postApi(`createTicket`, data);
};
export const getUserTicketsApi = (id) => {
  return getApi(`getUserTickets/${id}`);
};
export const getIndivTicketApi = (id, ticketId) => {
  return getApi(`getIndivTicket/${id}/${ticketId}`);
};
export const adminTicketsApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`admin/tickets${queryString ? `?${queryString}` : ''}`);
};
export const updateMessageApi = (ticketData) => {
  return patchApi(`updateMessage`, ticketData);
};
export const getStocksApi = () => {
  return getApi(`stocks`);
};
export const addNewStockApi = (data) => {
  return postApi(`addNewStock`, data);
};
export const updateStockApi = (stockId, stockData) => {
  return patchApi(`stocks/${stockId}`, stockData);
};
export const updateTokenApi = (tokenId, tokenData) => {
  return patchApi(`tokens/${tokenId}`, tokenData);
};
export const deleteStockApi = (stockId) => {
  return deleteApi(`stocks/${stockId}`);
};
export const getLinksApi = () => {
  return getApi(`getLinks`);
};
export const updateLinksApi = (id, enabled) => {
  return putApi(`updateLinks/${id}/${enabled}`, enabled);
};
export const deleteTicketApi = (id) => {
  return deleteApi(`deleteTicket/${id}`,);
};
export const getStakingSettingsApi = (id) => {
  return getApi(`getStakingSettings/${id}`,);
};
export const updateStakingSettingsApi = (id, settings) => {
  return patchApi(`updateStakingSettings/${id}`, settings);
};
export const deleteAllNotificationsApi = () => {
  return deleteApi(`deleteAllNotifications`);
};
export const deleteNotificationApi = (id) => {
  return deleteApi(`deleteNotification/${id}`);
};
export const getStakingRewardsApi = (id) => {
  return getApi(`getStakingRewards/${id}/stakings`);
};
export const addMyTokensApi = (userId, data) => {
  return patchFormApi(`/addMyTokens/${userId}`, data);
};
export const getAllTokensApi = (id) => {
  return getApi(`/getAllTokens/${id}`);
};
export const getMyTokensApi = (id) => {
  return getApi(`/tokens/${id}`);
};
export const getRestrictionsApi = () => {
  return getApi(`/restrictions`);
};
export const UpdateRestrictionsApi = (data) => {
  return patchApi(`/restrictionsUpdate`, data);
};
export const UpdateSubAdminPermissionsApi = (id, body) => {
  return patchApi(`/users/${id}/permissions`, body);
};
export const UpdateAdminPermissionsApi = (id, body) => {
  return patchApi(`/admin/${id}/permissions`, body);
};

// ✅ Correct API functions
export const getErrorLogsApi = (page = 1) => {
  return getApi(`/getErrorLogs?page=${page}`);
};

// api service
export const deleteErrorLogsApi = (ids = []) => {
  const query = ids.length ? `?ids=${ids.join(",")}` : "";
  return deleteApi(`/deleteErrorLogs${query}`);
};
// CRM ROUTES/////////////////////////////////////////////////////
export const adminCrmLoginApi = (body) => {
  return postApi(`/crm/login`, body);
};
export const adminCrmLeadsApi = ({ params }) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`/crm/getLeads?${queryString}`);
};
export const createLeadApi = (leadData) => {
  return postApi(`/crm/createLead`, leadData);
};
export const uploadLeadsCsvApi = (formData) => {
  return postFormApi(`/crm/uploadLeads`, formData);
};
export const uploadLeadsCsvStreamApi = (formData, onProgress) => {
  return postFormStreamApi(`crm/uploadLeads`, formData, onProgress);
};
export const deleteLeadApi = (leadId) => {
  return deleteApi(`/crm/deleteLead/${leadId}`);
};
export const deleteLeadsBulkApi = (leadIds) => {
  return postApi(`/crm/bulkDeleteLeads`, { leadIds });
};
export const deleteAllLeadsApi = () => {
  return deleteApi(`/crm/deleteAllLeads`);
};
// Delete all leads with progress tracking (SSE)
export const deleteAllLeadsApiWithProgress = async (onProgress) => {
  try {
    const response = await fetch(`${baseUrl}/crm/deleteAllLeads?enableProgress=true`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Delete failed');
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
            
            // If complete or error, return
            if (eventData.type === 'complete') {
              return eventData;
            } else if (eventData.type === 'error') {
              throw new Error(eventData.message || 'Failed to delete leads');
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
            throw parseError;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error deleting all leads:', error);
    throw error;
  }
};
export const updateLeadApi = (leadId, leadData) => {
  return patchApi(`/crm/editLead/${leadId}`, leadData);
};
export const exportLeadsApi = (filters = {}) => {
  return getBlobApi(`/exportLeads`,filters);
};
export const assignLeadsApi = (leadIds, agentId) => {
  return postApi(`/crm/assignLeads`, { leadIds, agentId });
};
// Recycle Bin APIs
export const listDeletedLeadsApi = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`/crm/recycle/list?${queryString}`);
};
export const restoreLeadApi = (leadId) => {
  return patchApi(`/crm/recycle/restore/${leadId}`);
};
export const hardDeleteLeadApi = (leadId) => {
  return deleteApi(`/crm/recycle/hardDelete/${leadId}`);
};
export const bulkRestoreLeadsApi = (leadIds) => {
  return postApi(`/crm/recycle/bulkRestore`, { leadIds });
};
export const bulkHardDeleteLeadsApi = (leadIds) => {
  return postApi(`/crm/recycle/bulkHardDelete`, { leadIds });
};

// Restore all leads with progress tracking (SSE)
export const restoreAllLeadsApiWithProgress = async (onProgress) => {
  try {
    const response = await fetch(`${baseUrl}/crm/recycle/restoreAll`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Restore failed');
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
            
            // If complete or error, return
            if (eventData.type === 'complete') {
              return eventData;
            } else if (eventData.type === 'error') {
              throw new Error(eventData.message || 'Failed to restore leads');
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
            throw parseError;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error restoring all leads:', error);
    throw error;
  }
};

// Delete all leads with progress tracking (SSE)
export const hardDeleteAllLeadsApiWithProgress = async (onProgress) => {
  try {
    const response = await fetch(`${baseUrl}/crm/recycle/hardDeleteAll`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Delete failed');
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
            
            // If complete or error, return
            if (eventData.type === 'complete') {
              return eventData;
            } else if (eventData.type === 'error') {
              throw new Error(eventData.message || 'Failed to delete leads');
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError);
            throw parseError;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error permanently deleting all leads:', error);
    throw error;
  }
};

// Fallback API calls (without progress)
export const restoreAllLeadsApi = () => {
  return postApi(`/crm/recycle/restoreAll`);
};
export const hardDeleteAllLeadsApi = () => {
  return deleteApi(`/crm/recycle/hardDeleteAll`);
};

// Activate lead(s) to convert them into users
export const activateLeadApi = (leadId) => {
  return postApi(`/crm/activateLead/${leadId}`);
};

export const activateLeadsBulkApi = (leadIds, sessionId) => {
  return postApi(`/crm/bulkActivateLeads`, { leadIds, sessionId });
};

// Get activation progress by session ID
export const getActivationProgressApi = (sessionId) => {
  return getApi(`/crm/activation/progress/${sessionId}`);
};

// Failed emails management
export const getFailedEmailsApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`/crm/failedEmails?${queryString}`);
};

export const resendFailedEmailsApi = (emailIds) => {
  return postApi(`/crm/failedEmails/resend`, { emailIds });
};

export const deleteFailedEmailsApi = (emailIds) => {
  return postApi(`/crm/failedEmails/delete`, { emailIds });
};

// Activity/Stream APIs
export const getLeadStreamApi = (leadId) => {
  return getApi(`/crm/lead/${leadId}/stream`);
};

export const getLeadActivitiesApi = (leadId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`/crm/lead/${leadId}/activities?${queryString}`);
};

export const getLeadWithActivityApi = (leadId) => {
  return getApi(`/crm/leads/${leadId}/stream`);
};

export const addLeadCommentApi = (leadId, comment) => {
  return postApi(`/crm/lead/${leadId}/comment`, { comment });
};

// ✅ NEW: Enhanced Comment Features
export const editCommentApi = (leadId, commentId, content, editReason) => {
  return patchApi(`/crm/lead/${leadId}/comment/${commentId}/edit`, { content, editReason });
};

export const deleteCommentApi = (leadId, commentId) => {
  return deleteApi(`/crm/lead/${leadId}/comment/${commentId}/delete`);
};

export const toggleLikeCommentApi = (leadId, commentId) => {
  return postApi(`/crm/lead/${leadId}/comment/${commentId}/like`, {});
};

export const togglePinCommentApi = (leadId, commentId) => {
  return postApi(`/crm/lead/${leadId}/comment/${commentId}/pin`, {});
};

export const toggleImportantCommentApi = (leadId, commentId) => {
  return postApi(`/crm/lead/${leadId}/comment/${commentId}/important`, {});
};

export const addQuoteReplyApi = (leadId, commentId, content) => {
  return postApi(`/crm/lead/${leadId}/comment/${commentId}/quote-reply`, { content });
};

export const addNestedReplyApi = (leadId, commentId, content) => {
  return postApi(`/crm/lead/${leadId}/comment/${commentId}/reply`, { content });
};

export const getCommentHistoryApi = (leadId, commentId) => {
  return getApi(`/crm/lead/${leadId}/comment/${commentId}/history`);
};

export const getNestedRepliesApi = (leadId, commentId) => {
  return getApi(`/crm/lead/${leadId}/comment/${commentId}/replies`);
};

export const searchCommentsApi = (leadId, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`/crm/lead/${leadId}/comments/search?${queryString}`);
};

// Activate bulk leads with progress tracking (SSE) - NEW APPROACH
// This ONLY creates users, emails are queued for background processing
export const activateLeadsBulkWithProgress = async (leadIds, sendWelcomeEmail = true, onProgress) => {try {
    const response = await fetch(`${baseUrl}/crm/bulkActivateLeads`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ leadIds, sendWelcomeEmail })
    });if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response not OK:', errorText);
      throw new Error(`Activation failed: ${response.status} ${errorText}`);
    }const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.substring(6));if (onProgress) {
              onProgress(eventData);
            }
            
            if (eventData.type === 'complete') {return eventData;
            } else if (eventData.type === 'error') {
              console.error('❌ SSE error event:', eventData);
              throw new Error(eventData.message || 'Failed to activate leads');
            }
          } catch (parseError) {
            console.error('❌ Error parsing SSE data:', parseError, 'Line:', line);
            throw parseError;
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ activateLeadsBulkWithProgress error:', error);
    throw error;
  }
};

// Get email queue status
export const getEmailQueueStatusApi = () => {
  return getApi('/crm/emailQueue/status');
};

// Trigger email queue processing manually
export const processEmailQueueApi = () => {
  return postApi('/crm/emailQueue/process', {});
};

// Clear email queue (superadmin only) - Fix for stuck badges
export const clearEmailQueueApi = () => {
  return postApi('/crm/emailQueue/clear', {});
};

// ===========================
// MLM REFERRAL SYSTEM APIs
// ===========================

// Public endpoint - verify referral code
export const verifyReferralCodeApi = (code) => {
  return getApi(`referral/verify/${code}`);
};

// User endpoints
export const getMyReferralCodeApi = () => {
  return getApi('referral/my-code');
};

export const getMyReferralTreeApi = () => {
  return getApi('referral/my-tree');
};

export const getMyReferralsApi = () => {
  return getApi('referral/my-referrals');
};

export const getMyEarningsApi = () => {
  return getApi('referral/my-earnings');
};

// Admin endpoints
export const getAllReferralsAdminApi = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return getApi(`referral/admin/all${queryString ? `?${queryString}` : ''}`);
};

export const getSystemStatisticsApi = () => {
  return getApi('referral/admin/statistics');
};

export const getUserReferralDetailsApi = (userId) => {
  return getApi(`referral/admin/user/${userId}`);
};

export const activateUserAndSetCommissionApi = (userId, data) => {
  return postApi(`referral/admin/activate/${userId}`, data);
};

export const updateUserAffiliateStatusApi = (userId, data) => {
  return patchApi(`referral/admin/status/${userId}`, data);
};

export const addCommissionManuallyApi = (userId, data) => {
  return postApi(`referral/admin/commission/${userId}`, data);
};

// Call-related API functions
export const initiateCallApi = (leadId, phoneNumber) => {
  return postApi(`/crm/call/initiate`, { leadId, phoneNumber });
};

export const bulkCallLeadsApi = (leadIds, options = {}) => {
  return postApi(`/crm/call/bulk`, { leadIds, options });
};

export const scheduleCallApi = (leadId, phoneNumber, scheduledAt) => {
  return postApi(`/crm/call/schedule`, { leadId, phoneNumber, scheduledAt });
};

export const getCallStatusApi = (sessionId) => {
  return getApi(`/crm/call/status/${sessionId}`);
};

export const getCallHistoryApi = (leadId) => {
  return getApi(`/crm/call/history/${leadId}`);
};

export const cancelCallApi = (sessionId) => {
  return postApi(`/crm/call/cancel/${sessionId}`);
};

