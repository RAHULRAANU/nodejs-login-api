const otpGenerator = require("otp-generator");


// The OTP_LENGTH is a number, For my app i selected 6.
OTP_LENGTH = 6

// The OTP_CONFIG is an object that looks like 


module.exports.generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, { upperCaseAlphabets: true, specialChars: false });
  return OTP;
};


