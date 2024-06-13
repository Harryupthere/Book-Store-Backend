const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../config/config");
const { validationResult } = require('express-validator');

// Register a new user
exports.registerUser = async (req, res) => {
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    // Encrypt the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign the JWT and send it in the response
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          return res.status(500).json({ success: false, msg: err });
        }
        return res.status(200).json({ success: true, msg: 'Registration successful', token, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Incorrect password' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      }
    };

    // Sign the JWT and send it in the response
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          return res.status(500).json({ success: false, msg: err });
        }

        return res.status(200).json({ success: true, msg: 'Login successful', token, role: user.role });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
};

// Get all users with role 'user'
exports.getUsers = async (req, res) => {
  try {
    // Fetch users and exclude the password field
    const users = await User.find({ role: 'user' }).select('-password');
    return res.status(200).json({ success: true, msg: 'Users', data: users });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
};
