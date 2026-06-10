const router = require("express").Router();
const { createOrCheckMatch } = require("../controllers/matchController");

router.post("/", createOrCheckMatch);

module.exports = router;