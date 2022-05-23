/*
 * MARKDOWN BLOG: GLOBAL VARIABLES, FUNCTIONS, and CLASSES
 */

// CSS CLASSES
const CSS_CLASSES = {
    LIST_ITEM: 'list-item',
    ARTICLE: 'article'
};

function _replaceState(state, url) {
    history.replaceState(state, '', url);
}

function _pushState(state, url) {
    history.pushState(state, '', url);
}

function showElement(el, displayType) {
    if (typeof displayType == 'undefined') {
        displayType = 'block';
    }
    el.style.display = displayType;
}

function showElementRemoveDisplay(el) {
    el.style.removeProperty('display');
}

function hideElement(el) {
    el.style.display = 'none';
}

class APIClient {
    constructor() {
        // Caching the API Base URL
        this._API_BASE_URL = this._getApiBaseUrl();
        this._API_ARTICLES_URL = `${this._API_BASE_URL}/articles`;

        // BIND
        this.getArticlesListing.bind(this);
        this.getArticle.bind(this);
        this.createArticle.bind(this);
        this.updateArticle.bind(this);

        this._getApiBaseUrl.bind(this);
        this._getArticleIdUrl.bind(this);
        this._processErrDataAxiosResponse.bind(this);
    }

    getArticlesListing() {
        return this._processErrDataAxiosResponse(axios.get(this._API_ARTICLES_URL));
    }
    
    getArticle(articleId) {
        return this._processErrDataAxiosResponse(axios.get(this._getArticleIdUrl(articleId)));
    }

    createArticle(articleData) {
        // Only keeping these fields in case more are submitted
        const { author, title, markdownContent } = articleData;
        articleData = { author, title, markdownContent };

        return this._processErrDataAxiosResponse(axios.post(this._API_ARTICLES_URL, articleData));
    }

    updateArticle(articleId, articleData) {
        // Only keeping these fields in case more are submitted
        const { author, title, markdownContent } = articleData;
        articleData = { author, title, markdownContent };
        return this._processErrDataAxiosResponse(axios.put(this._getArticleIdUrl(articleId), articleData));
    }

    // "private"
    _getApiBaseUrl() {
        let apiBase = '';
        if (window.location.hostname == 'localhost') {
            apiBase = 'http://localhost:8081';
        } else {
            // TODO: Can set your prod URL here
            apiBase = 'http://xyz';
        }
        apiBase = `${apiBase}/api`;
        return apiBase;
    }

    _getArticleIdUrl(articleId) {
        return `${this._API_ARTICLES_URL}/${articleId}`
    }

    _processErrDataAxiosResponse(axiosPromise) {
        return new Promise((accept, reject) => {
            axiosPromise
                .then(res => {
                    const { data, err } = res.data;
                    // alert(`res.data: ${JSON.stringify(res.data, null, 2)}`)
                    if (err) {
                        return reject(err);
                    }
                    accept(data);
                })
                .catch(err => reject(err));
        })
    }
}
