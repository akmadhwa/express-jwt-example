const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require("bcrypt");

// const { secret } = require('./keys');

const UserModel = require("../model/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    async (username, password, done) => {
      try {
        const userDocument = await UserModel.findOne({
          username: username
        }).exec();
        const passwordsMatch = await bcrypt.compare(
          password,
          userDocument.passwordHash
        );

        if (passwordsMatch) {
          return done(null, userDocument);
        } else {
          return done("Incorrect Username / Password");
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // get token from header
      secretOrKey: "SECRET"
    },
    (jwtPayload, done) => {
      if (Date.now() > jwtPayload.expires) {
        return done("jwt expired");
      }

      return done(null, jwtPayload);
    }
  )
);
