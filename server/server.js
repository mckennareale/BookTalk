const express = require('express');
const cors = require('cors');

const booksControllers = require('./controllers/books');
const bookRecsControllers = require('./controllers/bookRecs');
const locationRecsControllers = require('./controllers/locationRecs');
const categoryRecsControllers = require('./controllers/categoryRecs');
const userBooksControllers = require('./controllers/userBooks');
const userAuthControllers = require('./controllers/userAuth');

const logger = require('./middleware/logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(cors({
  origin: '*',
}));

/***** Set up routes *****/ 
const baseRouter = express.Router();
app.use('/api', baseRouter);
// Books
baseRouter.get('/books/full_info/:bookId', booksControllers.getBookFullInfo); // Route 1
baseRouter.post('/books/books/partialInfo', booksControllers.getBooksPartialInfo); // Route 2
baseRouter.get('/books/search', booksControllers.searchBooks); // Route 3 (also for 4, 5)
// Recs
baseRouter.get('/book_recs', bookRecsControllers.getBookRecs); // Route 6, 7, 8, 10
baseRouter.get('/period_books_rec', bookRecsControllers.getPeriodBookRecs); // Route 11
baseRouter.get('/set_in_location_recs', locationRecsControllers.getLocationRecs); // Route 9
baseRouter.get('/category_recs', categoryRecsControllers.getCategoryRecs); // Route 12, 13
// User books
baseRouter.post('/users/books', userBooksControllers.addUserBooks); // Route 14
baseRouter.get('/users/books', userBooksControllers.getUserBooks); // Route 15
// User Auth
baseRouter.post('/login', userAuthControllers.login);


// For all undefined routes
baseRouter.use((req, res) => {res.status(404).send('Not Found')});

const port = process.env.SERVER_PORT;
app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
})