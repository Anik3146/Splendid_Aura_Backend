const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    minLength: [3, "Name must be at least 3 characters."],
    maxLength: [100, "Name is too large"],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, "Email address is required"],
  },
  password: {
    type: String,
    minLength: [6, "Must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  contactNumber: String,
  shippingAddress: String,
  phone: { type: String, required: false },
  address: { type: String, required: false },
  bio: { type: String, required: false },
  status: {
    type: String,
    default: "inactive",
    enum: ["active", "inactive", "blocked"],
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
