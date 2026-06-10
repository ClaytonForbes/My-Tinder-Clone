const router = require("express").Router();
const { createOrCheckMatch } = require("../controllers/matchController");

// POST /api/matches  — called by Dashboard after every right-swipe
router.post("/", createOrCheckMatch);

module.exports = router;