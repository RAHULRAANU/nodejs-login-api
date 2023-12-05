const mongoose = require("mongoose");

const dbConnection = async () =>{

    const conn = await mongoose.connect(process.env.MONGO_URI, {

    useNewUrlParser : true,
    useUnifiedTopology : true,
    // sslValidate:true,
    // sslCA:ca,
    // sslKey:key,
    // sslCert:cert,
    // sslPass:'10gen',
});

    console.log(`MongoDb Connected : ${conn.connection.host}`.cyan.underline.bold);

    
};


module.exports = dbConnection;

