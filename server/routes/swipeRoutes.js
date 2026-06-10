const router = require("express").Router();
const { swipeUser, getPotentialMatches } = require("../controllers/swipeController");

// IMPORTANT: specific routes must come BEFORE param routes
router.get("/potential/:userId", getPotentialMatches);
router.post("/", swipeUser);

module.exports = router;