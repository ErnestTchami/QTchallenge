import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../models/index.js";
import { userSchema } from "../validators/userValidation.js";

dotenv.config();

const { User } = db;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Signup
export const signup = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    // const validatedData = userSchema.parse(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password_hash: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.name === "ZodError") {
      const errorMessage = error.errors.map((err) => err.message).join(", ");
      return res.status(400).json({ error: errorMessage });
    }
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed", error });
  }
};

// Refresh Token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Token refresh failed", error });
  }
};

// Logout
export const logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) return res.sendStatus(403);

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
};
