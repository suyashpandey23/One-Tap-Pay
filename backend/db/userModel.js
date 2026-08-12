const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide an email / username!"],
    unique: [true, "Email exist"],
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 6,
  },
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
    trim: true,
    maxLength: 50,
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;

