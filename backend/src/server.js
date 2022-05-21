const express = require('express');

const { getArticlesListing, getArticle, editArticle, createArticle } = require('./db');

// Constants
const LISTEN_PORT = 8081;
const ARTICLES_PATH = '/articles';
const ARTICLE_ID_PATH = `${ARTICLES_PATH}/:articleId`

// Express App
const app = express();

// Get articles listing
app.get(ARTICLES_PATH, (req, res, next) => {

    // TODO: fetch articles from postgres
    getArticlesListing()
        .then(rows => {
            // TODO: return articles data

            return res.json({ data: articlesData })
        })
        .catch(err => {
            return res.json({ err })
        })

});

// Get article contents
app.get(ARTICLE_ID_PATH, (req, res, next) => {
    const { articleId } = req.params;

    // TODO: fetch article from postgres
    getArticle(articleId)
        .then(rows => {

            return res.json({ data: articleData })
        })
        .catch(err => res.json({ err }))
    // TODO: return article data
    return res.json(ARTICLE_DATA);
});

// Edit article
app.put(ARTICLE_ID_PATH, (req, res, next) => {
    const { articleId } = req.params;
    const { author, title, markdownContent } = req.body;
    const articleData = { author, title, markdownContent };

    editArticle(articleId, articleData)
        .then(sqlResponse => {
            // TODO: return success/err response
            
        })
        .catch(err => res.json({ err }))
});

// New article
app.post(ARTICLES_PATH, (req, res, next) => {
    const { articleTitle, articleAuthor, articleContent } = req.body;
    const articleData = { articleTitle, articleAuthor, articleContent };

    // TODO: insert in postgres
    createArticle(articleData)
        .then(sqlResponse => {
            // TODO: return success/err response
        })
        .catch(err => res.json({ err }))


});


// Listening
app.listen(LISTEN_PORT, function() {
    console.log(`Serving on port ${LISTEN_PORT}`);
});