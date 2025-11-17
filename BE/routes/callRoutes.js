// routes/callRoutes.js
const express = require('express');
const router = express.Router();
const {
    initiateCall,
    bulkCallLeads,
    scheduleCall,
    getCallStatus,
    getCallHistory,
    cancelCall,
    receiveCallSummary
} = require('../controllers/callController');
const { isAuthorizedUser, authorizedRoles, checkCrmAccess } = require('../middlewares/auth');

// Manual call initiation
router.post('/crm/call/initiate', isAuthorizedUser, authorizedRoles('superadmin', 'admin', 'subadmin'), checkCrmAccess, initiateCall);

// Bulk automatic calls
router.post('/crm/call/bulk', isAuthorizedUser, authorizedRoles('superadmin', 'admin'), checkCrmAccess, bulkCallLeads);

// Schedule call
router.post('/crm/call/schedule', isAuthorizedUser, authorizedRoles('superadmin', 'admin', 'subadmin'), checkCrmAccess, scheduleCall);

// Get call status
router.get('/crm/call/status/:sessionId', isAuthorizedUser, authorizedRoles('superadmin', 'admin', 'subadmin'), checkCrmAccess, getCallStatus);

// Get call history for a lead
router.get('/crm/call/history/:leadId', isAuthorizedUser, authorizedRoles('superadmin', 'admin', 'subadmin'), checkCrmAccess, getCallHistory);

// Cancel call
router.post('/crm/call/cancel/:sessionId', isAuthorizedUser, authorizedRoles('superadmin', 'admin', 'subadmin'), checkCrmAccess, cancelCall);

// Webhook for call summary (called by VoIP bot - no auth required for internal use)
router.post('/crm/call/summary', receiveCallSummary);

module.exports = router;

