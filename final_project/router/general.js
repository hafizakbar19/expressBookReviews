const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error);
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/books/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books by author:", error);
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Get book details based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Get book reviews based on ISBN using async-await
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/books/review/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching book reviews:", error);
    return res.status(500).json({ message: "Error fetching book reviews" });
  }
});

module.exports.general = public_users;