const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const validator = require('validator');
const validate = require("mongoose-validate");


const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a name']
  },

  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },

  phone: {  
    type: String,
    required: [true, "Please add phone number"],
    unique : true,
    match: /^\d{10}$/,
    allowNull: false,
    trim: true,
    minlength: 10
  },

  // role: {
  //   type: String,
  //   enum: ['user', 'publisher'],
  //   default: 'user'
  // },

  
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },


  expiration_time : {
    type : Date,
    default: Date.now
    // expires: '1m'
    },

  phoneOtp: {
      type: String,
      // required: [true, "otp is require"],
    },    

 
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type : Date,
    default : Date.now
  }

});


// Encrypt Password using bcrypt
UserSchema.pre("save",  async function(next) {
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

});


// Sign Jwt and Return
UserSchema.methods.getSignedJwtToken = function() {

  return jwt.sign({ id: this._id }, 
    process.env.JWT_SECRET, 
    { expiresIn : process.env.JWT_EXPIRE});

};


// Match user entered password to hashed password ,in database 
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 2 * 60 * 1000;

  return resetToken;
};



module.exports = mongoose.model("User", UserSchema);















  // emailOrPhone: {
  //   type: String,
  //   required: [true, 'Please add an email or phone'],
  //   unique: true,
  //   validate:  {

  //       validator: function (value) {
  //         // Check if it's a valid email address
  //         const isEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

  //         // Check if it's a valid 10-digit phone number
  //         const isPhone = /^\d{10}$/.test(value);

  //         // Either it should be a valid email or a valid phone number
  //         return isEmail || isPhone;
  //       },
  //       message: 'Please add a valid email or a valid 10-digit phone number',
  //     },
    
  //   minlength: 10,
  //   sparse:true,
  //   allowNull: false
  // }


