const { getDB } = require("../config/db");

// GET /api/users/user?userId=XXX  OR  GET /api/users/:userId
const getUser = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const userId = req.params.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await users.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users  — returns all users OR filters by userIds array
const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    // MatchesDisplay passes ?userIds=["id1","id2",...]
    if (req.query.userIds) {
      let userIds;
      try {
        userIds = JSON.parse(req.query.userIds);
      } catch {
        return res.status(400).json({ message: "Invalid userIds format" });
      }

      const filtered = await users
        .find({ user_id: { $in: userIds } })
        .toArray();

      return res.json(filtered);
    }

    const all = await users.find().toArray();
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/users/user
const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const formData = req.body;

    if (!formData.user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const result = await users.updateOne(
      { user_id: formData.user_id },
      {
        $set: {
          first_name: formData.first_name,
          dob_day: formData.dob_day,
          dob_month: formData.dob_month,
          dob_year: formData.dob_year,
          gender_identity: formData.gender_identity,
          gender_interest: formData.gender_interest,
          url: formData.url,
          about: formData.about,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUser,
  getAllUsers,
  updateUser,
};