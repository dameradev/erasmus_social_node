const User = require("../models/user");
const brcypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const error = new Error("User already exists.");
      error.statusCode = 422;
      throw error;
    }
    const hashedPassword = await brcypt.hash(req.body.password, 12);

    user = new User({
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, userId: user._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const error = new Error("Invalid email or password!");
      error.statusCode = 422;
      throw error;
    }

    const match = await brcypt.compare(req.body.password, user.password);
    if (!match) {
      const error = new Error("Invalid email or password!");
      error.statusCode = 422;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString()
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, userId: user._id.toString(), expiresIn: 3600 });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  // console.log(req.params.);
  const user = await User.findById(req.params.userId).populate(
    "friendRequests",
    "email"
  );
  res.status(200).json({ user });
};

exports.suggestedUsers = async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ users });
};

exports.addFriend = async (req, res, next) => {
  const userId = req.body.userId;
  const currentUserId = req.body.currentUserId;

  const currentUser = await User.findById(currentUserId.toString());
  const friendRequestUser = await User.findById(userId.toString());
  const friendIndex = currentUser.friends.findIndex(user => {
    return user.toString() === userId.toString();
  });

  if (friendIndex === -1) {
    currentUser.friends.push(userId);
    currentUser.save();
  }

  const friendRequestIndex = friendRequestUser.friendRequests.findIndex(
    user => {
      return user.toString() === currentUserId.toString();
    }
  );

  if (friendRequestIndex === -1) {
    friendRequestUser.friendRequests.push(currentUserId);
    friendRequestUser.save();
  }
};

exports.acceptRequest = async (req, res, next) => {
  const currentUser = await User.findById(req.body.currentUserId);
  console.log(currentUser.email);
  currentUser.friends.push(req.body.id);
  const userToAddIndex = currentUser.friendRequests.findIndex(id => {
    return id.toString() === req.body.id.toString();
  });
  console.log(userToAddIndex);
  currentUser.friendRequests.splice(userToAddIndex, 1);

  await currentUser.save();
  console.log(currentUser);
};
