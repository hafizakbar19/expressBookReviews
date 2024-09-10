const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username && !users.find(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Add the new user to the users' database
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Login a user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a token
  const token = jwt.sign({ username }, 'fingerprint_customer', { expiresIn: '1h' });

  // Set the session
  req.session.authorization = {
    accessToken: token
  };

  return res.status(200).json({ message: "Login successful", token });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    console.log("Token from headers:", token); // Debugging statement
    const decoded = jwt.verify(token.split(' ')[1], 'fingerprint_customer'); // Ensure 'fingerprint_customer' matches the one used during token generation
    console.log("Decoded user:", decoded); // Debugging statement
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
  } catch (err) {
    console.log("Token verification error:", err); // Debugging statement
    return res.status(401).json({ message: "Invalid token" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    console.log("Token from headers:", token); // Debugging statement
    const decoded = jwt.verify(token.split(' ')[1], 'fingerprint_customer'); // Ensure 'fingerprint_customer' matches the one used during token generation
    console.log("Decoded user:", decoded); // Debugging statement
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } catch (err) {
    console.log("Token verification error:", err); // Debugging statement
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;