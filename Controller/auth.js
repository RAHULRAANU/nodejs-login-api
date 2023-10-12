const crypto = require("crypto");
const asyncHandler = require("../middleware/async");
const User = require("../Model/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");
const { generateOTP } = require("../utils/otp");


// @desc    User Register
// @route   POST api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {

    const { name, email, phone, password } = req.body;

    //Create User
    const user = await User.create({

        name,
        email,
        phone,
        password
    });

  await user.save();

    // Create token 
    // const token = user.getSignedJwtToken();
    res.status(200).json({ "Success" : true});

    // sendTokenResponse(user, 200, res);
});




// @desc    User Login
// @route   POST api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    // Validate email and password
    if(!email || !password){
        return  next(new ErrorResponse("Please Provide an Email And Password", 400));
    };

    // Check for User
    const user = await User.findOne( { email } ).select("+password");

    if(!user){
        return next(new ErrorResponse("Invalid Credentials.. (User Not Found)", 401));
    };

    // Check if password matches
    const isMatch = await user.matchPassword(password); 
    
    if(!isMatch){
        return next(new ErrorResponse("Invalid Credentials.. (Password not match)", 401));
    };
    // Create Token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ "Success" : true, token});
    await user.save();
    sendTokenResponse(user, 200, res);

});




// @desc    User Login by Phone
// @route   POST api/v1/auth/loginPhone
// @access  Public
exports.loginPhone = asyncHandler(async (req, res, next) => {
  
  const { phone } = req.body;

    // Validate phone
    if(!phone){
        return  next(new ErrorResponse("Please Provide a Phone Number", 400));
    };

    // Check for User
    const user = await User.findOne( { phone } );

    if(!user){
    return next(new ErrorResponse("Invalid Credentials.. (User not Registered)", 401));

    };

   //   Generate OTP
  const otp = generateOTP()
  console.log("otp", otp);  


    // Set expiration time to 1 minute from the current time
  const now = new Date();
  const expiration_time = new Date(now.getTime() + 1 * 60000);  

  await User.findByIdAndUpdate(user._id, { phoneOtp: otp , expiration_time : expiration_time});

  await user.save();
  res.status(200).json({ "Success" : true, message:"Otp Generated.. valid for 5 min only"});

  });




// For Validation Generated phone otp
const validateUserSignUp = async (res, next, phone, otp) => {

  const user = await User.findOne({
    phone,
  });

  if (!user) {
        return next(new ErrorResponse("Invalid Credentials.. (Phone not Registered)", 401));
  }

  const now = new Date();

    // Check if OTP has expired
  if (now.getTime() > user.expiration_time) {
    return res.status(400).json({ "Success": false, message: "OTP has expired.. please Regenerate" });
  }


  if (user && user.phoneOtp !== otp) {

    return  next(new ErrorResponse("Invalid otp", 400));
  }

    await User.findByIdAndUpdate(user._id, {
    $set: { phoneOtp : "" }
  });
  await user.save();
    // res.status(200).json({ "Success" : true, message:"login successful"});
  sendTokenResponse(user, 200, res);
};



// @desc    User verify by Phone otp
// @route   POST api/v1/auth/verifyOtp
// @access  Public
exports.verifyOtp = asyncHandler(async (req, res, next) =>{

  const { phone, otp } = req.body;

  await validateUserSignUp(res, next, phone, otp);

});





// @desc Log user out / clear cookie
// @route  GET/api/logout
// @access Private
exports.logout = asyncHandler(async (req, res, next) =>{
  res.cookie("token", "none", {
    expires : new Date(Date.now() + 10 *1000),
    httpOnly : true
  });
  
  res.status(200).json({
    success : true,
    data :  {}
  });

});



// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});



// @desc      Update Password
// @route     PUT /api/v1/auth/me
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id).select("+password");

  if(!(await user.matchPassword(req.body.password))){
    return next(new ErrorResponse("Password is Incorrect", 401));
  }

  user.password = req.body.newpassword;
  await user.save();

  // res.status(200).json({
  //   success: true,
  //   data: user
  // });
   sendTokenResponse(user, 200, res);
});



// @desc      Update User detail
// @route     PUT /api/v1/auth/updateDetails
// @access    Private
exports.updatedetails = asyncHandler(async (req, res, next) => {

  const fieldsToUpdate = {
    name : req.body.name,
    email : req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new : true,
    runValidators : true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});



// @desc      Forgot password
// @route     POST /api/forgotPassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});




// @desc      Reset password
// @route     PUT /api/resetpassword/:resetToken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);

});





// Get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // const options = {
  //   maxAge: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true
  // };

  const options = {
  httpOnly: true,
  // secure: true,
  maxAge: 2 * 60 * 60 * 1000,
  // signed: true
};

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

    res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
   });
};




