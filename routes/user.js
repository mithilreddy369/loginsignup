const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Home Route - GET /
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('home', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Signup Route - GET /signup
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Signup Route - POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, mobile, username, password } = req.body;

    // Check if the email or mobile number is already registered
    const existingUser = await User.findOne().or([{ email }, { mobile }]);
    if (existingUser) {
      return res.render('signup', { error: 'Email or mobile number already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      mobile,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    res.render('signup', { success: 'Account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Login Route - GET /login
router.get('/login', (req, res) => {
  res.render('login');
});

// Login Route - POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    // Set the user in the session
    req.session.user = user;

    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout Route - GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Middleware for protecting routes
const authMiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Home Route - GET /home
router.get('/home', authMiddleware, (req, res) => {
  res.render('home', { user: req.session.user });
});

module.exports = router;
