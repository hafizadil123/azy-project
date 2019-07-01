const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  optradio: {
    type: String,
  },
  address: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },
  wordAddress: {
    type: String,

  },
  refferalCode: {
    type: String,

  },
  timestamp: {
    type: Date,
    default: Date.now,
  },


});

module.exports = User = mongoose.model("users", UserSchema);
