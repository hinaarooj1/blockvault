catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

exports.isAuthorizedUser = async (req, res, next) => {
  try {
    const { jwttoken } = await req.cookies;

    if (!jwttoken) {
      return next(res.status(401).send("Please login to access this resource"));
    }
    let decodedData = jwt.verify(jwttoken, process.env.SECRET_JWT);

    req.user = await User.findById(decodedData._id);

    next();
  } catch (e) {
    res.status(500).send({ e });
  }
};

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
