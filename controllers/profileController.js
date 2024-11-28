"use strict";

const User = require("../models/userModel");

exports.updatePassword = async (req, res) => {
  const { user_id } = req.params;
  const { newPassword } = req.body;

  const passwordRegex = /^[A-Z].{7,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and begin with uppercase letters.",
    });
  }

  try {
    const result = await User.updateOldPassword(user_id, newPassword);
    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Password needs to be filled in",
      });
    }
    res.status(201).json({
      message: "Update Password Success",
    });
  } catch (error) {
    console.error("Error Updating Password:", error);
    res.status(500).json({
      message: "Error Updating Password",
    });
  }
};

exports.Profile = async (req, res) => {
  const { user_id } = req.params;
  try {
    const user = await User.findUserById(user_id);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    await User.findUserById(user_id);
    res.status(200).json({
      Profile: {
        userID: user.id,
        username: user.username,
        skin_type: user.skin_type,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error Show Profile", error);
    res.status(500).json({
      message: "Error Show Profile",
    });
  }
};
