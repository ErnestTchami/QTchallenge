import express from "express";
import passport from "passport";
import { signup, login, refreshToken, logout } from "../controllers/authController.js";
import isUserExist from "../middleware/checkDuplicateUser.js";

const router = express.Router();

router.post("/register", isUserExist,signup);
router.post("/login", login);
router.post("/token", refreshToken);
router.post("/logout", logout);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication failed" });
      }
      const { tokens } = req.user;
      //res.json(tokens); // Send tokens instead of redirecting
      res.json({ tokens });
    }
  );

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
    "/github/callback",
    passport.authenticate("github", { session: false }),
    (req, res) => {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      //const { tokens } = req.user;
      res.json({ user: req.user.user, token: req.user.tokens });
    }
  );
export default router;
