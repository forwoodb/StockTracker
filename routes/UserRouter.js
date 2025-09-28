import express from "express";
import { User } from "../models/User.js";
import bcrypt, { compare, hash } from "bcrypt";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ username, password: hashed });
  await user.save();
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  // res.send(req.body);
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const validation = await bcrypt.compare(password, user.password);
  // res.send(user.password);
  if (validation) {
    req.session.user_id = user._id;
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect("/login");
});

export default router;
