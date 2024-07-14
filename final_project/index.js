const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." }); ÏÏ
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(300).json(books);
});

public_users.get('/books', function (req, res) {
    axios.get('home/project/expressBookReviews/final_projects/router/boooksdb')
        .then(response => {
            res.send(JSON.stringify(response.data.books, null, 4));
            console.log("Promise for Task 10 resolved");
        })
        .catch(error => {
            // Handle error
            console.error('Error fetching books:', error);
            res.status(500).send('Error fetching books');
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({
                "isbn": isbn,
                "title": books[isbn]["title"],
                "reviews": books[isbn]["reviews"]
            });
        }
    });

    return res.send(booksbyauthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
        if (books[isbn]["title"] === req.params.title) {
            booksbytitle.push({
                "isbn": isbn,
                "author": books[isbn]["author"],
                "reviews": books[isbn]["reviews"]
            });
        }
    });
    return res.send(booksbytitle);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn]["reviews"]);
});

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

module.exports.general = public_users;
