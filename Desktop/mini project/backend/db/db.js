const mongoose = require("mongoose");
const url =
  "mongodb+srv://abelalexk2003:DNaXcDfTJ0nDLueO@cluster0.m3lisra.mongodb.net/expense-tracker?retryWrites=true&w=majority";
const db = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { db };