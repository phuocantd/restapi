const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");

const UserModel = require("./models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, cb) {
      UserModel.find({ email: email })
        .exec()
        .then(user => {
          if (user.length < 1) {
            return cb("Auth failed");
          } else {
            bcrypt.compare(password, user[0].password, (err, result) => {
              if (err) {
                return cb("Auth failed");
              }
              if (result) {
                return cb(
                  null,
                  { email: user[0].email, userId: user[0]._id },
                  {
                    message: "Logged In Successfully"
                  }
                );
              }
              return cb("Failed password");
            });
          }
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_KEY
    },
    async function(jwt_payload, cb) {
      console.log(jwt_payload);
      return cb(null, jwt_payload);
    }
  )
);
