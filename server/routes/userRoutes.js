const router = require("express").Router();
const {
  getUser,
  getAllUsers,
  updateUser,
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/user", getUser);       // GET /api/users/user?userId=XXX  (used by MatchesDisplay via query param)
router.get("/:userId", getUser);    // GET /api/users/:userId           (used by Dashboard)
router.put("/user", updateUser);

module.exports = router;