const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const dbConnection = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const flash = require("connect-flash");

// const logger = require("./middleware/logger");


// Connect to database
dbConnection();

// route files
// const bootCamp = require("./routes/bootcamp");
// const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/user");
// const reviews = require("./routes/review");

const app = express();


// Body Parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

// File uploading
app.use(fileUpload());

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
    max:100
})

app.use(limiter);

// prevent http param pollution
app.use(hpp());

// Development Logging Middleware
if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
} 


// Set static folder
app.use(express.static(path.join(__dirname,  "/public")));


// app.use(logger);             // instead of logger morgan is used

// Mount Routers
// app.use("/api/v1/bootCamp", bootCamp);
// app.use("/api/v1/course", courses);
app.use("/api/auth", auth);
app.use("/api/users", users);
// app.use("/api/v1/reviews", reviews);

// error Handling
app.use(errorHandler);


PORT = process.env.PORT || 5001;


// Call Server
const server = app.listen(
    PORT, () => {
    console.log(`Server Running on ${process.env.NODE_ENV} mode on port ${PORT}`.white.bold)
    });


// Handle UnHandle promise rejection      

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.bgRed);
    //close server and exit process
    server.close(() => process.exit(1));
});

