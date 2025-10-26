let UserModel = require("../models/userModel");
let userLink = require("../models/links");
let notificationSchema = require("../models/notifications");
// Usedto handle error
const errorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary").v2;
const getDataUri = require("../utils/dataUri");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwtToken = require("../utils/jwtToken");

const crypto = require("crypto");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const htmlModel = require("../models/htmlData");
const Ticket = require("../models/ticket");
const MyTokens = require("../models/myTokens");
const Message = require("../models/message");
const { default: mongoose } = require("mongoose");

const Stock = require('../models/stock');
const UserRestriction = require("../models/usersRestrictions");
const errorLogs = require("../models/errorLogs");
exports.RegisterUser = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    country,
    postalCode,
    role,
    isRole,
    referralCode // MLM: Referral code from registration
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !city ||
    !country ||
    !postalCode
  ) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }
  if (isRole) {
    if (!role) {

      return next(new errorHandler("Please fill all the required fields", 500));
    }

  }
  let findUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (findUser) {
    return next(
      new errorHandler("Email  already exists, please sign in to continue", 500)
    );
  }
  email.toLowerCase();

  // MLM: Handle referral code if provided
  let referrer = null;
  if (referralCode && referralCode.trim()) {
    referrer = await UserModel.findOne({ 
      referralCode: referralCode.trim().toUpperCase(),
      role: 'user' // 🔐 Only allow referrals from regular users, not admins
    });
    
    if (!referrer) {
      console.warn(`⚠️ Invalid referral code provided during registration: ${referralCode}`);
      // Skip the referral instead of throwing error - allow registration to proceed
      referrer = null;
    }
  }

  let createUser = await UserModel.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    address,
    city,
    note: "",
    country,
    postalCode,
    verified: isRole ? true : false,
    referredBy: referrer ? referrer._id : null,
    affiliateStatus: referrer ? 'inactive' : 'inactive' // Start as inactive
  });

  // MLM: Generate referral code for new user
  const newUserRefCode = await createUser.generateReferralCode();
  createUser.referralCode = newUserRefCode;
  await createUser.save();

  // MLM: Add new user to referrer's directReferrals
  // 🔐 Only add to referral chain if new user is regular user (not admin/superadmin)
  if (referrer && createUser.role === 'user') {
    referrer.directReferrals = referrer.directReferrals || [];
    
    // ✅ Check for duplicate before adding
    if (!referrer.directReferrals.includes(createUser._id)) {
      referrer.directReferrals.push(createUser._id);
      await referrer.save();
    }
  }
  // role:'superadmin',
  // verified:'true'
  if (isRole) {

    res.status(201).send({
      msg: `New ${role} added successfully`,
      success: true,
    });
    return
  }
  const token = await new Token({
    userId: createUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();
  let subject = `Email Verification link`;
  const url = `${process.env.BASE_URL}/users/${createUser._id}/verify/${token.token}`;
  let text = `To activate your account, please click the following link:

${url}
The link will be expired after 2 hours`;
  // 
  try {
    let emailResult = await sendEmail(createUser.email, subject, text);
    console.log("Email sent successfully:", emailResult);
  } catch (sendEmailError) {
    // Log the error for debugging
    console.error("Failed to send email:", sendEmailError);

    // Respond with an error status and message
    return res.status(500).send({
      msg: "Registration successful, but email could not be sent. Please login to continue!",
      success: true,
      error: sendEmailError.message,
    });
  }

  res.status(201).send({
    msg: "A verification link has been sent to your email, please verify",
    success: true,
  });
  // 

  // jwtToken(createUser, 201, res);
});
exports.RegisterSubAdmin = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    country,
    postalCode,
    role,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !city ||
    !country ||
    !postalCode ||
    !role
  ) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }
  let findUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (findUser) {
    return next(
      new errorHandler("Email  already exists ", 500)
    );
  }
  email.toLowerCase();

  let createUser = await UserModel.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    address,
    city,
    note: "",
    country,
    postalCode,
    role,
    verified: true
  });



  res.status(201).send({
    msg: "Data updated successfully",
    success: true,
  });
  // 

  // jwtToken(createUser, 201, res);
});
// exports.RegisterUser = catchAsyncErrors(async (req, res, next) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//     phone,
//     address,
//     city,
//     country,
//     postalCode,
//     // role,
//   } = req.body;
//   if (
//     !firstName ||
//     !lastName ||
//     !email ||
//     !password ||
//     !phone ||
//     !address ||
//     !city ||
//     !country ||
//     !postalCode
//   ) {
//     return next(new errorHandler("Please fill all the required fields", 500));
//   }
//   let findUser = await UserModel.findOne({
//     email: req.body.email,
//   });
//   if (findUser) {
//     return next(
//       new errorHandler("Email  already exists, please try another one", 500)
//     );
//   }
//   email.toLowerCase();

//   let createUser = await UserModel.create({
//     firstName,
//     lastName,
//     email,
//     phone,
//     password,
//     address,
//     city,
//     note: "",
//     country,
//     postalCode,
//     verified: true,
//   });

//   res.status(201).send({
//     msg: "User created successfully",
//     success: true,
//   });
//   // jwtToken(createUser, 201, res);
// });
exports.verifyToken = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.params.id });
  if (!user) {
    return next(new errorHandler("Invalid link", 400));
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) {
    return next(new errorHandler("link expired", 400));
  }

  await UserModel.updateOne(
    { _id: user._id },
    { verified: true },
    { upsert: true, new: true }
  );
  await token.deleteOne();

  res.status(200).send({ msg: "Email verified successfully", success: true });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user has given password and email
  if (!email || !password) {
    return next(new errorHandler("Please enter email and password", 400));
  }
  let UserAuth = await UserModel.findOne({ email });

  if (!UserAuth) {
    return next(
      new errorHandler(
        "User not found with this email address, please register first!"
      )
    );
  }

  if (UserAuth.password != password) {
    return next(new errorHandler("Invalid Email or Password"));
  }
  if (!UserAuth.verified) {
    let token = await Token.findOne({ userId: UserAuth._id });
    if (!token) {
      token = await new Token({
        userId: UserAuth._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      //
      let subject = `Email Verification link`;
      const url = `${process.env.BASE_URL}/users/${UserAuth._id}/verify/${token.token}`;
      let text = `To activate your account, please click the following link: 

${url}

The link will be expired after 2 hours`;

      try {
        let emailResult = await sendEmail(UserAuth.email, subject, text);
        console.log("Email sent successfully:", emailResult);
      } catch (sendEmailError) {
        // Log the error for debugging
        console.error("Failed to send email:", sendEmailError);

        // Respond with an error status and message
        return res.status(500).send({
          msg: "Email verification link sending failed. Please try again.",
          success: false,
          error: sendEmailError.message,
        });
      }
      //
    } else if (token) {
      await Token.findOneAndDelete({ userId: UserAuth._id });
      token = await new Token({
        userId: UserAuth._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      //
      let subject = `Email Verification link`;
      const url = `${process.env.BASE_URL}/users/${UserAuth._id}/verify/${token.token}`;
      let text = `To activate your account, please click the following link: 

${url}

The link will be expired after 2 hours`;

      try {
        let emailResult = await sendEmail(UserAuth.email, subject, text);
        console.log("Email sent successfully:", emailResult);
      } catch (sendEmailError) {
        // Log the error for debugging
        console.error("Failed to send email:", sendEmailError);

        // Respond with an error status and message
        return res.status(500).send({
          msg: "Email verification link sending failed. Please try again.",
          success: false,
          error: sendEmailError.message,
        });
      }

      //
    }


    return res.status(201).send({
      msg: "A verification link has been sent to your email, please verify",
      success: true,
      link: true
    });
  }

  jwtToken(UserAuth, 200, res, req);
});
exports.sendTicket = catchAsyncErrors(async (req, res, next) => {
  const { title, description, id } = req.body;
  let _id = id;
  // Checking if user has given password and email
  if (!title || !description) {
    return next(new errorHandler("Please fill both the requrired fields", 500));
  }
  if (description.length < 20) {
    return next(new errorHandler("Enter some detail in description", 500));
  }
  let userEmail = await UserModel.findById(_id);

  let newTitle = `Blockhain user ticket`;
  let newDescription = `
From:
${userEmail.firstName}
${userEmail.email}


Ticket Title: 
${title}

Ticket Description:
${description}`;

  try {
    let emailResult = await sendEmail(process.env.USER, newTitle, newDescription);
    console.log("Ticket email sent successfully:", emailResult);
  } catch (sendEmailError) {
    // Log the error for debugging
    console.error("Failed to send email:", sendEmailError);

    // Respond with an error status and message
    return next(new errorHandler("Ticket submission failed, please try again!", 500));
  }

  res.status(200).send({
    msg: "Your ticket was sent. You will be answered by one of our representatives.",
    success: true,
  });


});
// exports.sendEmailCode = catchAsyncErrors(async (req, res, next) => {
//   const { email} = req.body;

//   // Checking if user has given password and email

//   let userEmail = await UserModel.findById(_id);

//   let newTitle = `Blochain user ticket`;
//   let newDescription = `
// From:
// ${userEmail.firstName}
// ${userEmail.email}

// Ticket Title:
// ${title}

// Ticket Description:
// ${description}`;

//   await sendEmail(process.env.USER, newTitle, newDescription);

//   return res.status(200).send({
//     success: true,

//     msg: "Your ticket was sent. You will be answered by one of our representatives.",
//   });
// });

//
exports.sendEmailCode = catchAsyncErrors(async (req, res, next) => {
  //
  const { email, id, code, username } = req.body;
  let _id = id;

  await UserModel.findById(_id);
  let subject = `Your Secure 2FA Verification Code`;

  let text = `
Hello ${username || ''},

We received a request to perform a secure action on your account.

🔑 Your One-Time Verification Code is:

    ${code}
 
Do NOT share this code with anyone—even if they claim to be from our team.

If you did not request this code, please ignore this email or contact our support immediately.

Stay safe,
The ${process.env.WebName} Team
`;

  try {
    let emailResult = await sendEmail(email, subject, text);
    console.log("OTP email sent successfully:", emailResult);
  } catch (sendEmailError) {
    // Log the error for debugging
    console.error("Failed to send email:", sendEmailError);

    return next(new errorHandler("OTP sending failed, please try again!", 500));
  }

  res.status(201).send({
    msg: "An OTP has been sent to your email, please enter it to continue",
    success: true,
  });

});

// Logout User

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  const secure = isProd || process.env.COOKIE_SECURE === 'true';
  const sameSite = secure ? 'None' : 'Lax';

  // Determine cookie domain based on request origin
  let cookieDomain = undefined;
  
  if (isProd) {
    const origin = req.headers.origin || req.headers.referer || '';
    
    if (origin.includes('fortivault.io')) {
      cookieDomain = '.fortivault.io';
    }  else if (process.env.COOKIE_DOMAIN) {
      cookieDomain = process.env.COOKIE_DOMAIN;
    }
  }

  // Clear cookie with all the same options as when it was set
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite,
    secure,
    path: '/',
    domain: cookieDomain,
  };

  // Clear cookie for all possible domains to ensure complete logout
  res.clearCookie('jwttoken', { path: '/', httpOnly: true, secure, sameSite });
  res.clearCookie('jwttoken', { path: '/', domain: '.fortivault.io', httpOnly: true, secure, sameSite });

  // Set the main cookie to null with proper options
  res.cookie("jwttoken", null, cookieOptions);

  res.status(200).send({
    success: true,
    msg: "User Logged out successfully",
  });
});

exports.allUser = catchAsyncErrors(async (req, res, next) => {
  let signedUser = req.user;

  // Extract pagination and filter params
  const {
    search,
    role,
    verified,
    page = 1,
    limit = 50,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    includeCounts = 'false' // For getting total counts without pagination
  } = req.query;

  // For subadmins, handle search parameter or return filtered users
  if (signedUser.role === "subadmin") {
    console.log("🔍 Subadmin request - search:", search);

    // ✅ If searching by ID, find that specific user
    if (search && search.trim()) {
      const searchTrimmed = String(search).trim();
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(searchTrimmed);

      if (isObjectId) {
        console.log("🔍 Subadmin searching by ID:", searchTrimmed);
        const specificUser = await UserModel.findById(searchTrimmed).lean();

        if (specificUser) {
          console.log("🔍 Found specific user:", { _id: specificUser._id, email: specificUser.email, role: specificUser.role });
          return res.status(200).send({
            success: true,
            msg: "All Users",
            allUsers: [specificUser],
            pagination: {
              total: 1,
              page: 1,
              limit: 1,
              pages: 1
            }
          });
        } else {
          console.log("🔍 Specific user not found");
          return res.status(200).send({
            success: true,
            msg: "All Users",
            allUsers: [],
            pagination: {
              total: 0,
              page: 1,
              limit: 0,
              pages: 0
            }
          });
        }
      }
    }

    // ✅ Default subadmin behavior - return all accessible users
    const allUsers = await UserModel.find({
      $or: [
        { isShared: true },
        { assignedSubAdmin: signedUser._id }
      ]
    }).sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 });

    // ✅ Append the logged-in subadmin user to ensure they can find their own permissions data
    const userExists = allUsers.some(user => user._id.toString() === signedUser._id.toString());

    if (!userExists) {
      // Fetch the logged-in user's latest data only if they're a subadmin
      const currentUser = await UserModel.findById(signedUser._id).lean();
      if (currentUser && currentUser.role === 'subadmin') {
        allUsers.push(currentUser);  // Append subadmin to array
      }
    }

    console.log("🔍 Subadmin returning", allUsers.length, "users");
    return res.status(200).send({
      success: true,
      msg: "All Users",
      allUsers,
      pagination: {
        total: allUsers.length,
        page: 1,
        limit: allUsers.length,
        pages: 1
      }
    });
  }

  // For admin/superadmin - use pagination
  const query = {};

  // Search filter (name, email, or ID)
  if (search && search.trim()) {
    const searchTrimmed = String(search).trim();

    // Check if search is a valid MongoDB ObjectId (24 hex characters)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(searchTrimmed);

    if (isObjectId) {
      // Search by exact ID match
      query._id = searchTrimmed;
    } else {
      // Search by name or email (regex)
      const regexGlobal = { $regex: searchTrimmed, $options: "i" };
      query.$or = [
        { firstName: regexGlobal },
        { lastName: regexGlobal },
        { email: regexGlobal }
      ];
    }
  }

  // Role filter
  if (role) {
    query.role = role; // Exact match instead of regex
  }

  // Verified filter
  if (verified !== undefined && verified !== '') {
    query.verified = verified === 'true';
  }

  // If only counts requested (for initial load)
  if (includeCounts === 'true') {
    const total = await UserModel.countDocuments(query);
    const verifiedCount = await UserModel.countDocuments({ ...query, verified: true, role: /user/i });
    const unverifiedCount = await UserModel.countDocuments({ ...query, verified: false, role: /user/i });
    const subadminCount = await UserModel.countDocuments({ ...query, role: /subadmin/i });

    return res.status(200).send({
      success: true,
      msg: "User counts",
      counts: {
        total,
        verified: verifiedCount,
        unverified: unverifiedCount,
        subadmins: subadminCount
      }
    });
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Get total count
  const total = await UserModel.countDocuments(query);

  // Get paginated results
  const allUsers = await UserModel.find(query)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  // ✅ SECURITY: Only append logged-in user if NOT searching by ID (to avoid duplicates)
  const isSearchingById = search && search.trim() && /^[0-9a-fA-F]{24}$/.test(search.trim());
  const userExists = allUsers.some(user => user._id.toString() === signedUser._id.toString());

  if (!userExists && !isSearchingById) {
    // Fetch the logged-in user's latest data
    const currentUser = await UserModel.findById(signedUser._id).lean();

    // Only append if user matches the role filter (or no role filter)
    if (currentUser) {
      const matchesRoleFilter = !role || currentUser.role === role; // Exact match
      const matchesVerifiedFilter = verified === undefined || verified === '' || currentUser.verified === (verified === 'true');

      if (matchesRoleFilter && matchesVerifiedFilter) {
        allUsers.push(currentUser);  // Append only if matches filters
      }
    }
  }

  res.status(200).send({
    success: true,
    msg: "All Users",
    allUsers,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  });
});
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});

exports.updateSingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    progress,
    country,
    postalCode,
    note,
    currency, AiTradingPercentage,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !country
    ||
    !postalCode
    ||
    !currency ||
    !AiTradingPercentage
  ) {
    return next(
      new errorHandler(
        "You can't leave any field empty except note field!",
        500
      )
    );
  }

  AiTradingPercentage = parseFloat(AiTradingPercentage);

  // Prepare update object
  let updateData = {
      firstName,
      lastName,
      email,
      phone,
      progress,
      address,
      city,
      country,
      postalCode,
      note,
    currency, 
    AiTradingPercentage
  };

  // Only update password if it's provided and not empty
  if (password && password.trim() !== '') {
    updateData.password = password;
  }

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    updateData,
    { new: true, upsert: true }
  );
  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.updateSingleUserStatus = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const { isShared } = req.body;

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      isShared,
    },
    { new: true }
  );
  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.bypassSingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;

  let singleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    { $set: { verified: true } },
    { new: true }
  );

  res.status(200).send({
    success: true,
    msg: "User email verified successfully",
    singleUser,
  });
});

exports.htmlData = catchAsyncErrors(async (req, res, next) => {
  let description = await htmlModel.findOneAndUpdate(
    { _id: id },
    {
      description,
    },
    { new: true, upsert: true }
  );
  res.status(200).send({
    success: true,
    msg: "Description updated successfully",
    description,
  });
});
exports.getHtmlData = catchAsyncErrors(async (req, res, next) => {
  let description = await htmlModel.find();
  res.status(200).send({
    success: true,
    msg: "Description",
    description,
  });
});
exports.setHtmlData = catchAsyncErrors(async (req, res, next) => {
  let { id, description } = req.body;

  let descriptionUpdate;

  if (!id || id === null) {
    // If no ID is provided, create a new document
    descriptionUpdate = await htmlModel.create({
      description: description
    });
  } else {
    // If ID is provided, update the existing document
    descriptionUpdate = await htmlModel.findByIdAndUpdate(
      id,  // Just pass the ID directly
      {
        description: description,
      },
      {
        new: true,  // Return the modified document
        upsert: false  // No need for upsert since we're handling creation separately
      }
    );
  }

  res.status(200).send({
    success: true,
    msg: id === null ? "Description created successfully" : "Description updated successfully",
    descriptionUpdate,
  });
});
exports.updateKyc = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const { kyc, status } = req.body;

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      kyc: kyc,
      submitDoc: {
        status: status, cnic: null,  // Retain existing cnic if present
        bill: null,
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.getsignUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});
exports.verifySingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }
  const uploadFileToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'image', public_id: `kyc/${id}/${fileName}` }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url); // Get the Cloudinary URL
      }).end(fileBuffer);
    });
  };
  const cnicFile = files.find((file) => file.fieldname === 'cnic');
  const billFile = files.find((file) => file.fieldname === 'bill');
  if (!cnicFile || !billFile) {
    return res.status(400).json({
      success: false,
      message: "Both cnic and bill files are required",
    });
  }
  const cnicUrl = await uploadFileToCloudinary(cnicFile.buffer, cnicFile.originalname);
  const billUrl = await uploadFileToCloudinary(billFile.buffer, billFile.originalname);
  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      submitDoc: {
        status: "completed",
        cnic: cnicUrl,  // Store the Cloudinary URL for cnic
        bill: billUrl,  // Store the Cloudinary URL for bill
      },
    },
    { new: true, upsert: true }
  );

  signleUser.save();
  await notificationSchema.create({
    userId: signleUser._id,
    type: "KYC_request",
    content: `You have a new KYC application from ${signleUser.firstName}  ${signleUser.lastName}.`,

    userEmail: signleUser.email,
    userName: `${signleUser.firstName} ${signleUser.lastName}`
  });

  // 
  res.status(200).send({
    success: true,
    msg: "Thank you for submitting KYC documents.",
    signleUser,
  });
  const url = `${process.env.BASE_URL}/admin/users/${signleUser._id}/verifications`
  let subject = `New KYC Request `;
  let text = `Hi there,

A user has submitted their KYC details. Please find the information below:

Name: ${signleUser.firstName} ${signleUser.lastName}  
Email: ${signleUser.email}  

You can review the submitted documents by clicking the link below:  
${url}

Best regards,  
The ${process.env.WebName} Team
`;

  try {
    await sendEmail(process.env.USER, subject, text);
    console.log(`KYC notification email sent successfully for user ${signleUser.email}`);
  } catch (emailError) {
    console.error("KYC email send error:", emailError);
    // Don't fail the KYC submission, just log the error
  }

});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  let email = req.body.email;
  let user = await UserModel.findOne({ email });
  if (!user) {
    next(new errorHandler("user not found", 404));
  }

  return res.status(200).send({
    msg: "Done",
    // token,
    user,
  });
});

exports.createAccount = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { accountName, accountNumber, iban, accountNotes } = req.body;

  // Check if all required fields are provided
  if (!accountName || !accountNumber || !iban || !accountNotes) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }

  try {
    // Find the user by ID and update the payments array
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $push: {
          payments: {
            type: "bank",
            bank: {
              accountName,
              accountNumber,
              iban,
              accountNotes,
            },
          },
        },
      },
      { new: true, upsert: true }
    );

    // Check if the user exists

    if (!user) {
      return next(new errorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      msg: "Payment method added successfully",
      user,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});
exports.addCard = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { cardName, cardNumber, cardNotes, cardExpiry, cardCvv, cardType } =
    req.body;

  // Check if all required fields are provided
  if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
    return next(new errorHandler("Please fill all the required fields", 500));
  }

  try {
    // Find the user by ID and update the payments array with the new card details
    const user = await UserModel.findByIdAndUpdate(
      id,
      {
        $push: {
          payments: {
            type: "card",
            card: {
              cardCategory: cardType,
              cardName,
              cardNumber,
              cardNotes,
              cardExpiry,
              cardCvv,
            },
          },
        },
      },
      { new: true, upsert: true }
    );

    // Check if the user exists
    if (!user) {
      return next(new errorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      msg: "Card added successfully",
      user,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});
exports.deletePayment = catchAsyncErrors(async (req, res, next) => {
  const { id, pId } = req.params;

  try {
    // Find the user by ID and remove the payment from the payments array
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $pull: { payments: { _id: pId } } },
      { new: true }
    );

    // Check if the user exists
    if (!user) {
      return next(new errorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      msg: "Payment method deleted successfully",
      user,
    });
  } catch (error) {
    return next(new errorHandler(error.message, 500));
  }
});
exports.adminTickets = catchAsyncErrors(async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Optional status filter

    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    console.log('adminTickets API called:', { 
      page, 
      limit, 
      status, 
      currentUserRole,
      rawStatus: req.query.status 
    });

    // Build filter query for tickets
    let ticketFilterQuery = {};
    if (status && status !== 'all' && status !== 'undefined') {
      ticketFilterQuery.status = status;
    }

    console.log('Ticket Filter Query:', ticketFilterQuery);

    // For subadmin, first get accessible user IDs
    let accessibleUserIds = null;
    if (currentUserRole === 'subadmin') {
      const accessibleUsers = await UserModel.find({
        $or: [
          { isShared: true },
          { assignedSubAdmin: currentUserId }
        ]
      }).select('_id').lean();
      
      accessibleUserIds = accessibleUsers.map(user => user._id);
      
      // Add user filter to ticket query
      if (accessibleUserIds.length > 0) {
        ticketFilterQuery.user = { $in: accessibleUserIds };
      } else {
        // No accessible users, return empty
        return res.status(200).json({ 
          success: true, 
          tickets: [],
          pagination: {
            currentPage: page,
            totalPages: 0,
            totalCount: 0,
            limit,
            hasMore: false
          }
        });
      }
    }

    // Get total count for pagination (after applying filters)
    const totalCount = await Ticket.countDocuments(ticketFilterQuery);
    console.log('Total tickets matching filter:', totalCount);

    // Fetch tickets with pagination, sorted by updatedAt and createdAt
    let tickets = await Ticket.find(ticketFilterQuery)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('Fetched tickets count:', tickets.length);

    // Fetch user details for all tickets in one batch query
    const userIds = [...new Set(tickets.map(ticket => ticket.user))];
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select('_id firstName lastName email isShared assignedSubAdmin')
      .lean();

    // Create a map for quick user lookup
    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    // Attach user details to tickets
    const ticketsWithUserDetails = tickets.map(ticket => ({
      ...ticket,
      userDetails: {
        success: true,
        signleUser: userMap[ticket.user.toString()] || null
      }
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    res.status(200).json({ 
      success: true, 
      tickets: ticketsWithUserDetails,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasMore
      }
    });
  } catch (error) {
    console.error('adminTickets error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
  }
});
exports.addUserByEmail = catchAsyncErrors(async (req, res, next) => {
  try {
    // const tickets = await Ticket.find({ status: 'open' }).populate('user');
    const { email } = req.body;
    const subAdminId = req.body.id; // Assuming you get sub-admin ID from authentication middleware

    // Find the user by email
    let user = await UserModel.findOne({ email });

    if (!user) {
      return next(new errorHandler("User not found", 404));
    }
    if (user._id == subAdminId) {
      return next(new errorHandler("Sub admin cannot assign to themself", 404));
    }
    if (user.isShared) {
      return next(new errorHandler("User already shared globally", 404));
    }
    if (user.role == "subadmin" || user.role == "admin" || user.role == "superadmin") {
      return next(new errorHandler("Only regular users can be assigned to the sub admin", 404));
    }

    // Check if user is already assigned
    if (user.assignedSubAdmin) {
      return next(new errorHandler("User already assigned to subadmin", 403));
    }

    // Assign the sub-admin
    user.assignedSubAdmin = subAdminId;
    await user.save();

    res.status(200).json({ success: true, msg: "User assigned successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Sommething went wroong' });
  }
});
exports.applyCreditCard = catchAsyncErrors(async (req, res, next) => {
  try {

    // const tickets = await Ticket.find({ status: 'open' }).populate('user');
    const { userId, type, status } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.cryptoCard = { status: "applied" };
    const existingApplication = await notificationSchema.findOne({
      userId,
      type: "card_request",
      status: "applied",
    });

    if (existingApplication) {

      return next(new errorHandler("You already have a pending credit card application.", 400));
    }
    await notificationSchema.create({
      userId,
      type,
      content: `You have a new credit card application from ${user.firstName}  ${user.lastName}.`,
      status: status,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`
    });

    await user.save();

    // Assign the sub-admin
    // user.assignedSubAdmin = subAdminId;
    // await user.save();

    res.status(200).json({ success: true, msg: "Credit card applied successfully" });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Sommething went wroong' });
  }
});
exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get current user from request (set by auth middleware)
    const currentUserId = req.user._id;
    const currentUserRole = req.user.role;

    // Build filter query based on user role
    let filterQuery = {};

    // If subadmin, filter notifications for assigned or shared users only
    if (currentUserRole === 'subadmin') {
      // Find all users that are either shared or assigned to this subadmin
      const accessibleUsers = await UserModel.find({
        $or: [
          { isShared: true },
          { assignedSubAdmin: currentUserId }
        ]
      }).select('_id').lean();

      const userIds = accessibleUsers.map(user => user._id);

      // Filter notifications to only show those from accessible users
      filterQuery = {
        userId: { $in: userIds }
      };
    }
    // Admin and superadmin see all notifications (no filter needed)

    // Get total count for pagination with filter
    const totalCount = await notificationSchema.countDocuments(filterQuery);

    // Fetch notifications with pagination, sorted by most recent first
    let notifications = await notificationSchema
      .find(filterQuery)
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    res.status(200).json({ 
      success: true, 
      notifications,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasMore
      }
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
});

exports.updateNotificationStatus = catchAsyncErrors(async (req, res, next) => {
  try {
    let status = req.params.status;
    let id = req.params.id;
    
    const notification = await notificationSchema.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }

    notification.isRead = status;
    await notification.save();

    res.status(200).json({ 
      success: true, 
      msg: 'Notification status updated', 
      isRead: notification.isRead 
    });
  } catch (error) {
    console.error('updateNotificationStatus error:', error);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
});

exports.userCryptoCard = catchAsyncErrors(async (req, res, next) => {
  try {
    let { cardNumber, cardName, cardExpiry, cardCvv, ticketId, userId } = req.body;

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    user.cryptoCard = {
      status: "active",
      cardNumber: cardNumber,
      cvv: cardCvv,
      cardName: cardName,
      Exp: cardExpiry
    };
    await user.save();

    const notification = await notificationSchema.findById(ticketId);

    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }

    notification.isRead = true;
    notification.status = 'active';
    await notification.save();

    res.status(200).json({ success: true, msg: 'Crypto Card activated' });
  } catch (error) {
    console.error('userCryptoCard error:', error);
    res.status(500).json({ success: false, msg: 'Something went wrong' });
  }
});
// exports.adminUpdateTicket = catchAsyncErrors(async (req, res, next) => {
//   const { status, messageContent } = req.body; // New status and message content

//   try {
//     // Find the ticket by ID
//     const ticket = await Ticket.findById(req.params.ticketId);
//     if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

//     // Update the status
//     ticket.status = status;
//     ticket.updatedAt = Date.now();

//     // Save the ticket
//     await ticket.save();

//     // Send the message from the admin
//     if (messageContent) {
//       const message = new Message({
//         ticket: ticket._id,
//         sender: 'admin', // 'admin' as the sender
//         content: messageContent
//       });

//       // Save the message
//       await message.save();

//       // Add the message to the ticket's messages array
//       ticket.messages.push(message._id);
//       await ticket.save();
//     }

//     res.status(200).json({ ticket, message: 'Ticket updated and message sent successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update status or send message' });
//   }
// });

const generateTicketId = async () => {
  // Find the highest ticket ID from existing tickets
  const startingId = 425;
  const existingTickets = await Ticket.find({}, { ticketId: 1 });
  const existingIds = new Set(existingTickets.map(ticket => parseInt(ticket.ticketId.split('-')[1], 10)));

  // Extract the numeric part from the last ticket ID
  let newId = startingId; // Start with 1 if there are no tickets

  while (existingIds.has(newId)) {
    newId++; // Increment the new ID if it exists
  }

  const paddedCount = newId.toString().padStart(3, '0'); // Pad to 3 digits
  return `tct-${paddedCount}`; // Format as tct-00X
};
exports.createTicket = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId, title, description, isAdmin } = req.body;

    // Validate input
    if (!title || !description || !userId) {

      return next(new errorHandler("Title and description are required", 400));
    }
    const objectId = new mongoose.Types.ObjectId(userId);
    const signleUser = await UserModel.findById({ _id: objectId })
    if (!signleUser) {
      return next(new errorHandler("User not found", 404));
    }
    const ticketId = await generateTicketId();
    // Create a new ticket object
    const newTicket = new Ticket({
      user: userId,
      ticketId,
      title,
      status: 'open',
      ticketContent: [{
        sender: isAdmin ? 'admin' : 'user', // Set to 'user' initially
        description,
        createdAt: Date.now() // Current timestamp
      }]
    });
    if (isAdmin === false) {
      let checkNotification = await notificationSchema.create({
        userId,
        ticketId,
        type: "ticket_message",
        content: `You have a new support Ticket from ${signleUser.firstName}  ${signleUser.lastName}.`,
        status: "open",
        userEmail: signleUser.email,
        userName: `${signleUser.firstName} ${signleUser.lastName}`
      });
    }
    // Save the ticket 
    await newTicket.save();

    // Respond with the created ticket
    res.status(201).json({ success: true, ticket: newTicket });
    if (isAdmin) {

      let subject = `${process.env.WebName} Customer Support - Re: ${ticketId} `;
      let text = `Hi there,

We've opened a new request (#${ticketId}) for you.  

You can check the details and provide any input by clicking the link below.  

Here's the link: ${process.env.BASE_URL}/tickets/${ticketId}  

Let us know if you need further assistance.  

Best regards,  
${process.env.WebName} Team`;

      try {
        await sendEmail(signleUser.email, subject, text);
        console.log(`Ticket email sent successfully to user ${signleUser.email} for ticket ${ticketId}`);
      } catch (emailError) {
        console.error(`Failed to send ticket email to user ${signleUser.email}:`, emailError);
        // Don't fail the ticket creation, just log the error
      }

    } else {
      // Send email to admin in background (non-blocking)
      const adminEmailSubject = `🎫 New Support Ticket #${ticketId} from ${signleUser.firstName} ${signleUser.lastName}`;
      const adminEmailText = `Hi Admin,

A new support ticket has been created by a user.

📋 Ticket Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Ticket ID: #${ticketId}
• Title: ${title}
• Status: Open
• Created: ${new Date().toLocaleString()}

👤 User Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${signleUser.firstName} ${signleUser.lastName}
• Email: ${signleUser.email}
• User ID: ${userId}

📝 Description:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${description}

🔗 View & Respond:
${process.env.BASE_URL}/admin/ticket/user/${userId}/${ticketId}

Please review and respond to this ticket as soon as possible.

Best regards,  
${process.env.WebName} Support System`;

      // Send email asynchronously (non-blocking)
      setImmediate(async () => {
      try {
          await sendEmail(process.env.USER, adminEmailSubject, adminEmailText);
          console.log(`✅ Admin notification email sent successfully for ticket #${ticketId} from ${signleUser.email}`);
      } catch (emailError) {
          console.error(`❌ Failed to send admin notification email for ticket #${ticketId}:`, emailError.message);
          // Email failure doesn't affect ticket creation
      }
      });
    }
  } catch (error) {  // Log the error for debugging

    res.status(500).json({ success: false, msg: 'Server error', error: error.message });
  }
});
exports.getUserTickets = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;

    const tickets = await Ticket.find({ user: id });
    // const tickets = await Ticket.find({ user: id }).populate('user');


    // Respond with the created ticket
    res.status(201).json({ success: true, ticket: tickets });
  } catch (error) {
    console.error('Error creating ticket:', error); // Log the error for debugging
    res.status(500).json({ success: false, msg: 'Server error', error: error.message });
  }
});
exports.getIndivTicket = catchAsyncErrors(async (req, res, next) => {
  const { id, ticketId } = req.params;

  const tickets = await Ticket.find({ user: id, ticketId });

  if (!tickets || tickets.length === 0) {
    return next(new errorHandler("Ticket not found", 404));
  }

  // Respond with the found ticket
  res.status(200).json({ success: true, ticket: tickets });
});


exports.updateMessage = catchAsyncErrors(async (req, res, next) => {
  const { status, userId, ticketId, description, sender } = req.body;


  // Validate the input
  if (!userId || !ticketId || !description || !sender) {
    return next(new errorHandler("User ID, Ticket ID, message content, and sender are required.", 400));
  }

  try {
    // Find the ticket by userId and ticketId
    const ticket = await Ticket.findOne({ ticketId: ticketId, user: userId });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        msg: 'Ticket not found!.',
      });
    }

    // Create a new message object
    const newMessage = {
      description: description,
      sender: sender,
      createdAt: new Date(),
    };

    // Add the new message to the ticketContent array
    ticket.ticketContent.push(newMessage);

    // Update the updatedAt field with the current date
    ticket.updatedAt = new Date();
    ticket.status = status;

    // Save the updated ticket
    await ticket.save();
    let existingNotification = await notificationSchema.findOne({ ticketId: ticketId });

    if (existingNotification) {
      // If the notification exists, update it with the new content
      existingNotification.content = `The ticket number #${ticketId} just received a new message`;
      existingNotification.isRead = false;
      existingNotification.createdAt = Date.now();
      await existingNotification.save();
    } else {
      // If no notification exists, create a new notification
      let signleUser = await UserModel.findById({ _id: userId });

      if (!signleUser) {
        console.error(`User with ID ${userId} not found.`);
        return res.status(500).json({
          success: false,
          msg: 'User not found.',
        });
      }

      let checkNotification = await notificationSchema.create({
        userId,
        ticketId,
        type: "ticket_message",
        content: `You have a new support ticket  message from ${signleUser.firstName} ${signleUser.lastName}.`,
        status: "open",
        userEmail: signleUser.email,
        userName: `${signleUser.firstName} ${signleUser.lastName}`,
      });
    }

    // Send response immediately after ticket is saved
    res.status(200).json({
      success: true,
      msg: 'Ticket updated successfully.',
      ticket: ticket,
    });

    // Handle email sending in background (non-blocking)
    if (sender === "admin") {
      try {
        let signleUser = await UserModel.findById({ _id: userId });

        if (!signleUser) {
          console.error(`User with ID ${userId} not found for email.`);
          return;
        }

        let subject = `${process.env.WebName} Customer Support - Re: ${ticketId} `;
        let text = `Hi there,

We wanted to let you know that your request (#${ticketId}) has been updated.

You can check out our response and add any additional comments by clicking on the link below.

Here's the link: ${process.env.BASE_URL}/tickets/${ticketId}`;

        await sendEmail(signleUser.email, subject, text);
        console.log(`Email sent successfully to user ${userId} for ticket ${ticketId}`);
      } catch (emailError) {
        console.error(`Failed to send email to user ${userId} for ticket ${ticketId}:`, emailError);
        // Add email failure flag to the last admin message for admin visibility
        try {
          // Find the last admin message and add email failure flag
          const lastAdminMessage = ticket.ticketContent[ticket.ticketContent.length - 1];
          if (lastAdminMessage && lastAdminMessage.sender === 'admin') {
            lastAdminMessage.emailFailed = true;
            await ticket.save();
            console.log(`Email failure flag added to admin message for ticket ${ticketId}`);
          } else {
            console.log(`No admin message found to add email failure flag for ticket ${ticketId}`);
          }
        } catch (saveError) {
          console.error('Failed to save email failure flag:', saveError);
        }
      }
    } else {
      // User sent a message - send email to admin in background (non-blocking)
      const signleUser = await UserModel.findById({ _id: userId });
      
      if (signleUser) {
        const adminEmailSubject = `💬 New Reply on Ticket #${ticketId} from ${signleUser.firstName} ${signleUser.lastName}`;
        const adminEmailText = `Hi Admin,

A user has replied to their support ticket.

📋 Ticket Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Ticket ID: #${ticketId}
• Title: ${ticket.title}
• Status: ${status}
• Last Updated: ${new Date().toLocaleString()}

👤 User Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${signleUser.firstName} ${signleUser.lastName}
• Email: ${signleUser.email}
• User ID: ${userId}

💬 Latest Message:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${description}

🔗 View & Respond:
${process.env.BASE_URL}/admin/ticket/user/${userId}/${ticketId}

Please review and respond to this ticket update.

Best regards,  
${process.env.WebName} Support System`;

        // Send email asynchronously (non-blocking)
        setImmediate(async () => {
          try {
            await sendEmail(process.env.USER, adminEmailSubject, adminEmailText);
            console.log(`✅ Admin notification email sent successfully for ticket update #${ticketId} from ${signleUser.email}`);
      } catch (emailError) {
            console.error(`❌ Failed to send admin notification email for ticket update #${ticketId}:`, emailError.message);
            // Email failure doesn't affect ticket update
            // Optionally add email failure flag to the last user message
        try {
          const lastUserMessage = ticket.ticketContent[ticket.ticketContent.length - 1];
          if (lastUserMessage && lastUserMessage.sender === 'user') {
            lastUserMessage.emailFailed = true;
            await ticket.save();
          }
        } catch (saveError) {
          console.error('Failed to save email failure flag:', saveError);
        }
          }
        });
      } else {
        console.error(`User with ID ${userId} not found for admin email notification.`);
      }
    }

  } catch (error) {

    return res.status(500).json({
      success: false,
      msg: 'An error occurred while updating the ticket.',
      error: error.message,
    });
  }
});

// stocks
exports.addNewStock = catchAsyncErrors(async (req, res, next) => {
  try {


    const { symbol, name, price } = req.body;

    // Check if stock already exists
    const existingStock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (existingStock) {
      return next(new errorHandler("Stock with this symbol already exists", 400));
    }

    const newStock = new Stock({
      symbol: symbol.toUpperCase(),
      name,
      price,
    });

    await newStock.save();

    res.status(201).json({ success: true, stock: newStock });
  } catch (error) {

    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});
exports.getStocks = catchAsyncErrors(async (req, res, next) => {
  try {

    const customStocks = await Stock.find();
    res.json({ success: true, stocks: customStocks });
  } catch (error) {

    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});
exports.updateStock = catchAsyncErrors(async (req, res, next) => {
  try {


    const { symbol, name, price } = req.body;

    const stockId = req.params.id;

    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      { symbol: symbol.toUpperCase(), name, price },
      { new: true }
    );

    if (!updatedStock) {
      return next(new errorHandler("Stock not found", 404));
    }

    res.json({ success: true, stock: updatedStock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});
// exports.updateToken = catchAsyncErrors(async (req, res, next) => {
//   try {


//     const { symbol, name, price } = req.body;

//     const stockId = req.params.id;

//     const updatedStock = await Stock.findByIdAndUpdate(
//       stockId,
//       { symbol: symbol.toUpperCase(), name, price },
//       { new: true }
//     );

//     if (!updatedStock) {
//       return res.status(404).json({ success: false, msg: 'Stock not found' });
//     }

//     res.json({ success: true, stock: updatedStock });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, msg: 'Server error' });
//   }
// });
exports.deleteStock = catchAsyncErrors(async (req, res, next) => {
  try {

    const stockId = req.params.id;
    const deletedStock = await Stock.findByIdAndDelete(stockId);

    if (!deletedStock) {
      return next(new errorHandler("Stock not found", 404));
    }

    res.json({ success: true, msg: 'Stock deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// routes/stockRoutes.js

// Add new stock (Admin only)



// 
// routes/stockRoutes.js

// Update stock


// Delete stock

const defaultLinks = [
  {
    name: "Crypto Card",
    path: "/crypto-card",
    enabled: true,
  },
  {
    name: "AI Trading Bot",
    path: "/trading",
    enabled: true,
  },
  {
    name: "My Stocks",
    path: "/stocks/:id",
    enabled: true,
  },
  {
    name: "Documents",
    path: "/all-files",
    enabled: true,
  },
  {
    name: "Exchanges",
    path: "/exchanges",
    enabled: true,
  },
  {
    name: "Payment Methods",
    path: "/account",
    enabled: true,
  },
  {
    name: "Staking",
    path: "/staking",
    enabled: true,
  },
  {
    name: "Swap",
    path: "/swap",
    enabled: true,
  },
  {
    name: "My Tokens",
    path: "/tokens",
    enabled: true,
  },
  {
    name: "Referral System",
    path: "/user/referral-promo,/user/affiliate",
    enabled: true,
  },
];

exports.getLinks = catchAsyncErrors(async (req, res, next) => {
  try {
    // 1️⃣ Get all existing DB links
    const dbLinks = await userLink.find().sort({ _id: 1 });

    // 2️⃣ Find which defaultLinks are missing in DB
    const dbNames = dbLinks.map(link => link.name);
    const newLinks = defaultLinks.filter(def => !dbNames.includes(def.name));

    // 3️⃣ Insert any new default links
    if (newLinks.length > 0) {
      await userLink.insertMany(newLinks);
    }

    // 4️⃣ Fetch again to include newly inserted ones
    const updatedLinks = await userLink.find().sort({ _id: 1 });

    res.status(200).json({
      success: true,
      links: updatedLinks,
    });
  } catch (err) {
    console.error("getLinks error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

exports.updateLinks = catchAsyncErrors(async (req, res, next) => {
  try {

    const enabled = req.params.mode;
    const link = await userLink.findByIdAndUpdate(
      req.params.id,
      { enabled: enabled },
      { new: true }
    );
    res.json({ success: true, link });
  } catch (error) {

    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});
exports.createLink = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, path, enabled } = req.body;

    const link = await userLink.create({
      name,
      path,
      enabled: enabled ?? true, // default true
    });

    res.status(201).json({
      success: true,
      link,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.deleteTicket = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticketStatus = await Ticket.findByIdAndDelete(id);

    res.status(201).json({
      success: true,
      ticketStatus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.deleteNotification = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationSchema.findByIdAndDelete(id);

    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }
    res.status(201).json({
      success: true,
      msg: 'Notification deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.deleteAllNotifications = catchAsyncErrors(async (req, res, next) => {
  try {
    // const userId = req.params.userId; // Assuming you have user authentication
    await notificationSchema.deleteMany({});

    res.status(201).json({
      success: true,
      msg: 'All notifications deleted successfully',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.addMyTokens = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.params.userId; // Assuming you have user authentication
    const { name, symbol, quantity, value, totalValue } = req.body;
    let files = req.files
    if (!files || files.length === 0) {
      return next(new errorHandler("Please upload the logo", 400));

    }
    const uploadFileToCloudinary = (fileBuffer, fileName) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: `tokenlogo/${Date.now()}`, // better: auto folder per user
            public_id: fileName.split(".")[0], // remove extension
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );

        stream.end(fileBuffer); // pipe buffer into cloudinary stream
      });
    };

    const logoFile = files.find((file) => file.fieldname === 'logo');

    const logoUrl = await uploadFileToCloudinary(logoFile.buffer, logoFile.originalname);


    if (!name || !symbol || !quantity || !value) {
      return next(new errorHandler("All fields are required", 400));
    }


    const user = await UserModel.findById(userId);
    if (!user) return next(new errorHandler("User not found", 404));

    const myToken = await MyTokens.create({
      user: user._id,
      logo: logoUrl,
      name,
      symbol,
      quantity,
      value,
      totalValue
    });


    res.status(201).json({
      success: true,
      msg: 'Token added successfully',
      myToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.getAllTokens = catchAsyncErrors(async (req, res, next) => {
  try {
    let id = req.params.id
    const allTokens = await MyTokens.find({ user: id });
    res.json({ success: true, stocks: allTokens });


  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.getMyTokens = catchAsyncErrors(async (req, res, next) => {
  try {
    let id = req.params.id
    const myTokens = await MyTokens.find({ user: id });
    res.json({ success: true, myTokens });


  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
exports.deleteUserTokens = catchAsyncErrors(async (req, res, next) => {
  const { id, coindId } = req.params; // User ID

  // Check if stockId is provided
  if (!coindId) {
    return next(new errorHandler("Token ID is required for deletion", 400));
  }

  // Find the user and pull (remove) the specific stock from the array
  const deletedToken = await MyTokens.findOneAndDelete({
    _id: coindId,
    user: id,
  });

  if (!deletedToken) {
    return next(new errorHandler("Token not found or not owned by user", 404))

  }

  res.status(200).send({
    success: true,
    msg: "Token deleted successfully",
    deletedToken
  });
});
exports.updateToken = catchAsyncErrors(async (req, res, next) => {
  try {


    const { logo, symbol, quantity, value, totalValue, name } = req.body;
    console.log('req.body: ', req.body);

    const tokenId = req.params.id;

    const updatedToken = await MyTokens.findByIdAndUpdate(
      tokenId,
      {
        $set: {
          logo,
          symbol: symbol.toUpperCase(),
          name,
          quantity,
          value,
          totalValue
        }
      },
      { new: true }
    );

    if (!updatedToken) {
      return next(new errorHandler("Stock not found", 404));
    }

    res.json({ success: true, stock: updatedToken });
  } catch (err) {
    console.error(err);
    return next(new errorHandler(err.msg || 'Server error', 500))
  }
});
exports.getUsersRestrictions = catchAsyncErrors(async (req, res) => {
  let settings = await UserRestriction.findOne();
  // only one document 
  if (!settings) settings = new UserRestriction();

  await settings.save();
  if (!settings) {

    return next(new errorHandler("Restrictions not found", 404))
  }
  res.json({ success: true, data: settings });
});

// 🔹 Create or Update the single document (admin only)
exports.updateUsersRestrictions = catchAsyncErrors(async (req, res) => {
  const {
    withdrawal2Fa
  } = req.body;

  // Find the single settings doc or create if not exists
  let settings = await UserRestriction.findOne();

  if (!settings) settings = new UserRestriction();

  settings.withdrawal2Fa =
    typeof withdrawal2Fa === "boolean" ? withdrawal2Fa : settings.withdrawal2Fa;



  await settings.save();

  res.json({ success: true, msg: "Data updated successfully", data: settings });
});


exports.updateSubAdminPermissions = catchAsyncErrors(async (req, res) => {

  const updated = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: Object.entries(req.body).reduce((acc, [k, v]) => {
        acc[`permissions.${k}`] = v; return acc;
      }, {})
    },
    { new: true }
  );


  res.json({ success: true, msg: "Data updated successfully", updated });
});
exports.updateAdminPermissions = catchAsyncErrors(async (req, res) => {

  const updated = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      $set: Object.entries(req.body).reduce((acc, [k, v]) => {
        acc[`adminPermissions.${k}`] = v; return acc;
      }, {})
    },
    { new: true, upsert: true }
  );


  res.json({ success: true, msg: "Data updated successfully", updated });
});
// ✅ GET /api/logs?page=1
// controller
exports.getLogs = catchAsyncErrors(async (req, res) => {
  const user = req.user; // current logged-in superadmin
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  // ✅ Fetch all logs normally
  const [logs, total] = await Promise.all([
    errorLogs
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), // use lean() so we can safely mutate fields
    errorLogs.countDocuments()
  ]);

  // ✅ Hide userId if the log belongs to the current superadmin
  const filteredLogs = logs.map(log => {
    if (log.userId?.toString() === user._id.toString()) {
      const { userId, ...rest } = log;
      return rest; // return log without userId
    }
    return log; // return as is
  });

  res.json({
    success: true,
    logs: filteredLogs,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total
    }
  });
});

exports.deleteLogs = catchAsyncErrors(async (req, res) => {
  const ids = req.query.ids ? req.query.ids.split(",") : [];
  console.log("ids:", ids);

  if (ids.length) {
    await errorLogs.deleteMany({ _id: { $in: ids } });
  } else {
    await errorLogs.deleteMany(); // delete all
  }

  res.json({ success: true, message: "Logs deleted" });
});
