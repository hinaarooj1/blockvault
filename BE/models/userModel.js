const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

let userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name can't exceed 30 characters"],
    minLength: [2, "Name will have more than 3 characters"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name can't exceed 30 characters"],
    minLength: [2, "Name will have more than 3 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],

    lowercase: true,
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "Please enter a valid Email"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Number"],
    trim: true,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  password: {
    type: String,
    required: [true, "Please enter your Password"],
    minLength: [8, "Password should be more than 8 characters"],
    // It will not come in find() method
  },
  address: {
    type: String,
    required: [true, "Please enter your Address"],
    trim: true,
  },
  city: {
    type: String,
    required: [true, "Please enter your City"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Please enter your Country"],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, "Please enter add postal code"],
    trim: true,
  },
  note: {
    type: String,
    trim: true,
    default: "",
  },

  ticket: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      status: {
        type: String,
      },
      answer: {
        type: String,
      },
    },
  ],
  isShared: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: "user",
  },
  submitDoc: {
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
      trim: true,
      required: true,
    },
    bill: {
      type: String,
    },
    cnic: {
      type: String,
    },      
  },
  verified: {
    type: Boolean,
    default: false,
  },
  kyc: {
    type: Boolean,
    default: false,
  },
  currency: {
    type: String,
    default: "USD",
    enum: ["USD", "EUR"]
  },
  assignedSubAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Reference to the sub-admin
    default: null,
  },
  payments: [
    {
      type: {
        type: String,
        enum: ["bank", "card"],
        required: true,
      },
      bank: {
        accountName: String,
        accountNumber: String,
        iban: String,
        accountNotes: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
      card: {
        cardCategory: String,
        cardName: String,
        cardNumber: String,
        cardNotes: String,
        cardExpiry: String,
        cardCvv: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    },
  ],
  cryptoCard: {
    cardNumber: {
      type: Number,
      required: false,
    },
    cardName: {
      type: String,
      required: false,
    },
    Exp: {
      type: String,
      required: false,
    },
    cvv: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "applied"],
      default: "inactive",
      trim: true,
      required: true,
    }
  }

  ,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_EXPIRE,
  });
};

userSchema.methods.resetPasswordTokenGenerator = async function () {
  // generating token
  let restToken = crypto.randomBytes(20).toString("hex");
  // Making hash of restToken and add to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
};

let userModel = mongoose.model("user", userSchema);

module.exports = userModel;
