import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

dotenv.config();

const generateTokens = (user) => {
  //console.log("++++++++++++++++++++++++++++++++++++++",user)
  return {
    accessToken: jwt.sign(
      { id: user.id, email: user.emails ? user.emails[0].value : "" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    ),
    refreshToken: jwt.sign(
      { id: user.id, email: user.emails ? user.emails[0].value : "" },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    ),
  };
};

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error("No email found in Google profile"), null);
      }
      const { displayName } = profile;
      const email=profile.emails[0].value;

      let user = await User.findOne({ where: { email } });
      if (!user) {
        user = await User.create({
          username: displayName, 
          email:email,
          password_hash: '', 
          refreshToken, 
        });
      }
      //console.log("++++++++++++++++++++++++++++++++++++++++++++++++",user);
      const tokens = generateTokens(user);

      return done(null, { profile, tokens });
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("GitHub Profile:", profile);

        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error("No email found in GitHub profile"), null);
        }

        const email = profile.emails[0].value;
        const username = profile.displayName || profile.username; // Fallback if displayName is missing

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create({
            username,
            email,
            password_hash: "", // Empty because GitHub does not provide passwords
          });
        }

        // Generate JWT token
        const tokens = generateTokens(user);

        return done(null, {profile, tokens });
      } catch (error) {
        console.error("GitHub Auth Error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
