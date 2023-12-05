const bcrypt = require("bcryptjs");
const passport = require("passport");
const passportConfig = require("../config/passport");
const User = require("../Model/user");
const jwt = require("jsonwebtoken");


passportConfig(passport);

// @desc    User Registration
// @route   POST api/user/register
// @access  Public

exports.register = async (req, res, next) => {

  const { name, email, role, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    return next(res.status(404).json({ "Error": "Please Enter All Fields" }));
  }

  if (password !== password2) {
    return next(res.status(404).json({ "Error": "Passwords do not match" }));
  }

  try {

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(404).json({ "Error": "Email Already Exists" });
    }

  // Create User instance based on the schema
  const newUser = new User({
    name,
    email,
    password,
    role
  });

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  // Save the user to the database
  await newUser.save();

  return res.status(201).json({ "Success": "User registered successfully" });

} catch (err) {  
  console.error(err);
  return res.status(500).json({ "Error": "Internal Server Error" });
}
};


// @desc    User Login
// @route   POST api/user/Login
// @access  Public

exports.login = async(req, res, next) => {

  passport.authenticate('local', { session: false }, (err, user, info) => {

    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ "Error": "Internal Server Error" });
    }

    if (!user) {
      console.error('Authentication failed:', info);
      return res.status(401).json({ "Error": "Authentication failed" });
    }

    // Generate a token or handle the authentication success as needed
    // const response = {
    //   message: "Authentication successful",
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role
    //   }
    // };

    // For Cookies Expire
     const options = {
      expiresIn: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };


    const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET,  
    { expiresIn : process.env.JWT_EXPIRE});

    return res.status(200).cookie("token", token, options).json({"Success": true, token});
  })(req, res, next);
};



// @desc    User Logout
// @route   GET api/user/Logout
// @access  Public

exports.logout = async (req, res, next) => {

  // Clear the token cookie on the client side
  res.cookie("token", "none", {
    // expiresIn : new Date(Date.now() + 10 * 1000),
    expiresIn: new Date(0),
    httpOnly: true,
  });

  // Send a success response
  res.status(200).json({ "Success": true, "data": {} });
};

