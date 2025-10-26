/**
 * Script to create test referral tree for testing the MLM system
 * This will create a multi-level referral structure for testing purposes
 */

const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
require('dotenv').config({ path: './config/config.env' });

const createTestReferralTree = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.DATABASE);
    console.log('✅ Connected to database');

    // Find the main user (you)
    const mainUser = await UserModel.findOne({ email: 'ahmarjabbar7@gmail.com' });
    
    if (!mainUser) {
      console.error('❌ Main user not found!');
      process.exit(1);
    }

    console.log(`✅ Found main user: ${mainUser.firstName} ${mainUser.lastName}`);

    // Generate referral code if doesn't exist
    if (!mainUser.referralCode) {
      mainUser.referralCode = await mainUser.generateReferralCode();
      await mainUser.save();
      console.log(`✅ Generated referral code for main user: ${mainUser.referralCode}`);
    } else {
      console.log(`✅ Main user referral code: ${mainUser.referralCode}`);
    }

    // Test users to create (Level 1 - Direct referrals)
    const level1Users = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@test.com',
        password: '$2a$10$WqE5EQsX4v5vN5x5jQ5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5v', // 12345678
        phone: 1234567890,
        address: '123 Test St',
        city: 'Test City',
        country: 'USA',
        postalCode: '12345',
        verified: true,
        affiliateStatus: 'active'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@test.com',
        password: '$2a$10$WqE5EQsX4v5vN5x5jQ5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5v',
        phone: 1234567891,
        address: '124 Test St',
        city: 'Test City',
        country: 'USA',
        postalCode: '12345',
        verified: true,
        affiliateStatus: 'active'
      },
      {
        firstName: 'Mike',
        lastName: 'Davis',
        email: 'mike.davis@test.com',
        password: '$2a$10$WqE5EQsX4v5vN5x5jQ5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5v',
        phone: 1234567892,
        address: '125 Test St',
        city: 'Test City',
        country: 'USA',
        postalCode: '12345',
        verified: true,
        affiliateStatus: 'inactive' // This one is pending
      }
    ];

    console.log('\n🌱 Creating Level 1 referrals...');
    const level1Created = [];

    for (const userData of level1Users) {
      // Check if user already exists
      let user = await UserModel.findOne({ email: userData.email });
      
      if (user) {
        console.log(`⚠️  User ${userData.email} already exists, updating...`);
        user.referredBy = mainUser._id;
        if (!user.referralCode) {
          user.referralCode = await user.generateReferralCode();
        }
        await user.save();
      } else {
        user = await UserModel.create({
          ...userData,
          referredBy: mainUser._id
        });
        user.referralCode = await user.generateReferralCode();
        await user.save();
        console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
      }
      
      level1Created.push(user);

      // Add to main user's direct referrals
      if (!mainUser.directReferrals.includes(user._id)) {
        mainUser.directReferrals.push(user._id);
      }

      // Add commission for active users
      if (user.affiliateStatus === 'active') {
        const existingCommission = mainUser.commissionsPaid.find(
          c => c.fromUserId && c.fromUserId.toString() === user._id.toString()
        );
        
        if (!existingCommission) {
          mainUser.commissionsPaid.push({
            fromUserId: user._id,
            fromUserName: `${user.firstName} ${user.lastName}`,
            fromUserEmail: user.email,
            amount: 100,
            status: 'paid',
            approvedBy: mainUser._id,
            approvedByName: 'System',
            notes: 'Test commission for referral system',
            paidAt: new Date()
          });
          mainUser.totalCommissionEarned += 100;
          console.log(`💰 Added $100 commission from ${user.firstName} ${user.lastName}`);
        }
      }
    }

    await mainUser.save();
    console.log(`✅ Main user updated with ${level1Created.length} direct referrals`);

    // Level 2 - John's referrals (sub-referrals)
    console.log('\n🌱 Creating Level 2 referrals (John\'s referrals)...');
    const johnUser = level1Created[0];
    
    const level2Users = [
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@test.com',
        password: '$2a$10$WqE5EQsX4v5vN5x5jQ5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5v',
        phone: 1234567893,
        address: '126 Test St',
        city: 'Test City',
        country: 'USA',
        postalCode: '12345',
        verified: true,
        affiliateStatus: 'active'
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@test.com',
        password: '$2a$10$WqE5EQsX4v5vN5x5jQ5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5v',
        phone: 1234567894,
        address: '127 Test St',
        city: 'Test City',
        country: 'USA',
        postalCode: '12345',
        verified: true,
        affiliateStatus: 'inactive'
      }
    ];

    const level2Created = [];

    for (const userData of level2Users) {
      let user = await UserModel.findOne({ email: userData.email });
      
      if (user) {
        console.log(`⚠️  User ${userData.email} already exists, updating...`);
        user.referredBy = johnUser._id;
        if (!user.referralCode) {
          user.referralCode = await user.generateReferralCode();
        }
        await user.save();
      } else {
        user = await UserModel.create({
          ...userData,
          referredBy: johnUser._id
        });
        user.referralCode = await user.generateReferralCode();
        await user.save();
        console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
      }
      
      level2Created.push(user);

      // Add to John's direct referrals
      if (!johnUser.directReferrals.includes(user._id)) {
        johnUser.directReferrals.push(user._id);
      }

      // Add commission for active users
      if (user.affiliateStatus === 'active') {
        const existingCommission = johnUser.commissionsPaid.find(
          c => c.fromUserId && c.fromUserId.toString() === user._id.toString()
        );
        
        if (!existingCommission) {
          johnUser.commissionsPaid.push({
            fromUserId: user._id,
            fromUserName: `${user.firstName} ${user.lastName}`,
            fromUserEmail: user.email,
            amount: 100,
            status: 'paid',
            approvedBy: johnUser._id,
            approvedByName: 'System',
            notes: 'Test commission for referral system',
            paidAt: new Date()
          });
          johnUser.totalCommissionEarned += 100;
          console.log(`💰 Added $100 commission to John from ${user.firstName} ${user.lastName}`);
        }
      }
    }

    await johnUser.save();
    console.log(`✅ John updated with ${level2Created.length} direct referrals`);

    // Level 3 - Emma's referral
    console.log('\n🌱 Creating Level 3 referral (Emma\'s referral)...');
    const emmaUser = level2Created[0];
    
    const level3User = {
      firstName: 'Lisa',
      lastName: 'Martinez',
      email: 'lisa.martinez@test.com',
      password: '$2a$10$WqE5EQsX4v5vN5x5jQ5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5vN5v',
      phone: 1234567895,
      address: '128 Test St',
      city: 'Test City',
      country: 'USA',
      postalCode: '12345',
      verified: true,
      affiliateStatus: 'active'
    };

    let lisaUser = await UserModel.findOne({ email: level3User.email });
    
    if (lisaUser) {
      console.log(`⚠️  User ${level3User.email} already exists, updating...`);
      lisaUser.referredBy = emmaUser._id;
      if (!lisaUser.referralCode) {
        lisaUser.referralCode = await lisaUser.generateReferralCode();
      }
      await lisaUser.save();
    } else {
      lisaUser = await UserModel.create({
        ...level3User,
        referredBy: emmaUser._id
      });
      lisaUser.referralCode = await lisaUser.generateReferralCode();
      await lisaUser.save();
      console.log(`✅ Created user: ${lisaUser.firstName} ${lisaUser.lastName} (${lisaUser.email})`);
    }

    // Add to Emma's direct referrals
    if (!emmaUser.directReferrals.includes(lisaUser._id)) {
      emmaUser.directReferrals.push(lisaUser._id);
    }

    // Add commission
    const existingCommission = emmaUser.commissionsPaid.find(
      c => c.fromUserId && c.fromUserId.toString() === lisaUser._id.toString()
    );
    
    if (!existingCommission) {
      emmaUser.commissionsPaid.push({
        fromUserId: lisaUser._id,
        fromUserName: `${lisaUser.firstName} ${lisaUser.lastName}`,
        fromUserEmail: lisaUser.email,
        amount: 100,
        status: 'paid',
        approvedBy: emmaUser._id,
        approvedByName: 'System',
        notes: 'Test commission for referral system',
        paidAt: new Date()
      });
      emmaUser.totalCommissionEarned += 100;
      console.log(`💰 Added $100 commission to Emma from ${lisaUser.firstName} ${lisaUser.lastName}`);
    }

    await emmaUser.save();
    console.log(`✅ Emma updated with 1 direct referral`);

    console.log('\n\n🎉 Test Referral Tree Created Successfully!\n');
    console.log('📊 Tree Structure:');
    console.log(`
    👤 You (${mainUser.firstName} ${mainUser.lastName}) - Code: ${mainUser.referralCode}
    ├── 👤 John Smith (Active) - $100 earned from Emma
    │   ├── 👤 Emma Wilson (Active) - $100 earned from Lisa
    │   │   └── 👤 Lisa Martinez (Active)
    │   └── 👤 David Brown (Pending)
    ├── 👤 Sarah Johnson (Active)
    └── 👤 Mike Davis (Pending)
    
    💰 Your Total Earnings: $${mainUser.totalCommissionEarned}
    👥 Your Direct Referrals: ${mainUser.directReferrals.length}
    ✅ Active Referrals: 2
    ⏳ Pending Referrals: 1
    `);

    console.log('\n✅ You can now login and view your referral tree at: /user/affiliate');
    console.log('\n📝 Test User Credentials:');
    console.log('   All test users have password: 12345678');
    
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating test referral tree:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
createTestReferralTree();

