const router = require("express").Router();
const {
  swipeUser,
  getPotentialMatches,
} = require("../controllers/swipeController");

router.get("/potential/:userId", getPotentialMatches);
router.post("/", swipeUser);

module.exports = router;