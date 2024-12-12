const session = require('express-session');
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const passportSetup = require("./passport");
const passport = require("passport");
require('dotenv').config();

const booksControllers = require('./controllers/books');
const bookRecsControllers = require('./controllers/bookRecs');
const locationRecsControllers = require('./controllers/locationRecs');
const categoryRecsControllers = require('./controllers/categoryRecs');
const userBooksControllers = require('./controllers/userBooks');
const userAuthControllers = require('./controllers/userAuth');
const citiesController = require('./controllers/cities');

const logger = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(cors({
  origin: '*',
}));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret', 
    resave: false, // Avoid resaving session if not modified
    saveUninitialized: false, // Only save sessions when needed
    cookie: {
      secure: false, // Use `true` if you're serving over HTTPS
      maxAge: 1000 * 60 * 60 * 24 // Optional: Set session expiry (1 day)
    }
  }));  
app.use(passport.initialize());
app.use(passport.session());


/***** Set up routes *****/ 
const baseRouter = express.Router();
app.use('/api', baseRouter);
// Books
baseRouter.get('/books/full_info/:bookId', authMiddleware, booksControllers.getBookFullInfo); // Route 1
baseRouter.post('/books/partialInfo', booksControllers.getBooksPartialInfo); // Route 2
baseRouter.post('/books/search', booksControllers.searchBooks); // Route 3 (also for 4, 5)
// Recs
baseRouter.get('/book_recs', bookRecsControllers.getBookRecs); // Route 6, 7, 8, 10
baseRouter.get('/period_books_rec', bookRecsControllers.getPeriodBookRecs); // Route 11
baseRouter.get('/set_in_location_recs', locationRecsControllers.getLocationRecs); // Route 9
baseRouter.get('/category_recs', categoryRecsControllers.getCategoryRecs); // Route 12, 13
// User books
baseRouter.post('/users/books', authMiddleware, userBooksControllers.addUserBooks); // Route 14
baseRouter.get('/users/books', authMiddleware, userBooksControllers.getUserBooks); // Route 15
baseRouter.post('/users/onboard', authMiddleware, userBooksControllers.addUserOnboardInfo); // Route 17 - ADD TO DOC
// Cities
baseRouter.get('/cities/:country', authMiddleware, citiesController.getCitiesInCountry); // For onboarding page
// User Auth - password
baseRouter.post('/login/password', // Route 16
    body('email').notEmpty().isEmail(), 
    body('password').notEmpty(),
    userAuthControllers.passwordLogin);
// User Auth - google
baseRouter.get('/login/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
  ));
baseRouter.get( '/login/google/callback',
    passport.authenticate( 'google', { session: false }),
    (req, res) => {
        userAuthControllers.googleLogin(req, res);
    }
);
baseRouter.get('/auth/retrieve-token', userAuthControllers.retrieveToken);
// User Auth - facebook 
/*******  TO DO ********/


// For all undefined routes
baseRouter.use((req, res) => {res.status(404).send('Not Found!')});

const port = process.env.SERVER_PORT;
app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
})