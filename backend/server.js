import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import "./config/passport.js";
import db from "./models/index.js";
import authRoute from "./routes/authRoute.js";
import urlRoutes from "./routes/urlRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", authRoute);
app.use("/urls", urlRoutes);

const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
