const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

async function connection() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB is connected");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { connection };
