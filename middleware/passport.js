const passport = require('passport');
const passportJWT = require("passport-jwt");

const JWTStrategy   = passportJWT.Strategy;

const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../Model/user");

passport.use(new JWTStrategy({

  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : "rahulRaanu"
  
},

 function (jwtPayload, done) {
   return User.findById(jwtPayload.sub)
   .then(user => 
   {
     return done(null, user);
   }
 ).catch(err => 
 {
   return done(err);
 });
}
))
