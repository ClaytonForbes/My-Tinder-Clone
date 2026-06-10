const { getDB } = require("../config/db");

// GET /api/messages?userId=X&correspondingUserId=Y
const getMessages = async (req, res) => {
  try {
    const db = getDB();
    const messages = db.collection("messages");

    const { userId, correspondingUserId } = req.query;

    if (!userId || !correspondingUserId) {
      return res.status(400).json({ message: "userId and correspondingUserId are required" });
    }

    // Return messages FROM userId TO correspondingUserId only
    // (ChatDisplay fetches both directions separately)
    const data = await messages
      .find({
        from_userId: userId,
        to_userId: correspondingUserId,
      })
      .sort({ timestamp: 1 })
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/messages
// Body: { timestamp, from_userId, to_userId, message }
const sendMessage = async (req, res) => {
  try {
    const db = getDB();
    const messages = db.collection("messages");

    const { from_userId, to_userId, message, timestamp } = req.body;

    if (!from_userId || !to_userId || !message) {
      return res.status(400).json({ message: "from_userId, to_userId, and message are required" });
    }

    const msg = {
      from_userId,
      to_userId,
      message,
      timestamp: timestamp || new Date().toISOString(),
    };

    await messages.insertOne(msg);

    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMessages, sendMessage };