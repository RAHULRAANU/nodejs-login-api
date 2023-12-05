const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const dotenv = require("dotenv").config();
const dbConnection = require("./config/db");
const colors = require("colors");
const flash = require("connect-flash"); 
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/error");

// Connect to database
dbConnection();

// load environment variable
// dotenv.config();

// route files
const users = require("./routes/auth");
const post = require("./routes/post");

const app = express();

// Passport Config
require("./config/passport")(passport);

// Body Parser
app.use(express.json());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//cookie parser
app.use(cookieParser());


// Sanitize data
app.use(mongoSanitize());       // Prevent NoSQL Injection

// Set Security Header
app.use(helmet());

// Prevent XSS Attack
app.use(xss());

// Enable cors
app.use(cors());

// Connect flash
app.use(flash());


// Rate Limiting
const limiter = rateLimit({
    windowMs: 10*60*1000, // 10 mins
    max: 5000
})

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Development Logging Middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
} 


// Mount Routers
app.use("/api/users", users);
app.use("/api/post", post);
  
//Error Handler
app.use(errorHandler);

PORT = process.env.PORT || 7777;


// Call Server
const server = app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.NODE_ENV} mode on port ${PORT}`.white.bold)
    });


// Handle UnHandle promise rejection      

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.bgRed);
    //close server and exit process
    server.close(() => process.exit(1));
});


