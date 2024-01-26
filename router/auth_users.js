const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const userWithSameName = users.find((user) => user.username === username);
  return !!userWithSameName;
};

const authenticatedUser = (username, password) => {
  const validUser = users.find((user) => user.username === username && user.password === password);
  return !!validUser;
};


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("enter valid input");
  }

  if (authenticatedUser(username, password)) {
    const jwtauthToken = jwt.sign({ data: password }, "your-secret-key", { expiresIn: 60 * 60 });
    
    
    req.session.authorization = { username, jwtauthToken };
    return res.status(200).send({ message: "done!!!" });
  } else {
    return res.status(404).send("not found username and passcode");
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;


  const bookIndex = books.findIndex((book) => book.isbn === isbn);

  if (bookIndex !== -1) {
 
    if (req.session.authorization && req.session.authorization.username) {
    
      books[bookIndex].reviews.push({ username: req.session.authorization.username, review: review });
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      return res.status(401).json({ message: "Unauthorized. Please log in to add a review." });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
