const { getDB } = require("../config/db");

// POST /api/matches
// Dashboard sends: { userId, matchedUserId }
// Checks if the other person swiped right on us too → creates match if so
const createOrCheckMatch = async (req, res) => {
  try {
    const db = getDB();
    const swipes = db.collection("swipes");
    const users = db.collection("users");

    const { userId, matchedUserId } = req.body;

    if (!userId || !matchedUserId) {
      return res.status(400).json({ message: "userId and matchedUserId are required" });
    }

    // Check if the other person already swiped right on us
    // Stored with direction "right" (not "like" — that was the old bug)
    const reverseSwipe = await swipes.findOne({
      fromUserId: matchedUserId,
      toUserId: userId,
      direction: "right",
    });

    if (!reverseSwipe) {
      // No mutual like yet — not a match
      return res.json({ isMatch: false });
    }

    // It's a match! Add each user to the other's matches array.
    // $addToSet prevents duplicates if called twice.
    await users.updateOne(
      { user_id: userId },
      { $addToSet: { matches: { user_id: matchedUserId } } }
    );

    await users.updateOne(
      { user_id: matchedUserId },
      { $addToSet: { matches: { user_id: userId } } }
    );

    res.json({ isMatch: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrCheckMatch };