// config/crmDatabase.js
const mongoose = require("mongoose");

let crmDB;

async function connectCRMDatabase() {
  try {
    crmDB = await mongoose.createConnection(process.env.CRMDATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ CRM Database connected:");
    return crmDB;
  } catch (error) {
    console.error("❌ CRM Database connection error:", error);
    throw error;
  }
}

module.exports = connectCRMDatabase;
