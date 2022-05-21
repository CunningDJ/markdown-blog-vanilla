const express = require('express');

// Constants
const LISTEN_PORT = 8081;
const ARTICLES_PATH = '/articles';
const ARTICLE_ID_PATH = `${ARTICLES_PATH}/:articleId`

// Express App
const app = express();

// Get articles listing
app.get(ARTICLES_PATH, (req, res, next) => {

    // TODO: fetch articles from postgres
    //  (ONLY: title, author, dateCreated, )
    //  (SORT BY: dateCreated)

    // TODO: return articles data

});

// Get article contents
app.get(ARTICLE_ID_PATH, (req, res, next) => {
    const { articleId } = req.params;

    // TODO: fetch article from postgres

    // TODO: return article data
    return res.json(ARTICLE_DATA);
});

// Edit article
app.put(ARTICLE_ID_PATH, (req, res, next) => {
    const { articleId } = req.params;


    // TODO: return success/err response
    return res.json(SUCCESS_ERR_RESPONSE);
});

// New article
app.post(ARTICLES_PATH, (req, res, next) => {
    const articleData = req.body;
    const { articleTitle, articleAuthor, articleContent } = articleData;

    // TODO: insert in postgres
    //  ADD: dateCreated (auto with postgres?)


    // TODO: return success/err response
});



app.listen(LISTEN_PORT, function() {
    console.log(`Serving on port ${LISTEN_PORT}`);
});