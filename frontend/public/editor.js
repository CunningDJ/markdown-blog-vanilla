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

class EditorArticles {
    _ELEMENT_ID = 'editor-articles';
    _LIST_ID = 'editor-articles-list';
    _MESSAGE_ID = 'editor-articles-message';

    constructor(apiClient, editor) {
        this._editor = editor;
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;

        this.element = document.getElementById(this._ELEMENT_ID);
        this.listElement = document.getElementById(this._LIST_ID);
        this.messageElement = document.getElementById(this._MESSAGE_ID);

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
                } else {
                    this.messageElement.textContent = '';
                }
                const fragment = document.createDocumentFragment();
                articlesListingData.forEach(articleData => {
                    const { articleId } = articleData;
                    const listItem = new EditorArticleListItem(articleId, articleData, this._editor._onClickUpdateButton);
                    fragment.appendChild(listItem.element);
                })
                // Clearing list contents
                this.listElement.innerHTML = '';
                // Adding new contents
                this.listElement.appendChild(fragment);
            })
            .catch(err => alert(err));
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

    constructor(articleId, articleData, onClickUpdate) {
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

        // UPDATE Button Element
        const updateButtonElement = document.createElement('button');
        updateButtonElement.textContent = 'UPDATE';
        updateButtonElement.onclick = e => onClickUpdate(e, articleId);

        this.element.appendChild(titleElement);
        this.element.appendChild(authorElement);
        this.element.appendChild(dateCreatedElement);
        this.element.appendChild(updateButtonElement);
    }
}

class EditorUpdateForm {
    _ELEMENT_ID = 'editor-update-form';
    _TITLE_ID = 'editor-update-form__title';
    _AUTHOR_ID = 'editor-update-form__author';
    _DATE_CREATED_ID = 'editor-update-form__date-created';
    _DATE_UPDATED_ID = 'editor-update-form__date-updated';
    _MARKDOWN_CONTENT_ID = 'editor-update-form__markdown-content';

    constructor(apiClient, editor) {
        this._editor = editor;
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;
        this.articleId = null;

        this.element = document.getElementById(this._ELEMENT_ID);
        this.title_element = document.getElementById(this._TITLE_ID);
        this.author_element = document.getElementById(this._AUTHOR_ID);
        this.dateCreated_element = document.getElementById(this._DATE_CREATED_ID);
        this.dateUpdated_element = document.getElementById(this._DATE_UPDATED_ID);
        this.markdownContent_element = document.getElementById(this._MARKDOWN_CONTENT_ID);

        // BIND
        this.fetch.bind(this);
        this.populate.bind(this);
        this.show.bind(this);
        this.hide.bind(this);
    }

    fetch(articleId) {
        // Fetches article's data by ID
        this._client.getArticle(articleId)
            .then(articleData => {
                this.populate(articleData)
            })
            .catch(err => alert(err));
    }

    populate(articleData) {
        const { id, author, title, dateCreated, dateUpdated, markdownContent } = articleData;
        this.articleId = id;
        this.title_element.textContent = title;
        this.author_element.textContent = author;
        this.dateCreated_element.textContent = (new Date(dateCreated)).toLocaleString();
        this.dateUpdated_element.textContent = (new Date(dateUpdated)).toLocaleString();
        this.markdownContent_element.value = markdownContent;
    }

    show() {
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}

class EditorCreateForm {
    _ELEMENT_ID = 'editor-create-form';
    _FORM_TITLE_CLASS = 'editor-create-form__title';
    _FORM_AUTHOR_CLASS = 'editor-create-form__author';
    _FORM_MARKDOWN_CONTENT_CLASS = 'editor-create-form__markdown-content';

    constructor(apiClient) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;
        this.element = document.getElementById(this._ELEMENT_ID);

        // BIND
        this.show.bind(this);
        this.hide.bind(this);
        // this.xx.bind(this);
        // this.xx.bind(this);
        // this.xx.bind(this);
    }

    show() {
        showElement(this.element);
    }

    hide() {
        hideElement(this.element);
    }
}

class NewArticleButton {
    _ELEMENT_ID = 'editor-new-article-button';

    constructor(onclick) {
        this._editor;
        this.element = document.getElementById(this._ELEMENT_ID);
    }
}


class Editor {
    constructor(apiClient) {
        if (typeof apiClient == 'undefined') {
            apiClient = new APIClient();
        }
        this._client = apiClient;
        this.newArticleButtonComponent = new NewArticleButton(this._onClickNewArticleButton);
        this.articlesComponent = new EditorArticles(this._client, this);
        this.updateFormComponent = new EditorUpdateForm(this._client, this);
        this.createFormComponent = new EditorCreateForm(this._client, this);

        // BIND
        this.fetchArticles.bind(this);
        this._onClickUpdateButton.bind(this);
        this._onClickNewArticleButton.bind(this);
        // this.xx.bind(this);
    }

    fetchArticles() {
        this.articlesComponent.fetch();
    }

    // "private"
    _onClickUpdateButton(e, articleId) {
        e.preventDefault();
        // TODO: Update Article Button Click
    }

    _onClickNewArticleButton(e) {
        e.preventDefault();
        // TODO: Mechanism for asking if they want to save? Diff articleData state for update form?
        this.updateForm.component.hide();
        this.createFormComponent.show();
    }
}

// RUNNING MAIN
main();
})();