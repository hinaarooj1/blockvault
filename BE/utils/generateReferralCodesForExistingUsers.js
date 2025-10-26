/**
 * UTILITY SCRIPT: Generate Referral Codes for Existing Users
 * ============================================================
 * 
 * This script generates unique referral codes for all existing users
 * in the database who don't already have one.
 * 
 * Usage:
 *   node BE/utils/generateReferralCodesForExistingUsers.js
 * 
 * Run this ONCE after deploying the MLM system to backfill referral codes.
 */

const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config({ path: './BE/config/config.env' });

const generateReferralCodes = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DBLINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Database connected successfully');

    // Find all users without referral codes
    const usersWithoutCodes = await User.find({ 
      referralCode: { $exists: false } 
    }).select('_id firstName lastName email');
    
    const totalCount = usersWithoutCodes.length;
    console.log(`\nFound ${totalCount} users without referral codes\n`);

    if (totalCount === 0) {
      console.log('✓ All users already have referral codes!');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    // Generate codes for each user
    for (let i = 0; i < usersWithoutCodes.length; i++) {
      const user = usersWithoutCodes[i];
      
      try {
        const code = await user.generateReferralCode();
        user.referralCode = code;
        await user.save();
        
        successCount++;
        console.log(`[${i + 1}/${totalCount}] ✓ Generated code ${code} for ${user.firstName} ${user.lastName} (${user.email})`);
      } catch (error) {
        failCount++;
        console.error(`[${i + 1}/${totalCount}] ✗ Failed for ${user.email}:`, error.message);
      }
    }

    console.log('\n========================================');
    console.log('Summary:');
    console.log(`  Total Users: ${totalCount}`);
    console.log(`  Success: ${successCount}`);
    console.log(`  Failed: ${failCount}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
generateReferralCodes();

 * UTILITY SCRIPT: Generate Referral Codes for Existing Users
 * ============================================================
 * 
 * This script generates unique referral codes for all existing users
 * in the database who don't already have one.
 * 
 * Usage:
 *   node BE/utils/generateReferralCodesForExistingUsers.js
 * 
 * Run this ONCE after deploying the MLM system to backfill referral codes.
 */

const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config({ path: './BE/config/config.env' });

const generateReferralCodes = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await mongoose.connect(process.env.DBLINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Database connected successfully');

    // Find all users without referral codes
    const usersWithoutCodes = await User.find({ 
      referralCode: { $exists: false } 
    }).select('_id firstName lastName email');
    
    const totalCount = usersWithoutCodes.length;
    console.log(`\nFound ${totalCount} users without referral codes\n`);

    if (totalCount === 0) {
      console.log('✓ All users already have referral codes!');
      process.exit(0);
    }

    let successCount = 0;
    let failCount = 0;

    // Generate codes for each user
    for (let i = 0; i < usersWithoutCodes.length; i++) {
      const user = usersWithoutCodes[i];
      
      try {
        const code = await user.generateReferralCode();
        user.referralCode = code;
        await user.save();
        
        successCount++;
        console.log(`[${i + 1}/${totalCount}] ✓ Generated code ${code} for ${user.firstName} ${user.lastName} (${user.email})`);
      } catch (error) {
        failCount++;
        console.error(`[${i + 1}/${totalCount}] ✗ Failed for ${user.email}:`, error.message);
      }
    }

    console.log('\n========================================');
    console.log('Summary:');
    console.log(`  Total Users: ${totalCount}`);
    console.log(`  Success: ${successCount}`);
    console.log(`  Failed: ${failCount}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
generateReferralCodes();

