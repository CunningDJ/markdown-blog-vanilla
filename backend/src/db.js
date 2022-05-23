
const { Pool, Client } = require('pg');

const DBNAME = 'markdownblog';

const DB_CONFIG = {
    user: "postgres",
    host: "localhost",
    database: DBNAME
};

const POOL = new Pool(DB_CONFIG);
const ARTICLE_TABLE = 'article';

// PSQL QUERY STRINGS
const GET_ARTICLES_LISTING_QUERY = `SELECT
    id, author, title,
    date_created as "dateCreated",
    date_updated as "dateUpdated"
from ${ARTICLE_TABLE}`;

const GET_ARTICLE_ID_QUERY = `SELECT
    id, author, title,
    markdown_content as "markdownContent",
    date_created as "dateCreated",
    date_updated as "dateUpdated"
from ${ARTICLE_TABLE}
WHERE id=($1)::uuid`;

const EDIT_ARTICLE_ID_QUERY = `UPDATE ${ARTICLE_TABLE}
    set author = $2,
        title = $3,
        markdown_content = $4,
        date_updated = now()
    WHERE id = ($1)::uuid`;

const CREATE_ARTICLE_QUERY = `INSERT INTO ${ARTICLE_TABLE}
    (title, author, marKdown_content) VALUES ($1, $2, $3)`;

// QUERY FUNCTIONS
function queryPromise(...args) {
    return new Promise((accept, reject) => {
        POOL.query(...args, (err, res) => {
            if (err) {
                return reject(err);
            }
            return accept(res.rows);
        });
    });
}

function getArticlesListing() {
    return queryPromise(GET_ARTICLES_LISTING_QUERY);
}

function getArticle(articleId) {
    return queryPromise(GET_ARTICLE_ID_QUERY, [articleId]);
}

function editArticle(articleId, articleData) {
    const { author, title, markdownContent } = articleData;
    return queryPromise(EDIT_ARTICLE_ID_QUERY, [articleId, author, title, markdownContent]);

}

function createArticle(articleData) {
    const { title, author, markdownContent } = articleData;
    return queryPromise(CREATE_ARTICLE_QUERY, [title, author, markdownContent]);
}


// EXPORTS
module.exports = {
    getArticlesListing,
    getArticle,
    editArticle,
    createArticle
};