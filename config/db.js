const mongoose = require("mongoose");

const dbConnection = async () =>{

    const conn = await mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser : true,
    // useCreateIndex :  true,              // Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false 
    // useFindAndModify : false,
    useUnifiedTopology : true
});

    console.log(`MongoDb Connected : ${conn.connection.host}`.cyan.underline.bold);

    
};


module.exports = dbConnection;

