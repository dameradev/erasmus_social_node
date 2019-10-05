const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.get("/suggested-users", authController.suggestedUsers);
router.get("/user/:userId", authController.getUser);

router.post("/signup", authController.postSignup);
router.post("/login", authController.postLogin);

router.post("/add-friend", authController.addFriend);
router.post("/accept-request", authController.acceptRequest);

module.exports = router;
