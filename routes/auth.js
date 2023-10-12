const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { 
    
    register , 
    login , 
    loginPhone ,
    verifyOtp ,
    logout ,
    getMe , 
    forgotPassword , 
    resetPassword , 
    updatedetails ,
    updatePassword

} = require("../Controller/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/loginphone").post(loginPhone)
router.route("/verifyotp").post(verifyOtp);
router.route("/logout").get(logout);
router.route("/me").get(protect, getMe);
router.route("/updatedetails").put(protect, updatedetails);
router.route("/updatepassword").put(protect, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);

module.exports = router;
