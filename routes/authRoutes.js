const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);

router.get("/suggested-users", authController.suggestedUsers);
router.post("/add-friend", authController.addFriend);

module.exports = router;
