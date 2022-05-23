const express = require('express');
const cors = require('cors');

const { getArticlesListing, getArticle, editArticle, createArticle } = require('./db');

// Constants
const LISTEN_PORT = 8081;
const ARTICLES_PATH = '/articles';
const ARTICLE_ID_PATH = `${ARTICLES_PATH}/:articleId`

// Express App
const app = express();

// Allow ALL CORS Requests (should update to prod-specific)
app.use(cors());

// Process JSON body
app.use(express.json());

const articlesRouter = express.Router();

// Get articles listing
articlesRouter.get(ARTICLES_PATH, (req, res, next) => {
    getArticlesListing()
        .then(rows => {
            // TODO: remove
            console.log('GET Articles:');
            console.log(rows);
            return res.json({ data: rows })
        })
        .catch(err => res.json({ err }))
});

// Get article contents
articlesRouter.get(ARTICLE_ID_PATH, (req, res, next) => {
    const { articleId } = req.params;
    getArticle(articleId)
        .then(rows => {
            return res.json({ data: rows[0] })
        })
        .catch(err => res.json({ err }))
});

// Edit article
articlesRouter.put(ARTICLE_ID_PATH, (req, res, next) => {
    const { articleId } = req.params;
    const { author, title, markdownContent } = req.body;
    const articleData = { author, title, markdownContent };

    editArticle(articleId, articleData)
        .then(sqlResponse => {
            return res.json({ data: sqlResponse })
        })
        .catch(err => res.json({ err }))
});

// New article
articlesRouter.post(ARTICLES_PATH, (req, res, next) => {
    const { title, author, markdownContent } = req.body;
    const articleData = { title, author, markdownContent };

    // TODO: insert in postgres
    createArticle(articleData)
        .then(sqlResponse => {
            return res.json({ data: sqlResponse })
        })
        .catch(err => res.json({ err }))
});

// Adding Router(s)
// Adding Router: Articles
app.use('/api', articlesRouter);

// Listening
app.listen(LISTEN_PORT, function() {
    console.log(`Serving on port ${LISTEN_PORT}`);
});