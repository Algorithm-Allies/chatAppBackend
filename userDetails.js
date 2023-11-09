const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email addresses are unique
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  profilePic: {
    data: Buffer,
    contentType: String,
  },
});

mongoose.model('User', userSchema);


