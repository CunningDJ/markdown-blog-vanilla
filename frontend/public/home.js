/*
 * HOME
 */
(function () {
function main() {
    const apiClient = new APIClient();
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

        this.articleId = null;

        this.element.classList.add(CSS_CLASSES.ARTICLE);

        // Showdown (Markdown) Converter
        this._showdownConverter = new showdown.Converter();

        // BIND
        this.populateShow.bind(this);
        this.hide.bind(this);
    }

    populateShow(articleData) {
        const { id, title, author, dateCreated, dateUpdated, markdownContent } = articleData;
        this.articleId = id;
        this.title_element.textContent = title;
        this.author_element.textContent = author;
        this.dateCreated_element.textContent = (new Date()).toLocaleString();
        // Convert markdown to HTML
        const convertedContent = this._showdownConverter.makeHtml(markdownContent)

        // Put content in article body
        this.body_element.innerHTML = convertedContent;
        showElement(this.element);
        pushStateArticlePath(this.articleId);
    }

    hide() {
        hideElement(this.element);
    }
}

class ArticlesListing {
    _ELEMENT_ID = 'home-articles';
    _LISTING_ID = 'home-articles-list'
    _MESSAGE_ID = 'home-articles-list__message';

    constructor(apiClient, onClickListItem) {
        this.element = document.getElementById(this._ELEMENT_ID);
        this.listElement = document.getElementById(this._LISTING_ID);
        this.messageElement = document.getElementById(this._MESSAGE_ID);

        this._onClickListItem = onClickListItem;

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
                if (articlesListingData.length == 0) {
                    // Clearing list contents
                    this.listElement.innerHTML = '';
                    this.messageElement.textContent = 'No Articles Yet!'
                    return;
                }
                this.messageElement.textContent = '';
                const fragment = document.createDocumentFragment();
                articlesListingData.forEach(articleData => {
                    // Could also diff date updated with currently listed items' date updated if the home page has an internal
                    //   refresh button or some other re-fetch mechanism
                    const { id } = articleData;
                    const articleListItem = new ArticleListItem(id, articleData, this._onClickListItem);
                    fragment.appendChild(articleListItem.element);
                });
                // Clearing out old listing
                this.listElement.innerHTML = '';
                this.listElement.appendChild(fragment);
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
    _CSS_CLASS = 'home-articles__list-item';

    constructor(articleId, articleData, onClickListItem) {
        this.articleId = articleId;
        this.data = articleData;
        this.element = document.createElement('div');
        this.element.classList.add(this._CSS_CLASS);
        this.element.classList.add(CSS_CLASSES.LIST_ITEM);
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

        const fragment = document.createDocumentFragment();
        fragment.appendChild(titleElement);
        fragment.appendChild(authorElement);
        fragment.appendChild(dateCreatedElement);
        this.element.appendChild(fragment);
    }
}

class HomeBackButton {
    _CSS_CLASS = 'home__back-button';

    constructor(onclick) {
        this.element = document.getElementById(this._CSS_CLASS);
        this.element.onclick = onclick;

        // BIND
        this.show.bind(this);
        this.hide.bind(this);
    }

    show() {
        showElementRemoveDisplay(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}

class HomeApp {
    _BACK_BUTTON_CSS_CLASS = 'home__back-button';

    constructor(apiClient) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;

        this.articlesListingComponent = new ArticlesListing(apiClient, this._onClickArticleListItem.bind(this));
        this.articleComponent = new HomeArticle(this);
        this.backButtonComponent = new HomeBackButton(this._onClickBackButton.bind(this));

        // BIND
        this.fetchArticles.bind(this);
        this.hideArticlesListing.bind(this);
        this.showArticlesListing.bind(this);
        this.populateShowArticle.bind(this);
        this.hideArticle.bind(this);
        this.selectArticle.bind(this);
        this._onClickArticleListItem.bind(this);
        this._onClickBackButton.bind(this);
    }


    fetchArticles() {
        this.articlesListingComponent.fetch();
    }

    hideArticlesListing() {
        this.articlesListingComponent.hide();
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

    selectArticle(articleId, articleData) {
        this.articleComponent.populateShow(articleData)
        this.articlesListingComponent.hide();
        pushStateArticlePath(articleId);
        this.backButtonComponent.show();
    }

    // "private"
    _onClickArticleListItem(e, articleId) {
        this._client.getArticle(articleId)
            .then(articleData => this.selectArticle(articleId, articleData))
            .catch(err => alert(err));
    }

    _onClickBackButton(e) {
        e.preventDefault();
        replaceStateHomePath();
        this.hideArticle();
        this.backButtonComponent.hide();
        this.showArticlesListing();
    }
}

// RUNNING MAIN
main();
})();