const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

// 🔑 Check Auth (Supports Cookie OR LocalStorage Token)
exports.isAuthorizedUser = async (req, res, next) => {
  try {
    let token = req.cookies?.jwttoken;

    if (!token) {
      return next(new ErrorHandler("Please login to access this resource", 401));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_JWT);
    } catch (err) {
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return next(new ErrorHandler("User not found. Please login again.", 401));
    }

    req.user = user;
    await User.findByIdAndUpdate(req.user._id, {
      lastActivity: new Date(),
      online: true
    });

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Role-based Access Control
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

exports.checkCrmAccess = async (req, res, next) => {
  try {
    // Get user from request (added by isAuthorizedUser middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Check CRM access based on user role
    let hasCrmAccess = false;

    if (user.role === "superadmin") {
      // Superadmin always has CRM access
      hasCrmAccess = true;
    } else if (user.role === "admin") {
      // Check admin permissions
      hasCrmAccess = user.adminPermissions?.accessCrm === true;
    } else if (user.role === "subadmin") {
      // Check subadmin permissions
      hasCrmAccess = user.permissions?.accessCrm === true;
    }

    if (!hasCrmAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied: No CRM permissions"
      });
    }

    // User has CRM access, proceed to next middleware/controller
    next();

  } catch (error) {
    console.error("Error in checkCrmAccess middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in access check"
    });
  }
};

exports.checkReferralManagementAccess = async (req, res, next) => {
  try {
    // Get user from request (added by isAuthorizedUser middleware)
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Check referral management access based on user role
    let hasReferralAccess = false;

    if (user.role === "superadmin") {
      // Superadmin always has referral management access
      hasReferralAccess = true;
    } else if (user.role === "admin") {
      // Check admin permissions
      hasReferralAccess = user.adminPermissions?.canManageReferrals === true;
    }

    if (!hasReferralAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied: No referral management permissions"
      });
    }

    // User has referral management access, proceed to next middleware/controller
    next();

  } catch (error) {
    console.error("Error in checkReferralManagementAccess middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in access check"
    });
  }
};
 