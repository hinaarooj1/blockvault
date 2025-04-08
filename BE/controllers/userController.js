let UserModel = require("../models/userModel");
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
const Message = require("../models/message");
const { default: mongoose } = require("mongoose");
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
    // role,
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
  let findUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (findUser) {
    return next(
      new errorHandler("Email  already exists, please sign in to continue", 500)
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
  });
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
  let sendEmailError = await sendEmail(createUser.email, subject, text);
  if (sendEmailError) {
    // Log the error for debugging
    console.error("Failed to send email:", sendEmailError);

    // Respond with an error status and message
    return res.status(500).send({
      msg: "Registration successful, but email could not be sent. Please login to continue!",
      success: true,
      error: sendEmailError.message,
      // Optional: include the error message
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
    // role,
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
    role: "subadmin", verified: true
  });



  res.status(201).send({
    msg: "Sub admin added successfully",
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
      await sendEmail(UserAuth.email, subject, text);
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
      // await sendEmail(UserAuth.email, subject, text);
      let sendEmailError = await sendEmail(UserAuth.email, subject, text);
      if (sendEmailError) {
        // Log the error for debugging
        console.error("Failed to send email:", sendEmailError);

        // Respond with an error status and message
        return res.status(500).send({
          msg: "Email verification link sending failed. Please try again.",
          success: false,
          error: sendEmailError.message, // Optional: include the error message
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

  jwtToken(UserAuth, 200, res);
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
  console.log("userEmail: ", userEmail);

  let newTitle = `Blochain user ticket`;
  let newDescription = `
From:
${userEmail.firstName}
${userEmail.email}


Ticket Title: 
${title}

Ticket Description:
${description}`;

  let sendEmailError = await sendEmail("admin@tokentrade.pro", newTitle, newDescription);
  if (sendEmailError) {
    // Log the error for debugging
    console.error("Failed to send email:", sendEmailError);

    // Respond with an error status and message
    return res.status(500).send({
      msg: "Ticket submission failed, please try again!",
      success: false,
      error: sendEmailError.message, // Optional: include the error message
    });
  }

  res.status(200).send({
    msg: "Your ticket was sent. You will be answered by one of our representatives.",
    success: true,
  });
  await sendEmail("admin@tokentrade.pro", newTitle, newDescription);


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
  const { email, id, code } = req.body;
  let _id = id;

  await UserModel.findById(_id);
  let subject = `KYC Verification OTP`;
  let text = `Your OTP for the verification of KYC: 

${code}
`;
  let sendEmailError = await sendEmail(email, subject, text);
  if (sendEmailError) {
    // Log the error for debugging
    console.error("Failed to send email:", sendEmailError);

    // Respond with an error status and message
    return res.status(500).send({
      msg: "OTP sending failed, please try again!",
      success: false,
      error: sendEmailError.message, // Optional: include the error message
    });
  }

  res.status(201).send({
    msg: "An OTP has been sent to your email, please enter it to continue",
    success: true,
  });

});

// Logout User

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwttoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    msg: "User Logged out successfully",
  });
});
exports.allUser = catchAsyncErrors(async (req, res, next) => {
  let allUsers = await UserModel.find();
  res.status(200).send({
    success: true,
    msg: "All Users",
    allUsers,
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
  const {
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
    currency
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !city ||
    !country
    ||
    !postalCode
    ||
    !currency
  ) {
    return next(
      new errorHandler(
        "You can't leave any field empty except note field!",
        500
      )
    );
  }
  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      firstName,
      lastName,
      email,
      password,
      phone,
      progress,
      address,
      city,
      country,
      postalCode,
      note,
      currency
    },
    { new: true }
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
  let descriptionUpdate = await htmlModel.findByIdAndUpdate(
    { _id: id },
    {
      description: description,
    },
    {
      upsert: true,
      new: true,
    }
  );
  res.status(200).send({
    success: true,
    msg: "Description Updated successfully",
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
  console.log('billUrl: ', billUrl);
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

  res.status(200).send({
    success: true,
    msg: "Thank you for submitting KYC documents.",
    signleUser,
  });
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
  console.log("req.body: ", req.body);

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
    // const tickets = await Ticket.find({ status: 'open' }).populate('user');
    const tickets = await Ticket.find();
    res.status(200).json({ success: true, tickets });
  } catch (error) {
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
    console.log('user: ', user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user is already assigned
    if (user.assignedSubAdmin) {
      return res.status(403).json({ msg: "User already assigned to you or another admin" });
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
    console.log('existingApplication: ', existingApplication);

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        msg: "You already have a pending credit card application."
      });
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
    console.log('error: ', error);
    res.status(500).json({ success: false, msg: 'Sommething went wroong' });
  }
});
exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  try {



    // Find the user by email
    let notifications = await notificationSchema.find();



    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ success: false, msg: 'Sommething went wroong' });
  }
});
exports.updateNotificationStatus = catchAsyncErrors(async (req, res, next) => {
  try {

    let status = req.params.status;
    console.log('status: ', status);
    let id = req.params.id
    // Find the user by email
    const notification = await notificationSchema.findById(id);

    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }

    notification.isRead = status;
    await notification.save();

    res.status(200).json({ success: true, msg: 'Notification status updated', isRead: notification.isRead });


  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ success: false, msg: 'Sommething went wroong' });
  }
});
exports.userCryptoCard = catchAsyncErrors(async (req, res, next) => {
  try {

    let { cardNumber, cardName, cardExpiry, cardCvv, ticketId, userId } = req.body;

    // Find the user by email
    const user = await UserModel.findById(userId);
    user.cryptoCard = {
      status: "active",
      cardNumber: cardNumber,
      cvv: cardCvv,
      cardName: cardName,
      Exp: cardExpiry // optional if you have more fields
    };
    await user.save();

    console.log('user: ', user);
    const notification = await notificationSchema.findById(ticketId);

    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }

    notification.isRead = true;
    notification.status = 'active';
    await notification.save();

    res.status(200).json({ success: true, msg: 'Crypto Card activated' });


  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ success: false, msg: 'Sommething went wroong' });
  }
});
exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  try {



    // Find the user by email
    let notifications = await notificationSchema.find();



    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ success: false, msg: 'Sommething went wroong' });
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
      return res.status(400).json({ success: false, msg: 'title and description are required' });
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
    console.log('isAdmin: ', isAdmin);
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
      console.log(checkNotification);
    }
    // Save the ticket 
    await newTicket.save();

    // Respond with the created ticket
    res.status(201).json({ success: true, ticket: newTicket });
    if (isAdmin) {

      let subject = `${process.env.WebName} Customer Support - Re: ${ticketId} `;
      let text = `Hi there,

We’ve opened a new request (#${ticketId}) for you.  

You can check the details and provide any input by clicking the link below.  

Here’s the link: ${process.env.BASE_URL}/tickets/${ticketId}  

Let us know if you need further assistance.  

Best regards,  
${process.env.WebName} Team`;
      // 
      await sendEmail(signleUser.email, subject, text);

    }
  } catch (error) {  // Log the error for debugging
    console.log('error: ', error);
    res.status(500).json({ success: false, msg: 'Server error', error: error.message });
  }
});
exports.getUserTickets = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('id: ', id);

    const tickets = await Ticket.find({ user: id });
    // const tickets = await Ticket.find({ user: id }).populate('user');

    console.log('tickets: ', tickets);

    // Respond with the created ticket
    res.status(201).json({ success: true, ticket: tickets });
  } catch (error) {
    console.error('Error creating ticket:', error); // Log the error for debugging
    res.status(500).json({ success: false, msg: 'Server error', error: error.message });
  }
});
exports.getIndivTicket = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id, ticketId } = req.params;


    const tickets = await Ticket.find({ user: id, ticketId });


    // Respond with the created ticket
    res.status(201).json({ success: true, ticket: tickets });
  } catch (error) {
    console.error('Error creating ticket:', error); // Log the error for debugging
    res.status(500).json({ success: false, msg: 'Server error', error: error.message });
  }
});


exports.updateMessage = catchAsyncErrors(async (req, res, next) => {
  const { status, userId, ticketId, description, sender } = req.body;
  console.log('req.body: ', req.body);

  // Validate the input
  if (!userId || !ticketId || !description || !sender) {
    return res.status(400).json({
      success: false,
      msg: 'User ID, Ticket ID, message content, and sender are required.',
    });
  }

  try {
    // Find the ticket by userId and ticketId
    const ticket = await Ticket.findOne({ ticketId: ticketId, user: userId });
    console.log('ticket: ', ticket);

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
        return  // Prevents further execution if user is not found
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
      console.log(checkNotification);
    }
    res.status(200).json({
      success: true,
      msg: 'Ticket updated successfully.',
      ticket: ticket,
    });
    if (sender === "admin") {
      let signleUser = await UserModel.findById({ _id: userId });

      if (!signleUser) {
        console.error(`User with ID ${userId} not found.`);
        return  // Prevents further execution if user is not found
      }

      let subject = `${process.env.WebName} Customer Support - Re: ${ticketId} `;
      let text = `Hi there,

We wanted to let you know that your request (#${ticketId}) has been updated.

You can check out our response and add any additional comments by clicking on the link below.

Here’s the link: ${process.env.BASE_URL}/tickets/${ticketId}`;
      // 
      await sendEmail(signleUser.email, subject, text);

    }

  } catch (error) {
    console.log('error: ', error);
    return res.status(500).json({
      success: false,
      msg: 'An error occurred while updating the ticket.',
      error: error.message,
    });
  }
});

