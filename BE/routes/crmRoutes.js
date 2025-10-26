let express = require("express");

const { authorizedRoles, isAuthorizedUser, checkCrmAccess } = require("../middlewares/auth");

const singleUpload = require("../middlewares/multer");
const { uploadCSV, loginCRM, getLeads, exportLeads, createLead, deleteLead, deleteAllLeads, bulkDeleteLeads, editLead, assignLeadsToAgent, getDeletedLeads, restoreLead, hardDeleteLead, bulkRestoreLeads, bulkHardDeleteLeads, restoreAllLeads, hardDeleteAllLeads } = require("../controllers/crmController");
const { activateLead, bulkActivateLeads: bulkActivateLeadsOld, getActivationProgress, getFailedEmails, resendFailedEmails, deleteFailedEmails } = require("../controllers/activateLeads");
const { bulkActivateLeads, getEmailQueueStatus, processEmailQueueNow, clearEmailQueue } = require("../controllers/activateLeadsNew");
const { getLeadActivities, addLeadComment, getLeadWithActivity, editComment, deleteComment, toggleLike, togglePin, toggleImportant, addQuoteReply, addNestedReply, getCommentHistory, getNestedReplies, searchComments } = require("../controllers/activityController");
const multer = require('multer');

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
let router = express.Router();

router.route('/crm/login').post(loginCRM);
router.route('/crm/uploadLeads').post(isAuthorizedUser, authorizedRoles("superadmin", "admin"), checkCrmAccess, upload.single('file'), uploadCSV);
// router.route('/crm/uploadLeads').post(uploadCSV);
router.route('/crm/createLead').post(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, createLead);
router.route('/crm/getLeads').get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, getLeads);
// router.route('/crm/getLeads').get(isAuthorizedUser, authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, getLeads);
router.route('/crm/deleteLead/:id').delete(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, deleteLead);
router.route('/crm/deleteAllLeads').delete(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, deleteAllLeads);
router.route('/crm/bulkDeleteLeads').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, bulkDeleteLeads);
router.route('/crm/editLead/:id').patch(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, editLead);
// superadmin and admin (admin limited by controller checks)
router.route('/crm/assignLeads').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, assignLeadsToAgent);
router.route('/exportLeads').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, exportLeads);
// recycle bin
router.route('/crm/recycle/list').get(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, getDeletedLeads);
router.route('/crm/recycle/restore/:id').patch(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, restoreLead);
router.route('/crm/recycle/hardDelete/:id').delete(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, hardDeleteLead);
router.route('/crm/recycle/bulkRestore').post(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, bulkRestoreLeads);
router.route('/crm/recycle/bulkHardDelete').post(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, bulkHardDeleteLeads);
router.route('/crm/recycle/restoreAll').post(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, restoreAllLeads);
router.route('/crm/recycle/hardDeleteAll').delete(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, hardDeleteAllLeads);

// Activate leads - convert to users
router.route('/crm/activateLead/:leadId').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, activateLead);
router.route('/crm/bulkActivateLeads').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, bulkActivateLeads);
router.route('/crm/activation/progress/:sessionId').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, getActivationProgress);

// Email Queue management (new approach)
router.route('/crm/emailQueue/status').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, getEmailQueueStatus);
router.route('/crm/emailQueue/process').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, processEmailQueueNow);

// Clear email queue (debug/admin only)
router.route('/crm/emailQueue/clear').post(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, clearEmailQueue);

// Failed emails management
router.route('/crm/failedEmails').get(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, getFailedEmails);
router.route('/crm/failedEmails/resend').post(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, resendFailedEmails);
router.route('/crm/failedEmails/delete').post(isAuthorizedUser,
    authorizedRoles("superadmin"), checkCrmAccess, deleteFailedEmails);

// Activity/Stream routes
router.route('/crm/leads/:leadId/stream').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, getLeadWithActivity);
router.route('/crm/lead/:leadId/activities').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, getLeadActivities);
router.route('/crm/lead/:leadId/comment').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, addLeadComment);

// ✅ NEW: Enhanced Comment Features
// Edit Comment
router.route('/crm/lead/:leadId/comment/:commentId/edit').patch(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, editComment);

// Delete Comment (role-based permissions handled in controller)
router.route('/crm/lead/:leadId/comment/:commentId/delete').delete(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, deleteComment);

// Like/Unlike Comment
router.route('/crm/lead/:leadId/comment/:commentId/like').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, toggleLike);

// Pin/Unpin Comment
router.route('/crm/lead/:leadId/comment/:commentId/pin').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, togglePin);

// Mark/Unmark as Important
router.route('/crm/lead/:leadId/comment/:commentId/important').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin"), checkCrmAccess, toggleImportant);

// Quote Reply
router.route('/crm/lead/:leadId/comment/:commentId/quote-reply').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, addQuoteReply);

// Nested Reply
router.route('/crm/lead/:leadId/comment/:commentId/reply').post(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, addNestedReply);

// Get Comment Edit History
router.route('/crm/lead/:leadId/comment/:commentId/history').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, getCommentHistory);

// Get Nested Replies
router.route('/crm/lead/:leadId/comment/:commentId/replies').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, getNestedReplies);

// Search Comments
router.route('/crm/lead/:leadId/comments/search').get(isAuthorizedUser,
    authorizedRoles("superadmin", "admin", "subadmin"), checkCrmAccess, searchComments);

module.exports = router;
