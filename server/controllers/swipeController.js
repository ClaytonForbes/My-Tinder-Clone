const { getDB } = require("../config/db");

// POST /api/swipes
// Dashboard sends: { fromUserId, toUserId, direction: "right" | "left" }
const swipeUser = async (req, res) => {
  try {
    const db = getDB();
    const swipes = db.collection("swipes");

    const { fromUserId, toUserId, direction } = req.body;

    if (!fromUserId || !toUserId || !direction) {
      return res.status(400).json({ message: "fromUserId, toUserId, and direction are required" });
    }

    // Prevent duplicate swipes
    const existing = await swipes.findOne({ fromUserId, toUserId });
    if (existing) {
      return res.status(409).json({ message: "Already swiped" });
    }

    await swipes.insertOne({
      fromUserId,
      toUserId,
      direction, // stored as "right" or "left"
      createdAt: new Date(),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/swipes/potential/:userId
// Returns users this person hasn't swiped yet, filtered by gender_interest
const getPotentialMatches = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");
    const swipes = db.collection("swipes");

    const { userId } = req.params;

    const currentUser = await users.findOne({ user_id: userId });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // IDs this user has already swiped on
    const alreadySwiped = await swipes.find({ fromUserId: userId }).toArray();
    const swipedIds = alreadySwiped.map((s) => s.toUserId);

    const filter = {
      user_id: { $nin: [...swipedIds, userId] },
    };

    if (currentUser.gender_interest && currentUser.gender_interest !== "everyone") {
      filter.gender_identity = currentUser.gender_interest;
    }

    const potentials = await users.find(filter).toArray();
    res.json(potentials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { swipeUser, getPotentialMatches };