const app = require("./app");
const User = require('./models/userModel');
const PendingActivationEmail = require('./models/pendingActivationEmail');
const FailedEmail = require('./models/failedEmail');
const sendEmail = require('./utils/sendEmail');
const cron = require('node-cron');
var bodyParser = require("body-parser");
const { errorMiddleware } = require("./middlewares/errorMiddleware");
// Database connect
app.use(bodyParser.urlencoded({ extended: true }));
const database = require("./config/database");
database();

const cloudinary = require("cloudinary");
const http = require('http');
const { Server } = require('socket.io');

app.get("/", async (req, res) => {
  res.send("working");
});
let PORT = process.env.PORT || 4000;
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.use(errorMiddleware);

// User online status checker
setInterval(async () => {
  const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

  await User.updateMany(
    { lastActivity: { $lt: threeMinutesAgo }, online: true },
    { $set: { online: false, lastOnline: new Date() } }
  ); 
}, 60 * 1000); // Check every 1 minute

// Start server
let server = app.listen(process.env.PORT, () => {
  console.log(`server is running at ${process.env.PORT}`);
});

// ✅ Setup Socket.io for real-time email queue updates
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL || "http://localhost:3000",
    credentials: true
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected to socket:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Make io available globally for emitting events
global.io = io;

// Initialize VoIP agent
const WebRTCVoiceAgent = require('./voip/webrtcVoiceAgent');
let voipAgent = null;
try {
    voipAgent = new WebRTCVoiceAgent();
    global.voipAgent = voipAgent;
    console.log('✅ VoIP agent initialized successfully');
} catch (error) {
    console.error('❌ Failed to initialize VoIP agent:', error);
    console.error('   VoIP calling features will not be available');
}

// ✅ Background Email Queue Processor (runs automatically)
const processEmailQueue = async () => {
  try {
    // Get pending emails (limit to prevent overload)
    const pendingEmails = await PendingActivationEmail.find({
      status: 'pending'
    }).limit(50).lean();

    if (pendingEmails.length === 0) {
      // No pending emails - check for stuck processing ones
      const stuckProcessing = await PendingActivationEmail.find({ status: 'processing' });
      if (stuckProcessing.length > 0) {
        console.log(`⚠️ Found ${stuckProcessing.length} emails stuck in processing - resetting to pending`);
        await PendingActivationEmail.updateMany(
          { status: 'processing' },
          { status: 'pending' }
        );
      }
      return;
    }

    console.log(`📤 [WORKER] Processing ${pendingEmails.length} pending emails...`);
    
    let sentCount = 0;
    let failedCount = 0;

    for (const pending of pendingEmails) {
      console.log(`\n📧 [${sentCount + failedCount + 1}/${pendingEmails.length}] Processing: ${pending.email}`);
      
      // ✅ Declare emailMessage and attempt counter OUTSIDE try-catch so accessible in both blocks
      const emailSubject = 'Account Activated - Login Credentials';
      const emailMessage = `
Hello ${pending.firstName} ${pending.lastName},

Your account has been activated!

Login Credentials:
Email: ${pending.email}
Password: ${pending.password}

Please login and change your password.

Best regards,
Admin Team
      `;
      
      let currentAttempts = pending.attempts || 0;
      
      try {
        console.log(`   ├─ Step 1: Marking as processing...`);
        // Mark as processing
        const updated = await PendingActivationEmail.findByIdAndUpdate(
          pending._id, 
          {
            status: 'processing',
            lastAttempt: new Date(),
            $inc: { attempts: 1 }
          },
          { new: true }
        );
        
        if (!updated) {
          console.error(`   ├─ ❌ Failed to update status (email might have been processed already)`);
          continue;
        }
        
        currentAttempts = updated.attempts;  // ✅ Store attempts for use in catch block
        console.log(`   ├─ Step 2: Status marked as processing (attempt #${currentAttempts})`);
        console.log(`   ├─ Step 3: Sending email...`);
        
        // ✅ sendEmail expects: (email, subject, text) - not an object!
        await sendEmail(
          pending.email,
          emailSubject,
          emailMessage
        );

        console.log(`   ├─ Step 4: Email sent successfully! ✅`);
        
        // Success - remove from pending
        console.log(`   ├─ Step 5: Removing from pending queue...`);
        const deleted = await PendingActivationEmail.deleteOne({ _id: pending._id });
        
        if (deleted.deletedCount === 0) {
          console.error(`   ├─ ⚠️ Warning: Email not found in queue (might have been deleted already)`);
        } else {
          console.log(`   └─ ✅ Email removed from queue`);
        }
        
        sentCount++;

        // Emit socket event for real-time update
        if (global.io) {
          const queueStatus = await getEmailQueueStatusData();
          global.io.emit('emailQueueUpdate', queueStatus);
          console.log(`   └─ 📡 Socket.io update emitted (pending: ${queueStatus.pending}, failed: ${queueStatus.failed})`);
        }

      } catch (error) {
        failedCount++;
        
        console.log(`   ├─ ❌ Error occurred while sending email`);
        
        // Extract detailed error message
        let errorMessage = 'Unknown error';
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.code) {
          errorMessage = `Error code: ${error.code}`;
        }
        
        console.error(`   ├─ Error message: ${errorMessage}`);
        console.error(`   ├─ Error code: ${error.code}`);
        console.error(`   ├─ Full error:`, error);
        
        console.log(`   ├─ Step 6: Moving to failed emails collection...`);
        
        try {
          // Move to failed emails collection with ALL required fields matching the schema
          const failedEmailData = {
            email: pending.email,
            subject: emailSubject,  // ✅ Required - now accessible from outer scope
            text: emailMessage,  // ✅ Required - now accessible from outer scope
            leadName: `${pending.firstName} ${pending.lastName}`,
            failureReason: errorMessage,
            errorType: error.code === 'EAUTH' || errorMessage.includes('authentication') || errorMessage.includes('rate limit') 
                        ? 'authentication' 
                        : errorMessage.includes('timeout') 
                        ? 'timeout' 
                        : errorMessage.includes('quota')
                        ? 'quota_exceeded'
                        : 'other',
            retryCount: currentAttempts,  // ✅ Use variable from outer scope
            lastRetryAt: new Date(),
            status: 'pending',
            userId: pending.userId,
            activationSessionId: ''
          };
          
          console.log(`   ├─ Creating failed email with data:`, JSON.stringify({
            email: failedEmailData.email,
            subject: failedEmailData.subject ? 'present' : 'missing',
            text: failedEmailData.text ? `${failedEmailData.text.substring(0, 50)}...` : 'missing',
            errorType: failedEmailData.errorType,
            retryCount: failedEmailData.retryCount
          }));
          
          const failedEmail = await FailedEmail.create(failedEmailData);
          
          console.log(`   ├─ ✅ Added to failed emails collection (ID: ${failedEmail._id})`);

          // Remove from pending
          console.log(`   ├─ Step 7: Removing from pending queue...`);
          await PendingActivationEmail.deleteOne({ _id: pending._id });
          console.log(`   └─ ✅ Removed from pending queue`);

          // Emit socket event
          if (global.io) {
            const queueStatus = await getEmailQueueStatusData();
            global.io.emit('emailQueueUpdate', queueStatus);
            console.log(`   └─ 📡 Socket.io update emitted (failed count: ${queueStatus.failed})`);
          }
        } catch (cleanupError) {
          console.error(`   └─ ❌ ERROR during cleanup:`, cleanupError);
          // Even if cleanup fails, try to remove from pending to prevent infinite loop
          try {
            await PendingActivationEmail.deleteOne({ _id: pending._id });
            console.log(`   └─ ⚠️ Force removed from pending queue to prevent stuck state`);
          } catch (forceDeleteError) {
            console.error(`   └─ 💥 CRITICAL: Cannot remove from pending queue:`, forceDeleteError);
          }
        }
      }

      // Small delay to prevent rate limiting (100ms between emails)
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (sentCount > 0 || failedCount > 0) {
      console.log(`\n✅ [WORKER] Batch complete: ${sentCount} sent, ${failedCount} failed`);
    }

  } catch (error) {
    console.error('❌ [WORKER] Error processing email queue:', error);
  }
};

// Helper function to get queue status data
const getEmailQueueStatusData = async () => {
  const pendingCount = await PendingActivationEmail.countDocuments({ status: 'pending' });
  const processingCount = await PendingActivationEmail.countDocuments({ status: 'processing' });
  const failedCount = await FailedEmail.countDocuments();
  
  return {
    pending: pendingCount,
    processing: processingCount,
    failed: failedCount,
    total: pendingCount + processingCount,
    timestamp: new Date()
  };
};

// ✅ Cleanup stuck 'retrying' statuses on server startup
(async () => {
  try {
    const result = await FailedEmail.updateMany(
      { status: 'retrying' },
      { $set: { status: 'pending' } }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`\n🧹 Reset ${result.modifiedCount} stuck 'retrying' status(es) to 'pending'\n`);
    }
  } catch (err) {
    console.error('❌ Error resetting stuck retrying statuses:', err);
  }
})();

// ✅ Start background email queue processor (runs every 30 seconds)
console.log('\n📧 ========================================');
console.log('📧 Starting background email queue processor...');
console.log('📧 ========================================\n');

// Show initial queue status
getEmailQueueStatusData().then(status => {
  console.log('📊 Initial queue status:');
  console.log(`   ├─ Pending: ${status.pending}`);
  console.log(`   ├─ Processing: ${status.processing}`);
  console.log(`   ├─ Failed: ${status.failed}`);
  console.log(`   └─ Total: ${status.total}\n`);
}).catch(err => {
  console.error('❌ Error getting initial status:', err);
});

setInterval(processEmailQueue, 30000); // Every 30 seconds

// Run once immediately on startup
processEmailQueue().then(() => {
  console.log('\n📧 ========================================');
  console.log('📧 Initial email queue check complete');
  console.log('📧 Worker will run every 30 seconds');
  console.log('📧 ========================================\n');
}).catch(err => {
  console.error('❌ Error in initial email queue check:', err);
});

// ✅ Cron job: Delete 'sent' emails older than 10 days (runs daily at midnight)
// Scheduled calls cron job - check every minute
cron.schedule('* * * * *', async () => {
    try {
        if (!global.voipAgent) return;
        
        const getCallModel = require('./crmDB/models/callModel');
        const Call = await getCallModel();
        
        // Find scheduled calls that should be executed now
        const now = new Date();
        const scheduledCalls = await Call.find({
            status: 'scheduled',
            scheduledAt: { $lte: now }
        }).limit(10); // Process max 10 at a time
        
        for (const call of scheduledCalls) {
            try {
                // Update status to ringing
                call.status = 'ringing';
                call.startedAt = new Date();
                await call.save();
                
                // Emit Socket.io event
                if (global.io) {
                    global.io.emit('call:status:update', {
                        callId: call._id,
                        sessionId: call.sessionId,
                        leadId: call.leadId,
                        status: 'ringing'
                    });
                }
                
                // Initiate call
                await global.voipAgent.makeCall(call.phoneNumber, 'shimmer', null, { leadId: call.leadId });
                
                // Update to in-progress after a delay
                setTimeout(async () => {
                    const updatedCall = await Call.findById(call._id);
                    if (updatedCall && updatedCall.status === 'ringing') {
                        updatedCall.status = 'in-progress';
                        await updatedCall.save();
                        
                        if (global.io) {
                            global.io.emit('call:status:update', {
                                callId: call._id,
                                sessionId: call.sessionId,
                                leadId: call.leadId,
                                status: 'in-progress'
                            });
                        }
                    }
                }, 2000);
                
            } catch (error) {
                console.error(`Error executing scheduled call ${call._id}:`, error);
                call.status = 'failed';
                call.endedAt = new Date();
                await call.save();
            }
        }
    } catch (error) {
        console.error('Error in scheduled calls cron:', error);
    }
});

cron.schedule('0 0 * * *', async () => {
  try {
    console.log('\n🧹 ========================================');
    console.log('🧹 Running cleanup: Deleting old sent emails');
    console.log('🧹 ========================================\n');
    
    // Calculate date 10 days ago
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    // Delete emails with status 'sent' that are older than 10 days
    const result = await FailedEmail.deleteMany({
      status: 'sent',
      sentAt: { $lt: tenDaysAgo }
    });
    
    console.log(`🗑️ Cleanup complete: Deleted ${result.deletedCount} old 'sent' emails (older than 10 days)`);
    console.log(`📅 Cutoff date: ${tenDaysAgo.toISOString()}\n`);
    
  } catch (error) {
    console.error('❌ Error in cleanup cron job:', error);
  }
});

console.log('✅ Cron job scheduled: Old sent emails cleanup (daily at midnight)\n');
