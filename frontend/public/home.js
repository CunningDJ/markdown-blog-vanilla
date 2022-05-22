/*
 * HOME
 */
(function () {
function main() {
    const apiClient = APIClient();
    const homeApp = new HomeApp(apiClient);
    homeApp.fetchArticles();
}

class HomeArticle {
    _ELEMENT_ID = 'home-article';
    _TITLE_ID = 'home-article__title';
    _AUTHOR_ID = 'home-article__author';
    _DATE_CREATED_ID = 'home-article__date-created';
    _BODY_ID = 'home-article__body';

    constructor() {
        this.element = document.getElementById(this._ELEMENT_ID);
        this.title_element = document.getElementById(this._TITLE_ID);
        this.author_element = document.getElementById(this._AUTHOR_ID);
        this.dateCreated_element = document.getElementById(this._DATE_CREATED_ID);
        this.body_element = document.getElementById(this._BODY_ID);

        // Showdown (Markdown) Converter
        this._showdownConverter = new showdown.Converter();

        // BIND
        this.populateShow.bind(this);
        this.hide.bind(this);
        // this.xx.bind(this);
    }

    populateShow(articleData) {
        const { id, title, author, dateCreated, dateUpdated, markdownContent } = articleData;
        this.title_element.textContent = title;
        this.author_element.textContent = author;
        this.dateCreated_element.textContent = (new Date()).toLocaleString();
        // Convert markdown to HTML
        const convertedContent = this._showdownConverter.makeHtml(markdownContent)

        // Put content in article body
        this.body_element.innerHTML = convertedContent;
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}

class ArticlesListing {
    _ELEMENT_ID = 'home-articles-listing';

    constructor(apiClient, homeApp) {
        this._homeApp = homeApp;
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;

        // BIND
        this.fetch.bind(this);
        this.show.bind(this);
        this.hide.bind(this);
    }

    fetch() {
        this._client.getArticlesListing()
            .then(articlesListingData => {
                const fragment = document.createDocumentFragment();
                articlesListingData.forEach(articleData => {
                    const articleListItem = new ArticleListItem(articleId, articleData, this._homeApp._onClickArticleListItem);
                    fragment.appendChild(articleListItem.element);
                });
                // Clearing out old listing
                this.innerHTML = '';
                this.element.appendChild(fragment);
            })
    }

    show() {
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}

class ArticleListItem {
    _CSS_CLASS = 'home-articles-listing__list-item';

    constructor(articleId, articleData, onClickListItem) {
        this.articleId = articleId;
        this.data = articleData;
        this.element = document.createElement('div');
        this.element.classList.add(this._CSS_CLASS);
        const { title, author, dateCreated, dateUpdated } = this.data;
        // Title Element
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;

        // Author Element
        const authorElement = document.createElement('p');
        authorElement.textContent = author;

        // Date Created Element
        const dateCreatedElement = document.createElement('p');
        dateCreatedElement.textContent = (new Date(dateCreated)).toLocaleString();

        // On Click (Select Article)
        this.element.onclick = e => onClickListItem(e, articleId);

        this.element.appendChild(titleElement);
        this.element.appendChild(authorElement);
        this.element.appendChild(dateCreatedElement);
    }
}

class HomeApp {
    constructor(apiClient) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;

        this.articleListingComponent = new ArticlesListing(this);
        this.articleComponent = new HomeArticle(this);

        // BIND
        this.fetchArticles.bind(this);
        this.hideArticlesListing.bind(this);
        this.showArticlesListing.bind(this);
        this.populateShowArticle.bind(this);
        this.hideArticle.bind(this);
        this._onClickArticleListItem.bind(this);
        // this.xx.bind(this);
    }

    _onClickArticleListItem(e, articleId) {
        this._client.getArticle(articleId)
            .then(articleData => {

            })
            .catch(err => alert(err));
    }

    fetchArticles() {
        this.articlesListingComponent.fetch();
    }

    hideArticlesListing() {
        this.articlesListing.hide();
    }

    showArticlesListing() {
        this.articlesListingComponent.show();
    }

    populateShowArticle(articleId) {
        this._client.getArticle(articleId)
            .then(articleData => {
                this.articleComponent.populate(articleData)
                this.articleComponent.show();
            })
            .catch(err => alert(err));
    }

    hideArticle() {
        this.articleComponent.hide();
    }
}

// RUNNING MAIN
main();
})();