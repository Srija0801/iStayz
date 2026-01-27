const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Successfully Connected to the Database");
  } catch (err) {
    console.error("MongoDB Error : ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
