//require mongoose til at lave vores UserSchema
const mongoose = require('mongoose');

//udfylder skemaet, hvor vi sætter hver attribut til required, dette skal altså udfyldes

const UserSkema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
      type: String, 
      required: true
  },
  preferredGender: {
      type: String, 
      required: true
  }, 
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', UserSkema);

module.exports = User;






