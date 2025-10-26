const User = require("../models/userModel");
const asyncErrorHandler = require("../middlewares/catchAsyncErrors");
const CustomError = require("../utils/errorHandler");

// ==========================================
// PUBLIC / USER-FACING ENDPOINTS
// ==========================================

/**
 * @desc    Verify if referral code is valid (public endpoint)
 * @route   GET /api/v1/referral/verify/:code
 * @access  Public
 */
exports.verifyReferralCode = async (req, res, next) => {
    try {
        const { code } = req.params;

        

        if (!code || code.trim().length < 6) {
            console.log('❌ Referral code too short:', code);
            return res.status(200).json({
                success: false,
                valid: false,
                msg: "Invalid referral code format"
            });
        }

        const searchCode = code.toUpperCase();
        console.log('🔎 Searching for referral code in DB:', searchCode);
        
        const referrer = await User.findOne({
            referralCode: searchCode
        }).select('firstName lastName email referralCode');

        console.log('📊 Database query result:', referrer ? `Found: ${referrer.referralCode}` : 'Not found');

        if (!referrer) {
            // Let's check if any users have referral codes
            const sampleUsers = await User.find({ referralCode: { $exists: true, $ne: null } })
                .select('firstName lastName email referralCode')
                .limit(5);
            console.log('📝 Sample referral codes in DB:', sampleUsers.map(u => u.referralCode));
            
            return res.status(200).json({
                success: false,
                valid: false,
                msg: "Referral code not found"
            });
        }

        console.log('✅ Valid referral code found:', referrer.referralCode);
        
        return res.status(200).json({
            success: true,
            valid: true,
            msg: "Valid referral code",
            referrer: {
                name: `${referrer.firstName} ${referrer.lastName}`,
                email: referrer.email
            }
        });
    } catch (error) {
        console.error('❌ Error in verifyReferralCode:', error);
        return res.status(200).json({
            success: false,
            valid: false,
            msg: "Error verifying referral code"
        });
    }
};

/**
 * @desc    Get my referral code
 * @route   GET /api/v1/referral/my-code
 * @access  Private (User)
 */
exports.getMyReferralCode = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).select('referralCode firstName lastName');

    if (!user.referralCode) {
        // Generate referral code if not exists
        const code = await user.generateReferralCode();
        user.referralCode = code;
        await user.save();
    }

    res.status(200).json({
        success: true,
        referralCode: user.referralCode,
        referralLink: `${process.env.BASE_URL || 'http://localhost:3000'}/auth/signup?ref=${user.referralCode}`
    });
});

/**
 * @desc    Get my referral tree (hierarchical view)
 * @route   GET /api/v1/referral/my-tree
 * @access  Private (User)
 */
exports.getMyReferralTree = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;

    // Recursive function to build complete tree structure
    const buildCompleteTree = async (userId, level = 0, maxLevel = 10) => {
        if (level >= maxLevel) return []; // Prevent infinite recursion
        
        const user = await User.findById(userId)
            .populate({
                path: 'directReferrals',
                select: 'firstName lastName email affiliateStatus createdAt directReferrals'
            });

        if (!user || !user.directReferrals || user.directReferrals.length === 0) {
            return [];
        }

        const tree = [];
        for (const referral of user.directReferrals) {
            const children = await buildCompleteTree(referral._id, level + 1, maxLevel);
            
            tree.push({
                id: referral._id,
                name: `${referral.firstName} ${referral.lastName}`,
                email: referral.email,
                status: referral.affiliateStatus,
                joinedDate: referral.createdAt,
                children: children
            });
        }

        return tree;
    };

    const tree = await buildCompleteTree(userId);

    res.status(200).json({
        success: true,
        referralTree: tree,
        totalDirectReferrals: tree.length
    });
});

/**
 * @desc    Get my referrals list with details
 * @route   GET /api/v1/referral/my-referrals
 * @access  Private (User)
 */
exports.getMyReferrals = asyncErrorHandler(async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId)
        .populate({
            path: 'directReferrals',
            select: 'firstName lastName email affiliateStatus createdAt'
        });

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // Count active and inactive
    const active = user.directReferrals?.filter(r => r.affiliateStatus === 'active').length || 0;
    const inactive = user.directReferrals?.filter(r => r.affiliateStatus === 'inactive').length || 0;

    const referrals = (user.directReferrals || []).map(ref => ({
        id: ref._id,
        name: `${ref.firstName} ${ref.lastName}`,
        email: ref.email,
        status: ref.affiliateStatus,
        joinedDate: ref.createdAt
    }));

    res.status(200).json({
        success: true,
        referrals,
        stats: {
            total: referrals.length,
            active,
            inactive
        }
    });
});

/**
 * @desc    Get my earnings from referrals
 * @route   GET /api/v1/referral/my-earnings
 * @access  Private (User)
 */
exports.getMyEarnings = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)
        .select('totalCommissionEarned commissionsPaid');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    const commissions = (user.commissionsPaid || []).map(c => ({
        from: c.fromUserName,
        amount: c.amount,
        status: c.status,
        date: c.createdAt,
        paidDate: c.paidAt,
        notes: c.notes
    }));

    const pending = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);
    const paid = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);

    res.status(200).json({
        success: true,
        earnings: {
            total: user.totalCommissionEarned || 0,
            paid,
            pending
        },
        commissions,
        totalCommissions: commissions.length
    });
});

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

/**
 * @desc    Get all referrals in the system (Admin)
 * @route   GET /api/v1/referral/admin/all
 * @access  Private (Admin/SuperAdmin with canManageReferrals permission)
 */
exports.getAllReferrals = asyncErrorHandler(async (req, res, next) => {
    // Check permission
    if (req.user.role !== 'superadmin' &&
        (!req.user.adminPermissions || !req.user.adminPermissions.canManageReferrals)) {
        return next(new CustomError("You don't have permission to manage referrals", 403));
    }

    const { status, search, page = 1, limit = 50 } = req.query;

    // 🔐 FILTER: Only show regular users, exclude admins/superadmins from referral stats
    let query = { 
        referredBy: { $ne: null }, // Only users who were referred
        role: 'user' // ✅ Exclude admins and superadmins
    };

    if (status && ['active', 'inactive'].includes(status)) {
        query.affiliateStatus = status;
    }

    if (search) {
        query.$or = [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
        .populate('referredBy', 'firstName lastName email referralCode commissionsPaid')
        .select('firstName lastName email affiliateStatus createdAt referralCode directReferrals')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    const referrals = users.map(user => {
        // Check if commission was paid to referrer for this user's activation
        let commissionPaid = null;
        if (user.referredBy && user.referredBy.commissionsPaid) {
            const commission = user.referredBy.commissionsPaid.find(
                c => c.fromUserId && c.fromUserId.toString() === user._id.toString()
            );
            if (commission) {
                commissionPaid = {
                    amount: commission.amount,
                    paidAt: commission.paidAt,
                    approvedBy: commission.approvedByName
                };
            }
        }

        return {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.affiliateStatus,
            joinedDate: user.createdAt,
            referredBy: user.referredBy ? {
                id: user.referredBy._id,
                name: `${user.referredBy.firstName} ${user.referredBy.lastName}`,
                email: user.referredBy.email,
                code: user.referredBy.referralCode
            } : null,
            ownReferralCode: user.referralCode,
            referralsCount: user.directReferrals?.length || 0,
            commissionPaid // Include commission info
        };
    });

    res.status(200).json({
        success: true,
        referrals,
        pagination: {
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            total: total,
            limit: parseInt(limit),
            totalReferrals: total
        }
    });
});

/**
 * @desc    Get system referral statistics (Admin)
 * @route   GET /api/v1/referral/admin/statistics
 * @access  Private (Admin/SuperAdmin with canManageReferrals permission)
 */
exports.getSystemStatistics = asyncErrorHandler(async (req, res, next) => {
    // Check permission
    if (req.user.role !== 'superadmin' &&
        (!req.user.adminPermissions || !req.user.adminPermissions.canManageReferrals)) {
        return next(new CustomError("You don't have permission to manage referrals", 403));
    }

    // 🔐 FILTER: Only count regular users, exclude admins/superadmins from stats
    const totalUsers = await User.countDocuments({ role: 'user' });
    const usersWithReferralCode = await User.countDocuments({ referralCode: { $ne: null }, role: 'user' });
    const totalReferred = await User.countDocuments({ referredBy: { $ne: null }, role: 'user' });
    const activeReferrals = await User.countDocuments({ affiliateStatus: 'active', role: 'user' });
    const inactiveReferrals = await User.countDocuments({ affiliateStatus: 'inactive', referredBy: { $ne: null }, role: 'user' });

    // Get total commissions paid - Only from regular users, exclude admins
    const commissionAgg = await User.aggregate([
        { $match: { role: 'user' } }, // ✅ Only count commissions for regular users
        { $unwind: '$commissionsPaid' },
        {
            $group: {
                _id: null,
                totalPaid: { $sum: { $cond: [{ $eq: ['$commissionsPaid.status', 'paid'] }, '$commissionsPaid.amount', 0] } },
                totalPending: { $sum: { $cond: [{ $eq: ['$commissionsPaid.status', 'pending'] }, '$commissionsPaid.amount', 0] } }
            }
        }
    ]);

    const commissionStats = commissionAgg[0] || { totalPaid: 0, totalPending: 0 };

    // Top referrers - Only regular users, exclude admins
    const topReferrers = await User.find({ 
        referralCode: { $ne: null },
        role: 'user' // ✅ Exclude admins and superadmins
    })
        .select('firstName lastName email referralCode directReferrals totalCommissionEarned')
        .sort({ totalCommissionEarned: -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        statistics: {
            totalUsers,
            usersWithReferralCode,
            totalReferred,
            activeReferrals,
            inactiveReferrals,
            commissions: {
                totalPaid: commissionStats.totalPaid,
                totalPending: commissionStats.totalPending,
                overall: commissionStats.totalPaid + commissionStats.totalPending
            },
            topReferrers: topReferrers.map(r => ({
                id: r._id,
                name: `${r.firstName} ${r.lastName}`,
                email: r.email,
                referralCode: r.referralCode,
                referralsCount: r.directReferrals?.length || 0,
                totalEarned: r.totalCommissionEarned || 0
            }))
        }
    });
});

/**
 * @desc    Get specific user's referral details (Admin)
 * @route   GET /api/v1/referral/admin/user/:userId
 * @access  Private (Admin/SuperAdmin with canManageReferrals permission)
 */
exports.getUserReferralDetails = asyncErrorHandler(async (req, res, next) => {
    // Check permission
    if (req.user.role !== 'superadmin' &&
        (!req.user.adminPermissions || !req.user.adminPermissions.canManageReferrals)) {
        return next(new CustomError("You don't have permission to manage referrals", 403));
    }

    const { userId } = req.params;

    const user = await User.findById(userId)
        .populate('referredBy', 'firstName lastName email referralCode')
        .populate('directReferrals', 'firstName lastName email affiliateStatus createdAt');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            referralCode: user.referralCode,
            affiliateStatus: user.affiliateStatus,
            totalEarned: user.totalCommissionEarned || 0,
            referredBy: user.referredBy ? {
                id: user.referredBy._id,
                name: `${user.referredBy.firstName} ${user.referredBy.lastName}`,
                email: user.referredBy.email,
                code: user.referredBy.referralCode
            } : null,
            referrals: (user.directReferrals || []).map(ref => ({
                id: ref._id,
                name: `${ref.firstName} ${ref.lastName}`,
                email: ref.email,
                status: ref.affiliateStatus,
                joinedDate: ref.createdAt
            })),
            commissions: user.commissionsPaid || []
        }
    });
});

/**
 * @desc    Activate user and set commission for referrer (Admin)
 * @route   POST /api/v1/referral/admin/activate/:userId
 * @access  Private (Admin/SuperAdmin with canManageReferrals permission)
 */
exports.activateUserAndSetCommission = asyncErrorHandler(async (req, res, next) => {
    // Check permission
    if (req.user.role !== 'superadmin' &&
        (!req.user.adminPermissions || !req.user.adminPermissions.canManageReferrals)) {
        return next(new CustomError("You don't have permission to manage referrals", 403));
    }

    const { userId } = req.params;
    const { commissionAmount, notes } = req.body;

    if (!commissionAmount || commissionAmount <= 0) {
        return next(new CustomError("Please provide a valid commission amount", 400));
    }

    const user = await User.findById(userId).populate('referredBy');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    if (!user.referredBy) {
        return next(new CustomError("This user was not referred by anyone", 400));
    }

    if (user.affiliateStatus === 'active') {
        return next(new CustomError("User is already active", 400));
    }

    // Activate user
    user.affiliateStatus = 'active';
    await user.save();

    // Add commission to referrer
    const referrer = user.referredBy;

    // Check if commission already exists for this user activation
    const existingCommission = referrer.commissionsPaid?.find(
        c => c.fromUserId && c.fromUserId.toString() === user._id.toString()
    );

    if (existingCommission) {
        return next(new CustomError("Commission for this user's activation has already been paid", 400));
    }

    const commission = {
        fromUserId: user._id,
        fromUserName: `${user.firstName} ${user.lastName}`,
        fromUserEmail: user.email,
        amount: commissionAmount,
        status: 'paid',
        approvedBy: req.user._id,
        approvedByName: `${req.user.firstName} ${req.user.lastName}`,
        notes: notes || `Activation commission for ${user.firstName} ${user.lastName}`,
        createdAt: new Date(),
        paidAt: new Date()
    };

    referrer.commissionsPaid = referrer.commissionsPaid || [];
    referrer.commissionsPaid.push(commission);
    referrer.totalCommissionEarned = (referrer.totalCommissionEarned || 0) + commissionAmount;

    await referrer.save();

    res.status(200).json({
        success: true,
        msg: `User activated and commission of $${commissionAmount} added to referrer`,
        user: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            status: user.affiliateStatus
        },
        referrer: {
            id: referrer._id,
            name: `${referrer.firstName} ${referrer.lastName}`,
            newTotalEarned: referrer.totalCommissionEarned
        }
    });
});

/**
 * @desc    Update user affiliate status (Admin)
 * @route   PATCH /api/v1/referral/admin/status/:userId
 * @access  Private (Admin/SuperAdmin with canManageReferrals permission)
 */
exports.updateUserAffiliateStatus = asyncErrorHandler(async (req, res, next) => {
    // Check permission
    if (req.user.role !== 'superadmin' &&
        (!req.user.adminPermissions || !req.user.adminPermissions.canManageReferrals)) {
        return next(new CustomError("You don't have permission to manage referrals", 403));
    }

    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
        return next(new CustomError("Invalid status. Use 'active' or 'inactive'", 400));
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { affiliateStatus: status },
        { new: true, runValidators: true }
    ).select('firstName lastName email affiliateStatus');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        msg: `User status updated to ${status}`,
        user: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.affiliateStatus
        }
    });
});

/**
 * @desc    Add commission manually to a user (Admin)
 * @route   POST /api/v1/referral/admin/commission/:userId
 * @access  Private (Admin/SuperAdmin with canManageReferrals permission)
 */
exports.addCommissionManually = asyncErrorHandler(async (req, res, next) => {
    // Check permission
    if (req.user.role !== 'superadmin' &&
        (!req.user.adminPermissions || !req.user.adminPermissions.canManageReferrals)) {
        return next(new CustomError("You don't have permission to manage referrals", 403));
    }

    const { userId } = req.params;
    const { amount, notes, fromUserName, fromUserEmail, status = 'paid' } = req.body;

    if (!amount || amount <= 0) {
        return next(new CustomError("Please provide a valid commission amount", 400));
    }

    const user = await User.findById(userId);

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // Check for duplicate manual commissions (prevent spam)
    const recentManualCommission = user.commissionsPaid?.find(
        c => c.approvedBy && c.approvedBy.toString() === req.user._id.toString() &&
        c.amount === amount &&
        c.notes === (notes || `Manual commission by ${req.user.firstName} ${req.user.lastName}`) &&
        new Date() - new Date(c.createdAt) < 60000 // Within last minute
    );

    if (recentManualCommission) {
        return next(new CustomError("Identical commission was just added. Please wait before adding another.", 400));
    }

    const commission = {
        fromUserName: fromUserName || `Manual by ${req.user.firstName} ${req.user.lastName}`,
        fromUserEmail: fromUserEmail || req.user.email,
        amount,
        status,
        approvedBy: req.user._id,
        approvedByName: `${req.user.firstName} ${req.user.lastName}`,
        notes: notes || `Manual commission by ${req.user.firstName} ${req.user.lastName}`,
        createdAt: new Date(),
        paidAt: status === 'paid' ? new Date() : null
    };

    user.commissionsPaid = user.commissionsPaid || [];
    user.commissionsPaid.push(commission);

    if (status === 'paid') {
        user.totalCommissionEarned = (user.totalCommissionEarned || 0) + amount;
    }

    await user.save();

    res.status(200).json({
        success: true,
        msg: `Commission of $${amount} added to ${user.firstName} ${user.lastName}`,
        user: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            newTotalEarned: user.totalCommissionEarned
        }
    });
});



