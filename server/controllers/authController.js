const { getDB } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const signup = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const { email, password } = req.body;

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = {
      user_id: uuidv4(),
      email,
      password: hashed,
      createdAt: new Date(),
      matches: [],
    };

    await users.insertOne(user);

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token, userId: user.user_id });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const login = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const { email, password } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid login" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ message: "Invalid login" });
    }

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, userId: user.user_id });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = { signup, login };