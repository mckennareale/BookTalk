const db = require('../db');

// Route 6,7,8,10 - GET /books/book_recs?criteria=X&book_id=Y
async function getBookRecs(req, res) {
    // TO DO
}

// Route 11 - GET /period_books_rec
async function getPeriodBookRecs(req, res) {
    // TO DO
}

module.exports = {
    getBookRecs,
    getPeriodBookRecs,
}