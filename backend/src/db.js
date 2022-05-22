
const { Pool, Client } = require('pg');

// const client = new Client();
// await client.connect();
const DBNAME = 'markdownblog';

const DB_CONFIG = {
    user: "postgres",
    host: "localhost",
    database: DBNAME
};

const POOL = new Pool(DB_CONFIG);
const ARTICLE_TABLE = 'article';

// PSQL QUERY STRINGS
const GET_ARTICLES_LISTING_QUERY = `SELECT author, title, date_created, date_updated from ${ARTICLE_TABLE}`;
const GET_ARTICLE_ID_QUERY = `SELECT author, title, markdown_content, date_created, date_updated from ${ARTICLE_TABLE} WHERE id=$1`;
const EDIT_ARTICLE_ID_QUERY = `UPDATE ${ARTICLE_TABLE}
    set author = $2,
        title = $3,
        markdown_content = $4,
        date_updated = now()
    WHERE id = $1
`;
const CREATE_ARTICLE_QUERY = `INSERT INTO ${ARTICLE_TABLE}
    (title, author, mardown_content) VALUES ($1, $2, $3)
`;

// QUERY FUNCTIONS
function queryPromise(...args) {
    return new Promise((success, fail) => {
        POOL.query(...args, (err, res) => {
            if (err) {
                return fail(err);
            }
            return success(res.rows);
        });
    });
}

function getArticlesListing() {
    return queryPromise(ARTICLES_LISTING_QUERY);
}

function getArticle(articleId) {
    return queryPromise(ARTICLE_ID_QUERY, [articleId]);
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