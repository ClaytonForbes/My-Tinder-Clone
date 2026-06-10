const { getDB } = require("../config/db");

// POST /api/matches
// Body: { userId, matchedUserId }
// Called after a right-swipe to check/create a mutual match
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
    const reverseSwipe = await swipes.findOne({
      fromUserId: matchedUserId,
      toUserId: userId,
      direction: "right",
    });

    if (!reverseSwipe) {
      return res.json({ isMatch: false });
    }

    // It's a match — add each user to the other's matches array
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