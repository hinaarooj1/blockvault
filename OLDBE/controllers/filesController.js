const errorHandler = require("../utils/errorHandler");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary").v2;
const FilesModel = require("../models/filesModel"); // Update the path accordingly

exports.uploadFiles = catchAsyncErrors(async (req, res, next) => {
  const files = req.files;
  const userId = req.params.id; // Assuming the user ID is passed as a parameter
  console.log("userId: ", userId);

  console.log("req.files: ", files);

  // Check if the user exists

  // Map each file to create a new document for each
  const uploadPromises = files.map(async (file) => {
    let name = file.originalname;

    const fileUri = getDataUri(file);
    const fileType = file.mimetype.split("/")[1];

    const myCloud = await cloudinary.uploader.upload(fileUri.content, {
      resource_type: fileType === "image" ? "image" : "raw", // Specify the resource type (image or raw) based on file type
    });

    const newDocument = await FilesModel.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          files: {
            type: file.mimetype,
            name: name,
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
            size: file.size,
          },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
    console.log("newDocument: ", newDocument);

    return newDocument;
  });

  const createdDocuments = await Promise.all(uploadPromises);

  res.status(201).send({
    success: true,
    msg: "Uploaded successfully",
    createdDocuments,
  });
});

exports.getAllData = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const allFiles = await FilesModel.findOne({ user: id });
  // A simple function, follow function path to read description

  res.status(200).send({
    success: true,
    msg: "Data fetched",
    allFiles,
  });
});
exports.deleteSingleFile = catchAsyncErrors(async (req, res, next) => {
  const fileIdToDelete = req.params._id;
  console.log("fileIdToDelete: ", fileIdToDelete);

  // Delete the document based on the inner array's ID
  const result = await FilesModel.findOneAndUpdate(
    { "files._id": fileIdToDelete },
    { $pull: { files: { _id: fileIdToDelete } } },
    { new: true }
  );

  if (!result) {
    return next(
      new errorHandler("File not found or already has been deleted", 400)
    );
  }

  res.status(200).send({
    success: true,
    msg: "File deleted successfully",
  });
});

// Logout User
