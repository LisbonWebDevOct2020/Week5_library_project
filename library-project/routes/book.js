const express = require('express');
const router  = express.Router();
const Book = require('../models/Book')
const Author = require('../models/Author');


//Route to render books list view
router.get('/books', (req, res) => {
  //Get books from Mongo and pass them to the view
  Book.find({ isDeleted: false })
    .populate('author')
    .then((allTheBookFromDB) => {
      res.render('books-list', { books: allTheBookFromDB});
    })
    .catch((err) => {
      res.render('error', { err });
    })
});

//This route only has one purpose, which is
//render the book-create view
router.get('/books/create', (req, res) => {
  //find all the authors and send them to the view
  Author.find()
    .then((authorsFromDB) => {
      res.render('book-create', { authors: authorsFromDB});
    })
});

router.post('/books/create', (req, res) => {
 /* let title = req.body.title;
  let author = req.body.author;
  let description = req.body.description;
  let rating = req.body.rating;*/
  let { title, author, description, rating } = req.body;
  Book.create({
    title,
    author,
    description,
    rating
  }).then(() => {
    res.redirect('/books');
  });
});

//GET I'm sending a response with a view
router.get('/books/:bookId/edit', (req, res) => {
  let bookId = req.params.bookId;
  Book.findById(bookId)
    .populate('author')
    .then((theBookFound) => {
      //found the book
      Author.find()
        .then((authorsFromDB) => {
          res.render('book-edit', 
          { 
            book: theBookFound, 
            authors: authorsFromDB
          });
        })
    })
    .catch((err) => {
      res.render('error', { err });
    })
});

//POST I'm persisting the changes on the database
router.post('/books/:bookId/edit', (req, res) => {
  let bookId = req.params.bookId;
  let { title, author, description, rating} = req.body;
  Book.findByIdAndUpdate(bookId, {
    title,
    author,
    description,
    rating
  }).then((updatedBook) => {
    res.redirect(`/books/${bookId}`);
  });
});

router.post('/books/:bookId/delete', (req, res) => {
  let bookId = req.params.bookId;
  //Hard delete
/*  Book.findByIdAndDelete(bookId)
    .then(() => {
      res.redirect('/books');
    });*/
  
  //Soft delete
  Book.findByIdAndUpdate(bookId, {
    isDeleted: true
  }).then(() => {
    res.redirect('/books');
  });
});

//This is a route that recieves a route param
router.get('/books/:bookId', (req, res) => {
  let bookId = req.params.bookId;
  //Get book using the id that is on the route
  //Find book on MongoDB using the book id
  Book.findById(bookId)
    .populate('author')
    .then((theBookFound) => {
      res.render('book-details', { book: theBookFound});
    })
    .catch((err) => {
      res.render('error', { err });
    })
});

//Add reviews route
router.post('/reviews/:bookId/add', (req, res) => {
  let bookId = req.params.bookId;
  let { user, comment } = req.body;
  //update the book with user and comments inside
  //the review field
  Book.findByIdAndUpdate(bookId, 
    { $push: { reviews: { user, comment }}})
    .then(()=> {
      res.redirect(`/books/${bookId}`);
    })
});

module.exports = router;