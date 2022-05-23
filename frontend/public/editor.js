/*
 * EDITOR
 */
(function () {

function main() {
    // Initializing API Client
    const apiClient = new APIClient();

    // Initializing objects for articles listing, update form and create form sections
    const editor = new Editor(apiClient);
    editor.fetchArticles();
}


/*
 * EDITOR ARTICLES
 */
class EditorArticles {
    _ELEMENT_ID = 'editor-articles';
    _LIST_ID = 'editor-articles-list';
    _MESSAGE_ID = 'editor-articles-message';

    constructor(apiClient, onClickArticleListItem) {
        this._editor = editor;
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;

        this.element = document.getElementById(this._ELEMENT_ID);
        this.listElement = document.getElementById(this._LIST_ID);
        this.messageElement = document.getElementById(this._MESSAGE_ID);

        this._onClickArticleListItem = onClickArticleListItem;

        // BIND
        this.fetch.bind(this);
        this.show.bind(this);
        this.hide.bind(this);
    }

    fetch() {
        // Fetch and populate articles listing
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
                    const { id } = articleData;
                    const listItem = new EditorArticleListItem(id, articleData, this._onClickArticleListItem);
                    fragment.appendChild(listItem.element);
                })
                // Clearing list contents
                this.listElement.innerHTML = '';
                // Adding new contents
                this.listElement.appendChild(fragment);
            })
            .catch(err => alert(JSON.stringify(err)));
    }

    show() {
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}


class EditorArticleListItem {
    _CSS_CLASS = 'editor-articles__list-item';
    _TITLE_CLASS = 'editor-articles__list-item-title';
    _AUTHOR_CLASS = 'editor-articles__list-item-author';
    _DATE_CREATED_CLASS = 'editor-articles__list-item-date-created';
    _DATE_UPDATED_CLASS = 'editor-articles__list-item-date-updated';

    constructor(articleId, articleData, onclick) {
        this.articleId = articleId;
        this.data = articleData;
        this.element = document.createElement('div');
        this.element.classList.add(this._CSS_CLASS);
        this.element.classList.add(CSS_CLASSES.LIST_ITEM);
        const { title, author, dateCreated, dateUpdated } = this.data;
        // Title Element
        this.titleElement = document.createElement('h2');
        this.titleElement.textContent = title;
        this.titleElement.classList.add(this._TITLE_CLASS);

        // Author Element
        this.authorElement = document.createElement('p');
        this.authorElement.textContent = author;
        this.authorElement.classList.add(this._AUTHOR_CLASS);

        // Date Created Element
        this.dateCreatedElement = document.createElement('p');
        this.dateCreatedElement.textContent = (new Date(dateCreated)).toLocaleString();
        this.dateCreatedElement.classList.add(this._DATE_CREATED_CLASS);

        // On Click
        this.element.onclick = e => onclick(e, this.articleId);

        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.titleElement);
        fragment.appendChild(this.authorElement);
        fragment.appendChild(this.dateCreatedElement);
        this.element.append(fragment);
    }
}


/*
 * EDITOR UPDATE FORM
 */
class EditorUpdateForm {
    _ELEMENT_ID = 'editor-update-form';
    _TITLE_ID = 'editor-update-form__title';
    _AUTHOR_ID = 'editor-update-form__author';
    _DATE_CREATED_ID = 'editor-update-form__date-created';
    _DATE_UPDATED_ID = 'editor-update-form__date-updated';
    _MARKDOWN_CONTENT_ID = 'editor-update-form__markdown-content';
    _UPDATE_BUTTON_ID = 'editor-update-form__update-button';

    constructor(apiClient, onClickUpdateButton) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;
        this.articleId = null;
        this._onClickUpdateButtonParent = onClickUpdateButton;

        this.element = document.getElementById(this._ELEMENT_ID);
        this.titleElement = document.getElementById(this._TITLE_ID);
        this.authorElement = document.getElementById(this._AUTHOR_ID);
        this.dateCreatedElement = document.getElementById(this._DATE_CREATED_ID);
        this.dateUpdatedElement = document.getElementById(this._DATE_UPDATED_ID);
        this.markdownContentElement = document.getElementById(this._MARKDOWN_CONTENT_ID);

        this.updateButtonElement = document.getElementById(this._UPDATE_BUTTON_ID);
        this.updateButtonElement.onclick = this._onclickButton.bind(this);

        // BIND
        this.fetch.bind(this);
        this.populate.bind(this);
        this.show.bind(this);
        this.hide.bind(this);
        this._onclickButton.bind(this);
    }

    fetch(articleId) {
        // Fetches article's data by ID
        this._client.getArticle(articleId)
            .then(articleData => {
                this.populate(articleData)
            })
            .catch(err => alert(JSON.stringify(err)));
    }

    populate(articleData) {
        const { id, author, title, dateCreated, dateUpdated, markdownContent } = articleData;
        this.articleId = id;
        this.titleElement.value = title;
        this.authorElement.value = author;
        this.dateCreatedElement.textContent = (new Date(dateCreated)).toLocaleString();
        this.dateUpdatedElement.textContent = (new Date(dateUpdated)).toLocaleString();
        this.markdownContentElement.value = markdownContent;
    }

    show() {
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }

    _onclickButton(e) {
        e.preventDefault();
        const articleData = {
            title: this.titleElement.value,
            author: this.authorElement.value,
            markdownContent: this.markdownContentElement.value
        };
        return this._onClickUpdateButtonParent(e, this.articleId, articleData);
    }
}


/*
 * EDITOR CREATE FORM
 */
class EditorCreateForm {
    _ELEMENT_ID = 'editor-create-form';
    _TITLE_ID = 'editor-create-form__title';
    _AUTHOR_ID = 'editor-create-form__author';
    _MARKDOWN_CONTENT_ID = 'editor-create-form__markdown-content';
    _CREATE_BUTTON_ID = 'editor-create-form__create-button'

    constructor(apiClient, onClickCreateButton) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._onClickCreateButton = onClickCreateButton;
        this.element = document.getElementById(this._ELEMENT_ID);
        this.titleElement = document.getElementById(this._TITLE_ID);
        this.authorElement = document.getElementById(this._AUTHOR_ID);
        this.markdownContentElement = document.getElementById(this._MARKDOWN_CONTENT_ID);

        this.createButtonElement = document.getElementById(this._CREATE_BUTTON_ID);
        this.createButtonElement.onclick = this.onClickCreate.bind(this);

        // BIND
        this.onClickCreate.bind(this);
        this.show.bind(this);
        this.hide.bind(this);
    }

    onClickCreate(e) {
        e.preventDefault();
        const articleData = {
            title: this.titleElement.value,
            author: this.authorElement.value,
            markdownContent: this.markdownContentElement.value
        };
        return this._onClickCreateButton(e, articleData);
    }

    show() {
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}


/*
 * NEW ARTICLE BUTTON
 */
class NewArticleButton {
    _ELEMENT_ID = 'editor-new-article-button';

    constructor(onclick) {
        this._editor;
        this.element = document.getElementById(this._ELEMENT_ID);
        this.element.onclick = onclick;
    }
}


/*
 * EDITOR APP
 */
class Editor {
    constructor(apiClient) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;
        this.newArticleButtonComponent = new NewArticleButton(this._onClickNewArticleButton.bind(this));
        this.articlesComponent = new EditorArticles(this._client, this._onClickArticleListItem.bind(this));
        this.updateFormComponent = new EditorUpdateForm(this._client, this._onClickUpdateArticleButton.bind(this));
        this.createFormComponent = new EditorCreateForm(this._client, this._onClickCreateButton.bind(this));

        // BIND
        this.fetchArticles.bind(this);
        this._onClickCreateButton.bind(this);
        this._onClickUpdateArticleButton.bind(this);
        this._onClickArticleListItem.bind(this);
        this._onClickNewArticleButton.bind(this);
    }

    fetchArticles() {
        this.articlesComponent.fetch();
    }

    // "private"
    _onClickCreateButton(e, articleData) {
        e.preventDefault();
        this._client.createArticle(articleData)
            .then(data => {
                const { id } = data;
                console.log('CREATE SUCCESS!');
                this.createFormComponent.hide();
                this.updateFormComponent.fetch(id);
            })
            .catch(err => alert(`CREATE ERROR: ${JSON.stringify(err,null,2)}`));
    }

    _onClickUpdateArticleButton(e, articleId, articleData) {
        e.preventDefault();
        this._client.updateArticle(articleId, articleData)
            .then(data => {
                console.log(`SUCCESS! Updating fields. Data: ${JSON.stringify(data)}`);
                // Fetching updated data
                this.updateFormComponent.fetch(articleId);
                this.articlesComponent.fetch();
            })
            .catch(err => alert(JSON.stringify(err)));
    }

    _onClickArticleListItem(e, articleId) {
        e.preventDefault();
        // TODO: List Item Open in Update Form
        this._client.getArticle(articleId)
            .then(data => {
                this.updateFormComponent.populate(data);
                this.updateFormComponent.show();
            })
            .catch(err => alert(JSON.stringify(err)));
    }

    _onClickNewArticleButton(e) {
        e.preventDefault();
        // TODO: Mechanism for asking if they want to save? Diff articleData state for update form?
        this.updateFormComponent.hide();
        this.createFormComponent.show();
    }
}

// RUNNING MAIN
main();
})();