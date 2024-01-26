const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(400).send("Enter valid credentials");
  }

  if (!isValid(username)) {
    users.push({ "username": username, "password": password });
    return res.status(200).send("Registered successfully");
  } else {
    return res.status(400).send("Username already exists");
  }
});


public_users.get('/', function (req, res) {
  res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});



public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let booksByAuthor = books.filter(b => b.author === author);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "Books by author not found" });
  }
});

public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let booksByTitle = books.filter(b => b.title === title);

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "Books by title not found" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let book = books.find(b => b.isbn === isbn);

  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Reviews not found" });
  }
});



module.exports.general = public_users;


module.exports.general = public_users;
