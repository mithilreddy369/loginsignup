const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const userRoutes = require('./routes/user');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Set up sessions
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Set up view engine
app.set('view engine', 'ejs');

// Routes
app.use('/', userRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
