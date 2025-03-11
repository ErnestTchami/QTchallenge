
import db from "../models/index.js";
const { User } = db;
const isUserExist = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    // Check if the username exists
    const existingUser = await User.findOne({
      where: { username: username }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // Check if the email exists
    const existingEmail = await User.findOne({
      where: { email: email }
    });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    // If both are unique, proceed to next middleware/controller
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default isUserExist;
