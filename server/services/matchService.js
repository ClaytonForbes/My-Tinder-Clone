const { getDB } = require("../config/db");

async function createMatch(userA, userB) {
  const db = getDB();
  const matches = db.collection("matches");

  const existing = await matches.findOne({
    users: { $all: [userA, userB] },
  });

  if (existing) return null;

  const match = {
    users: [userA, userB],
    createdAt: new Date(),
  };

  await matches.insertOne(match);

  return match;
}

module.exports = { createMatch };