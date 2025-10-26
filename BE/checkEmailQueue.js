/**
 * Quick script to check email queue status in database
 * Run: node checkEmailQueue.js
 */

const path = require('path');
const fs = require('fs');

// Load config.env manually
const envPath = path.join(__dirname, 'config', 'config.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      // Remove quotes if present
      value = value.replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
  console.log('✅ Loaded config.env');
} else {
  console.error('❌ config.env not found at:', envPath);
}

const mongoose = require('mongoose');

// Simple schemas (no need to require from models)
const PendingActivationEmail = mongoose.model('PendingActivationEmail', new mongoose.Schema({}, { strict: false }));
const FailedEmail = mongoose.model('FailedEmail', new mongoose.Schema({}, { strict: false }));

async function checkQueue() {
  try {
    if (!process.env.DATABASE) {
      console.error('❌ Error: DB environment variable not found!');
      console.log('💡 Make sure config.env exists in BE/config/ folder');
      process.exit(1);
    }

    console.log('\n🔌 Connecting to MongoDB...');
    console.log(`📍 Database: ${process.env.DATABASE.substring(0, 30)}...`);
    
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Count pending emails
    const pendingCount = await PendingActivationEmail.countDocuments();
    const pendingProcessing = await PendingActivationEmail.countDocuments({ status: 'processing' });
    const pendingPending = await PendingActivationEmail.countDocuments({ status: 'pending' });
    
    console.log('📊 PENDING EMAILS:');
    console.log(`   Total: ${pendingCount}`);
    console.log(`   ├─ Pending: ${pendingPending}`);
    console.log(`   └─ Processing: ${pendingProcessing}`);

    // Count failed emails
    const failedCount = await FailedEmail.countDocuments();
    console.log(`\n❌ FAILED EMAILS: ${failedCount}`);

    // Badge total
    const badgeCount = pendingCount + failedCount;
    console.log(`\n🔔 BADGE COUNT: ${badgeCount}\n`);

    if (pendingCount > 0) {
      console.log('📧 Sample Pending Emails (first 5):');
      const samples = await PendingActivationEmail.find().limit(5).select('email status attempts createdAt');
      samples.forEach((email, i) => {
        console.log(`   ${i + 1}. ${email.email} - Status: ${email.status}, Attempts: ${email.attempts}, Created: ${email.createdAt}`);
      });
    }

    if (failedCount > 0) {
      console.log('\n❌ Sample Failed Emails (first 5):');
      const samples = await FailedEmail.find().limit(5).select('email failureReason createdAt');
      samples.forEach((email, i) => {
        console.log(`   ${i + 1}. ${email.email} - Reason: ${email.failureReason?.substring(0, 50)}...`);
      });
    }

    console.log('\n💡 To clear all pending emails, run:');
    console.log('   db.pendingactivationemails.deleteMany({})');
    console.log('\n💡 To clear all failed emails, run:');
    console.log('   db.failedemails.deleteMany({})\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkQueue();

